import { createContext, useEffect, useState } from "react"
import axiosInstance from "../config";
import httpRequest from "../config/http-request";
import { parseJWT } from "../utils/jwt";
import { useAuth } from "./auth";

export const UserContext = createContext(null);

export const UserProvider = ({ children  }) => {
	const [user, setUser] = useState();
	const {authToken} = useAuth();	
	const token = parseJWT(authToken);

	useEffect(() => {
		const getUserData = async() => {
			try {
				if (authToken) {
					const res = await axiosInstance.get(`${httpRequest.api.baseUrl}/member/me`).then(res => res.data);
					let userData = res.data;
					setUser({ role: token.role, ...userData });
				}
			} catch(err) {
				console.log(err);
			}	
		}
		getUserData();
	}, [authToken])
	
	return (
		<UserContext.Provider value={{ user, setUser }}>
			{ children }
		</UserContext.Provider>
	)
}
