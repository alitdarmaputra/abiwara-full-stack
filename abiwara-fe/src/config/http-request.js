const httpRequest = {
    api: {
        baseUrl: process.env.REACT_APP_API_URL,
    },
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
    }
}

export default httpRequest;

