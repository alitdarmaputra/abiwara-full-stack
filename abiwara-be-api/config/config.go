package config

import (
	"log"
	"reflect"
	"strings"

	"github.com/spf13/viper"
)

type Api struct {
	Host                  string   `json:"host"                         mapstructure:"APP_HOST"`
	Port                  int      `json:"port"                         mapstructure:"APP_PORT"`
	Env                   string   `json:"env"                          mapstructure:"ENV"`
	JWTSecretKey          string   `json:"-"                            mapstructure:"JWT_SECRET_KEY"`
	JWTExpiredTime        int      `json:"jwt_expired_time"             mapstructure:"JWT_EXPIRED"`
	ResetTokenExpiredTime int      `json:"reset_token_expiredbali_time" mapstructure:"RESET_TOKEN_EXPIRED"`
	Database              Database `json:"database"`
	SMTP                  SMTP     `json:"smtp"`
}

type Database struct {
	Host     string `json:"host"     mapstructure:"DATABASE_HOST"`
	Port     int    `json:"port"     mapstructure:"DATABASE_PORT"`
	Username string `json:"username" mapstructure:"DATABASE_USERNAME"`
	Password string `json:"password" mapstructure:"DATABASE_PASSWORD"`
	Schema   string `json:"schema"   mapstructure:"DATABASE_SCHEMA"`
	Loc      string `json:"loc"      mapstructure:"DATABASE_LOC"`
}

type SMTP struct {
	ClientOrigin string `json:"client_origin" mapstructure:"CLIENT_ORIGIN"`
	EmailFrom    string `json:"from"          mapstructure:"EMAIL_FROM"`
	Host         string `json:"smtp_host"     mapstructure:"SMTP_HOST"`
	Port         int    `json:"smtp_port"     mapstructure:"SMTP_PORT"`
	Username     string `json:"smtp_username" mapstructure:"SMTP_USERNAME"`
	Password     string `json:"smtp_password" mapstructure:"SMTP_PASSWORD"`
}

func structToMap(input interface{}) map[string]interface{} {
	result := make(map[string]interface{})

	// Convert interface to reflect.Value
	val := reflect.ValueOf(input)

	// Ensure the input is a struct
	if val.Kind() != reflect.Struct {
		panic("input must be a struct")
	}

	// Get the type of the struct
	typ := val.Type()

	// Iterate over the fields of the struct
	for i := 0; i < val.NumField(); i++ {
		field := val.Field(i)
		fieldType := typ.Field(i)

		// Use mapstructure tag if available, otherwise use field name
		tag := fieldType.Tag.Get("mapstructure")

		// If the field is a struct, recursively convert it to a map
		if fieldType.Type.Kind() == reflect.Struct {
			result[tag] = structToMap(field.Interface())
		} else {
			result[tag] = field.Interface()
		}
	}

	return result
}

func iterateMap(prefix string, m map[string]interface{}) {
	for key, value := range m {
		switch v := value.(type) {
		case map[string]interface{}:
			iterateMap(prefix+key+".", v) // Recursively iterate nested map
		default:
			viper.BindEnv(key)
		}
	}
}

func LoadConfigAPI(path string) *Api {
	viper.SetDefault("ENV", "development")
	viper.SetDefault("APP_PORT", 4001)
	viper.SetDefault("APP_HOST", "127.0.0.1")

	if path := strings.TrimSpace(path); path == "" {
		path = "."
	}

	api := &Api{}
	mapApi := structToMap(Api{})
	iterateMap("", mapApi)

	viper.AddConfigPath(path)
	viper.SetConfigName(".env")
	viper.SetConfigType("env")

	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		log.Println("read config failed:", err.Error())
	}

	viper.Unmarshal(api)
	viper.Unmarshal(&api.Database)
	viper.Unmarshal(&api.SMTP)

	return api
}
