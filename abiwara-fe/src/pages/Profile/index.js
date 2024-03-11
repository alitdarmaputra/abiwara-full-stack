import { useContext, useEffect, useState } from "react";
import { FaCakeCandles } from "react-icons/fa6";
import { Link } from "react-router-dom";
import axiosInstance from "../../config";
import httpRequest from "../../config/http-request";
import { useAuth } from "../../context/auth";
import { UserContext } from "../../context/user";
import { parseJWT } from "../../utils/jwt";

export default function Profile() {
	const { user, setUser } = useContext(UserContext);
	const joinedDate = new Date(user.created_at);
	const [isLoading, setLoading] = useState(true);
	const {authToken} = useAuth();	
	const token = parseJWT(authToken);

	useEffect(() => {
		const getUserData = async() => {
			try {
				const res = await axiosInstance.get(`${httpRequest.api.baseUrl}/user/me`).then(res => res.data);
				let userData = res.data;
				setUser({ role: token.role, ...userData });
				setLoading(false);
			} catch(err) {
				console.log(err);
			}	
		}
		getUserData();
	}, [setUser, token.role])
	

    if (isLoading) {
        return (
            <div className="w-full h-screen flex justify-center items-center dark:bg-[#1A202C]">
                <svg aria-hidden="true" role="status" className="inline w-8 h-8 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                </svg>
            </div>
        )
    }

	return (
		<div id="profile">
			<div className="w-screen h-40 bg-[#110978]"></div>
			<section className="flex justify-center bg-white py-16 md:pt-20 px-4 md:px-0 dark:bg-[#161B26]">
				<div className="w-full max-w-6xl text-center relative">
					<div id="navbar__profile" className="absolute -top-28 w-full flex justify-center items-center">
						<div className="w-36 h-36 rounded-full bg-gray-300 overflow-hidden border-8 border-white dark:border-[#161B26]">
							<img className="object-cover w-full h-full" src={user?.img.image_url} alt="user-profile"/>
						</div>
					</div>
					<h1 className="text-xl font-bold roboto-bold mt-10 mb-2 dark:text-gray-200">{user.name} | {user.class} {user.absence_number}</h1>
					<h3 className="mb-4 text-gray-500">{user?.role === 1 ? "Admin" : user?.role === 2 ? "Operator" : "Anggota"}</h3>

					<h3 className="text-gray-500 flex mb-10 gap-2 justify-center items-center"><FaCakeCandles />Bergabung pada {joinedDate.getDate()}-{joinedDate.getMonth()}-{joinedDate.getFullYear()}</h3>
					<Link to="/me/edit" className="text-xs roboto rounded-lg border border-gray-500 px-4 py-2 hover:cursor-pointer hover:bg-black hover:text-white transition-all ease-in dark:text-white dark:hover:bg-gray-100 dark:hover:text-black">Edit Profile</Link>
				</div>
			</section>
		</div>
	)
}
