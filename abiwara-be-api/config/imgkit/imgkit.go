package imgkit

import (
	"github.com/alitdarmaputra/abiwara-full-stack/abiwara-be-api/config"
	"github.com/imagekit-developer/imagekit-go"
)

func NewImgKit(cfg *config.ImgKit) *imagekit.ImageKit {
	ik := imagekit.NewFromParams(imagekit.NewParams{
		PublicKey:   cfg.ImgKitPublicKey,
		PrivateKey:  cfg.ImgKitPrivateKey,
		UrlEndpoint: cfg.ImgKitUrlEndpoint,
	})

	return ik
}
