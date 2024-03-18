import { useContext, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axiosInstance from "../../config";
import httpRequest from "../../config/http-request";
import { useAuth } from "../../context/auth";
import { UserContext } from "../../context/user";
import { notifyError } from "../../utils/toast";

export default function EditProfile() {
	const { user } = useContext(UserContext);
	const [profileImg, setProfileImg] = useState(user.img || {});
	const [isLoading, setLoading] = useState(false);
	const { setAuthToken } = useAuth();
	const [isLoadingImg, setLoadingImg] = useState(false);
	const navigate = useNavigate();

    const handlesubmitEditProfile = async e => {
        e.preventDefault()

        const name_input = document.querySelector("#name_input");
		const class_input = document.querySelector("#class_input");
		const absence_input = document.querySelector("#absence_input");

        if (name_input.value === "" || class_input.value === "") {
            notifyError("Pastikan semua field sudah terisi")
            return
        }
		
		if (absence_input.value !== "" && isNaN(absence_input.value)) {
            notifyError("Format nomor absen tidak sesuai");
            return
		}

        const payload = {
			profile_img: profileImg.id || null,
			name: name_input.value,
			absence_number: parseInt(absence_input.value),
			class: class_input.value,
        }
	
        try {
			setLoading(true);
            await axiosInstance.put(`${httpRequest.api.baseUrl}/user/me`, payload);
			navigate("/me");
			setLoading(false);
        } catch (err) {
			if (err.response.data.code === 400 ) {
				notifyError("Masukkan tidak sesuai");
			} else if (err.response.data.code === 401 ) {
				notifyError("Sesi telah berakhir");
				setAuthToken();
			} else {
				notifyError("Server error");
				console.log(err);
			}
			setLoading(false);
        }
    }

	const handleSubmitImg = async e => {
		e.preventDefault();
		const form = document.getElementById("profile-image__form");
		const formData = new FormData(form);
		try {
			setLoadingImg(true);
			let res = await axiosInstance.post(`${httpRequest.api.baseUrl}/image-upload`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			setLoadingImg(false);
			setProfileImg(res.data?.data);
		} catch(err) {
			notifyError("File tidak sesuai");
			setLoadingImg(false);
		}
	}
	
	const handleDeleteImg = () => {
		setLoadingImg(true);
		axiosInstance.delete(`${httpRequest.api.baseUrl}/image-upload/${profileImg.id}`)
		.then(() => {
			setLoadingImg(false);
			setProfileImg({});
		})
		.catch((err) => {
			console.log(err)
		})
	}

	return (
		<div id="profile">
            <ToastContainer />
			<div className="w-screen h-40 bg-[#110978]"></div>
			<section className="flex justify-center bg-white py-16 md:pt-20 px-4 md:px-0 dark:bg-[#161B26]">
				<div className="w-full max-w-6xl relative">
					<form id="profile-image__form" className="mt-10" onChange={handleSubmitImg}>
						<div id="navbar__profile" className="absolute -top-28 w-full flex flex-col md:flex-row items-center gap-4 md:gap-10">
							<div className="w-28 h-28 md:w-36 md:h-36 relative rounded-full bg-gray-300 overflow-hidden border-8 border-white dark:border-[#161B26]">
								{
									isLoadingImg && (
										<div className="w-full h-full flex items-center justify-center">
											<svg aria-hidden="true" role="status" className="absolute w-10 h-10 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
												<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
											</svg>
										</div>
									)
								}
								<img className="object-cover w-full h-full" src={profileImg.id ? profileImg.image_url : "/img/default-avatar.png" } alt="user-profile"/>
							</div>
							<div className="md:translate-y-14">
								<p className="font-bold text-sm mb-3 dark:text-white">Foto Profile</p>
								<p className="text-xs mb-3 text-gray-500">Tipe file .png / .jpeg. Ukuran maksimum 4 mb </p>
								<div className="flex w-full mb-10 justify-center dark:text-white">
									<input id="cover-image_input" type="file" accept="image/png, image/jpeg" name="image" required/>
									<div className="flex items-center gap-4">
										{
											profileImg.id && !isLoadingImg && (
												<button className="dark:text-white" onClick={() => handleDeleteImg()}><FaTrash /></button>
											)
										}
									</div>
								</div>
							</div>
						</div>
					</form>

					<section className="dark:text-white md:w-1/2 mt-40 md:mt-20">
                        <div className="name_form mt-5">
                            <label className="font-bold text-sm" htmlFor="name_input">Nama Lengkap <span className="text-red-500">*</span></label>
                            <input defaultValue={user.name} id="name_input" placeholder="Nama lengkap" className="font-sans focus:outline-none focus:shadow-md focus:shadow-blue-200 dark:focus:shadow-none bg-gray-100 dark:bg-[#2D3748] mt-2 w-full h-10 rounded-md p-2" type="text"></input>
                        </div>
                        <div className="absence_form mt-5">
                            <label className="font-bold text-sm" htmlFor="absence_input">Nomor Absen</label>
                            <input defaultValue={user.absence_number} id="absence_input" placeholder="Nomor absen" className="font-sans focus:outline-none focus:shadow-md focus:shadow-blue-200 dark:focus:shadow-none bg-gray-100 dark:bg-[#2D3748] mt-2 w-full h-10 rounded-md p-2" type="text"></input>
                        </div>
                        <div className="class_form mt-5">
                            <label className="font-bold text-sm" htmlFor="class_input">Kelas <span className="text-red-500">*</span></label>
                            <select defaultValue={user.class} className='block w-full h-10 font-sans rounded-md p-2 bg-gray-100 dark:bg-[#2D3748] mt-2' id="class_input" name="class">
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
					</section>
					{isLoadingImg ? (
						<button disabled className="mt-10 text-xs roboto rounded-lg border border-gray-500 px-4 py-2 hover:cursor-pointer hover:bg-black hover:text-white transition-all ease-in dark:text-white dark:hover:bg-gray-100 dark:hover:text-black bg-gray-300">Simpan Profile</button>
					) : (
						<>
						{isLoading ?
							<button disabled type="button" className="text-black mt-10 text-xs roboto rounded-lg border border-gray-500 px-4 py-2 hover:cursor-pointer hover:bg-black hover:text-white transition-all ease-in dark:text-white dark:hover:bg-gray-100 dark:hover:text-black bg-gray-300">
								<svg aria-hidden="true" role="status" className="dark:text-black inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
									<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
								</svg>
								Memuat...
							</button>
							:
							<button className="mt-10 text-xs roboto rounded-lg border border-gray-500 px-4 py-2 hover:cursor-pointer hover:bg-black hover:text-white transition-all ease-in dark:text-white dark:hover:bg-gray-100 dark:hover:text-black" onClick={handlesubmitEditProfile}>Simpan Profile</button>
						}
						</>
					)}
				</div>
			</section>
		</div>
	)
}
