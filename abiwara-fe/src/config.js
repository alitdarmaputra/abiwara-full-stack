import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
	function(config) {
		const authToken = localStorage.getItem("auth_token");

		if (authToken) {
			config.headers["Authorization"] = `Bearer ${authToken}`;
		}
		return config
	},
	function(error) {
		return Promise.reject(error);
	}
)

export default axiosInstance;
