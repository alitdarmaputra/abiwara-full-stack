export const parseJWT = token => {
    // terminate operation if token is invalid
    if (!token) {
        return;
    }

    // Split the token and taken the second
    const base64Url = token.split(".")[1];

    // Replace "-" with "+"; "_" with "/"
    const base64 = base64Url.replace("-", "+").replace("_", "/");

    // return the result parsed in JSON
    return JSON.parse(window.atob(base64));
}
