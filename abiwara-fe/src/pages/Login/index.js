import { useRef, useState } from 'react'
import { AiOutlineEyeInvisible, AiOutlineEye, AiOutlineMail, AiOutlineKey } from 'react-icons/ai'
import { ReactComponent as Logo } from "../../assets/logo.svg";
import { Navigate, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/auth'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { notifyError } from '../../utils/toast'
import httpRequest from '../../config/http-request'
import axios from 'axios';

export default function Login() {
    const [isHide, setHide] = useState(true);
    const auth = useAuth()

	// get redirect path if user is redirected after authenticated 
	const location = useLocation();
    const redirectPath = location.state?.path || '/';

	const email = useRef('')
    const password = useRef('')

    const handleLogin = async e => {
        e.preventDefault()

        let data = {
            email: email.current.value,
            password: password.current.value
        }

        if (data.email === "" || data.password === "") {
            notifyError("Email dan password wajib diisi")
            return
        }

        try {
            const res = await axios.post(`${httpRequest.api.baseUrl}/auth/login`, data).then(res => res.data);
            let token = res.data;
			
			// Save auth token to local storage
			auth.setAuthToken(token);
        } catch (err) {
            if (err.response?.status === 401) {
                notifyError("Email dan password salah")
            } else if (err.response?.status === 400) {
                notifyError("Masukan tidak sesuai");
            } else {
                notifyError("Server error")
            }
        }
    }

    const updatePasswordView = e => {
        e.preventDefault();
        setHide(!isHide);
        var input = document.getElementById("password_input");
        input.type = input.type === "password" ? "text" : "password";
    }
	
	if (auth.authToken) {
        return <Navigate replace to={redirectPath}></Navigate>
	}

    return (
        <div className="login_container flex h-screen">
            <ToastContainer />

            <div className="left_hero_container hidden md:block h-full w-1/3 group overflow-hidden">
                <h1 className='z-10 font-bold absolute top-40 text-3xl left-8 text-white'>Jelajahi berbagai <br></br> ilmu baru</h1>
                <div className="absolute w-1/3 h-full inset-0 bg-gradient-to-b from-transparent via-gray-700 to-black opacity-60"></div>
                <p className='absolute bottom-4 left-4 text-white self-end text-center mt-11'>
                    © 2023 Abiwara. All rights reserved.
                </p>
                <div className="login_img bg-[url('/src/assets/login-image.jpg')] bg-cover h-full w-full"></div>
            </div>

            <div className="login_form_container flex grow justify-center items-center dark:bg-[#1A202C] dark:text-gray-200">
                <div className="box-border login_form">
					<div className="flex justify-center items-center gap-2 mb-10">
						<Logo width="40" height="40" fill="white" />
						<h3 className={`poppins-semibold dark:text-gray-200 text-2xl`}>Abiwara</h3>
					</div>

                    <h1 className="title text-3xl">Selamat Datang</h1>
                    <p className="sub_title mt-3 text-sm text-slate-500">Silahkan masukkan email dan password anda.</p>

                    <form className="mt-8 md:w-96">
                        <div className="email_form">
                            <label className="font-bold text-sm" htmlFor="email_input">Email <span className="text-red-500">*</span></label>
                            <div className="email_input_button flex mt-2 focus-within:shadow-md focus-within:shadow-blue-200 dark:focus-within:shadow-none rounded-md items-center">
                                <div className='h-10 bg-blue-50 rounded-l-md flex items-center p-1 dark:bg-[#2D3748]'><AiOutlineMail className='shadow-sm text-3xl bg-white p-1 rounded-md text-blue-500 dark:bg-[#2D3748]'></AiOutlineMail></div>
                                <input id="email_input" ref={email} placeholder="Email" className="font-sans bg-blue-50 focus:outline-none w-full h-10 rounded-r-lg p-2 dark:bg-[#2D3748]" type="email"></input>
                            </div>
                        </div>
                        <div className="mt-5 password-form">
                            <label className="font-bold text-sm" htmlFor="password_input">Password <span className="text-red-500">*</span></label>
                            <div className="password_input_button flex mt-2 focus-within:shadow-md focus-within:shadow-blue-200 dark:focus-within:shadow-none rounded-md">
                                <div className='h-10 bg-blue-50 rounded-l-md flex items-center p-1 dark:bg-[#2D3748]'><AiOutlineKey className='shadow-sm text-3xl bg-white p-1 rounded-md text-blue-500 dark:bg-[#2D3748]'></AiOutlineKey></div>
                                <input id="password_input" ref={password} placeholder="Password" className="font-sans bg-blue-50 focus:outline-none w-full h-10 p-2 dark:bg-[#2D3748]" type="password"></input>
                                <button className='bg-blue-50 rounded-r-md px-1 text-slate-300 dark:bg-[#2D3748]' onClick={e => updatePasswordView(e)} type='button'>
                                    {
                                        isHide ? <AiOutlineEyeInvisible size='30px' /> : <AiOutlineEye size='30px' />
                                    }
                                </button>
                            </div>
                        </div>
                        <div className="forget_password mt-5 flex justify-end text-blue-700">
                            <NavLink className="hover:underline" to="/forget-password">Lupa password</NavLink>
                        </div>
                        <button className="mt-5 w-full h-10 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-900" onClick={handleLogin}>Masuk</button>
                    </form>

                    <p className="mt-8">Belum punya akun? <NavLink className="underline text-blue-700" to="/register">Daftar disini.</NavLink></p>


                </div>
            </div>
        </div>
    );
}
