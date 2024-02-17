import axios from 'axios';
import { ReactComponent as Logo } from "../../assets/logo.svg";
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import httpRequest from '../../config/http-request';
import { notifyError } from '../../utils/toast';
import { AiFillCheckCircle } from 'react-icons/ai';

export default function Register() {
    const [isHide, setHide] = useState(true);
    const [isLoading, setLoading] = useState(false);
	const [theme, _] = useState(localStorage.getItem("theme"));
    const navigate = useNavigate()
    const [isLen, setLen] = useState(false);
    const [isCase, setCase] = useState(false);
    const [isChar, setChar] = useState(false);

    const email = useRef()
    const name = useRef()
    const className = useRef()
    const password = useRef()
    const confirmPassword = useRef()

    const casePattern = /^(?=.*[a-z])(?=.*[A-Z]).+$/;
    const charPattern = /[!@#$%^&*(),.?":{}|<>]/

    const updatePasswordView = e => {
        e.preventDefault();
        setHide(!isHide)
        let passwordInput = document.getElementById("password_input")
        let confirmInput = document.getElementById("confirm_password_input")
        passwordInput.type = passwordInput.type === "password" ? "text" : "password";
        confirmInput.type = confirmInput.type === "password" ? "text" : "password";
    }

    const handleRegister = async e => {
        e.preventDefault();
        const data = {
            email: email.current.value,
            name: name.current.value,
            class: className.current.value,
            password: password.current.value,
            confirm_password: confirmPassword.current.value
        }

        if (data.email === "") {
            notifyError("Email tidak boleh kosong")
            return
        }

        if (data.name === "") {
            notifyError("Nama Lengkap tidak boleh kosong")
            return
        }

        if (data.class === "") {
            notifyError("Kelas tidak boleh koosong")
            return
        }

        if (data.password === "") {
            notifyError("Password tidak boleh kosong")
            return
        }

        if (data.password !== data.confirm_password) {
            notifyError("Password dan konfirmasi password tidak sama")
            return
        }

        if (data.password.length <= 8 || !casePattern.test(data.password) || !charPattern.test(data.password)) {
            notifyError("Password tidak sesuai")
            return
        }

        try {
            setLoading(true)
            const res = await axios.post(`${httpRequest.api.baseUrl}/auth/register`, data).then(res => res.data)
            setLoading(false)

            if (res.code === 201) {
                navigate("/register/verification")
            }
        } catch (err) {
            setLoading(false)
            if (err.response?.status === 409) {
                notifyError("Email telah digunakan");
                return;
            }
            notifyError("Gagal melakukan registrasi")
        }
    }

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [theme]);

    return (
        <div className="w-full flex justify-center dark:bg-[#1A202C] dark:text-gray-200">
            <ToastContainer />
            <div className="register_container px-5">
                <div className="register_header">
					<Link to="/" className="flex justify-center items-center gap-2 mb-10 mt-10">
						<Logo width="40" height="40" fill="white" />
						<h3 className={`poppins-semibold dark:text-gray-200 text-2xl`}>Abiwara</h3>
					</Link>
                    <h1 className="title mt-8 text-3xl">Daftar</h1>
                    <p className="sub_title mt-3 text-sm text-slate-500">Mulai dengan membuat akun baru.</p>
                </div>

                <div className="register_form">
                    <form className="mt-6" action="">
                        <div className="email_form">
                            <label className="font-bold text-sm" htmlFor="email_input">Email <span className="text-red-500">*</span></label>
                            <input ref={email} id="email_input" placeholder="Email" className="font-sans focus:outline-none focus:shadow-md focus:shadow-blue-200 dark:focus:shadow-none dark:bg-[#2D3748] mt-2 w-full h-10 rounded-md p-2" type="email"></input>
                        </div>
                        <div className="name_form mt-5">
                            <label className="font-bold text-sm" htmlFor="name_input">Nama Lengkap <span className="text-red-500">*</span></label>
                            <input ref={name} id="name_input" placeholder="Nama lengkap" className="font-sans focus:outline-none focus:shadow-md focus:shadow-blue-200 dark:focus:shadow-none dark:bg-[#2D3748] mt-2 w-full h-10 rounded-md p-2" type="text"></input>
                        </div>
                        <div className="class_form mt-5">
                            <label className="font-bold text-sm" htmlFor="class_input">Kelas <span className="text-red-500">*</span></label>
                            <select ref={className} className='block w-full h-10 font-sans bg-white rounded-md p-2 dark:bg-[#2D3748] mt-2' id="class_input" name="class">
                                <optgroup label='Kelas VII'>
                                    <option value="VIIA">VIIA</option>
                                    <option value="VIIB">VIIB</option>
                                    <option value="VIIC">VIIC</option>
                                    <option value="VIID">VIID</option>
                                    <option value="VIIE">VIIE</option>
                                </optgroup>
                                <optgroup label='Kelas VIII'>
                                    <option value="VIIIA">VIIIA</option>
                                    <option value="VIIIB">VIIIB</option>
                                    <option value="VIIIC">VIIIC</option>
                                    <option value="VIIID">VIIID</option>
                                    <option value="VIIIE">VIIIE</option>
                                </optgroup>
                                <optgroup label='Kelas IX'>
                                    <option value="IXA">IXA</option>
                                    <option value="IXB">IXB</option>
                                    <option value="IXC">IXC</option>
                                    <option value="IXD">IXD</option>
                                    <option value="IXE">IXE</option>
                                </optgroup>
                                <optgroup label='Lainnya'>
                                    <option value="Lainnya">Lainnya</option>
                                </optgroup>
                            </select>
                        </div>
                        <div className="password_form mt-5">
                            <label className="font-bold text-sm" htmlFor="password_input">Password <span className="text-red-500">*</span></label>
                            <input ref={password} id="password_input" placeholder="Password" className="font-sans focus:outline-none focus:shadow-md focus:shadow-blue-200 dark:bg-[#2D3748] dark:focus:shadow-none mt-2 w-full h-10 rounded-md p-2" type="password"
                                onChange={() => {
                                    if (password.current.value.length >= 8) {
                                        setLen(true);
                                    } else {
                                        setLen(false);
                                    }

                                    if (casePattern.test(password.current.value)) {
                                        setCase(true);
                                    } else {
                                        setCase(false);
                                    }

                                    if (charPattern.test(password.current.value)) {
                                        setChar(true);
                                    } else {
                                        setChar(false);
                                    }
                                }}>
                            </input>
                            <div className={`len_validation__container flex items-center mt-5 w-full ${isLen ? "text-green-500" : "text-slate-400"}`}>
                                <AiFillCheckCircle className='text-xl'></AiFillCheckCircle>
                                <p className='ml-2'>Memiliki panjang lebih dari 8 karakter</p>
                            </div>
                            <div className={`case_validation__container flex items-center mt-2 w-full ${isCase ? "text-green-500" : "text-slate-400"}`}>
                                <AiFillCheckCircle className='text-xl'></AiFillCheckCircle>
                                <p className='ml-2'>Terdiri dari huruf besar dan kecil</p>
                            </div>
                            <div className={`case_validation__container flex items-center mt-2 w-full ${isChar ? "text-green-500" : "text-slate-400"}`}>
                                <AiFillCheckCircle className='text-xl'></AiFillCheckCircle>
                                <p className='ml-2'>Terdiri dari kombinasi huruf, angka, dan simbol</p>
                            </div>
                        </div>
                        <div className="confirm_password_form mt-5">
                            <label className="font-bold text-sm" htmlFor="confirm_password_input">Konfirmasi Password <span className="text-red-500">*</span></label>
                            <input ref={confirmPassword} id="confirm_password_input" placeholder="Konfirmasi password" className="font-sans dark:bg-[#2D3748] dark:focus:shadow-none focus:outline-none focus:shadow-md focus:shadow-blue-200 mt-2 w-full h-10 rounded-md p-2 " type="password"></input>
                        </div>

                        <div className="view_password_form mt-5">
                            <input id="view_password" onInput={e => updatePasswordView(e)} type="checkbox"></input>
                            <label className="ml-2 text-sm" htmlFor="view_password_input">Tampilkan password</label>
                        </div>

                        {isLoading ?
                            <button disabled type="button" className="mt-10 w-full h-10 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-900">
                                <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                </svg>
                                Memuat...
                            </button>
                            :
                            <button className="mt-10 w-full h-10 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-900" onClick={handleRegister}>Daftar</button>
                        }

                    </form>

                    <p className="mt-8 mb-32">Sudah punya akun? <NavLink className="underline text-blue-700" to="/login">Masuk disini.</NavLink></p>
                </div>
            </div >
        </div >
    );
}
