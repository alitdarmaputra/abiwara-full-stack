import { useState } from "react";
import { BsCloudDownloadFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axiosInstance from "../../config";
import httpRequest from "../../config/http-request";
import { notifyError } from "../../utils/toast";

export default function BookBulkCreate() {
	const [isLoading, setLoading] = useState(false);
	const navigate = useNavigate();
	
    const handleDownload = () => {
        async function getBook() {
            let res = await axiosInstance.get(`${httpRequest.api.baseUrl}/book/bulk-create`, {
                headers: {
                    "Content-Type": "text/csv"
                },
                responseType: "blob"
            });
            const url = window.URL.createObjectURL(res.data)
            const link = document.createElement("a");
            link.href = url
            link.setAttribute(
                "download",
                "format-file-upload.csv"
            )

            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)
        }

        getBook()
    }
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		const form = document.getElementById("file-upload__form");
		const formData = new FormData(form);
		try {
			setLoading(true);
			let res = await axiosInstance.post(`${httpRequest.api.baseUrl}/book/bulk-create`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})

            if (res.status === 201) {
                navigate("/book");
            }
			setLoading(false);
		} catch(err) {
			if (err.response.data.code === 413) {
				notifyError("Ukuran file terlalu besar");
			} else if (err.response.data.code === 400 ) {
				notifyError("Format file tidak didukung");
			} else {
				notifyError("Server error");
				console.log(err);
			}
			setLoading(false);
		}
	}

	return (
        <div className="flex-grow w-full">
            <ToastContainer />

            <div className="bg-white rounded-lg mb-10 p-5 dark:bg-[#2D3748] dark:text-gray-200">
				<div className="flex mb-10">
					<Link className="h-10 px-4 bg-gray-500 text-white font-bold shadow-md rounded-md flex justify-center items-center download-csv" onClick={handleDownload}>
						<BsCloudDownloadFill></BsCloudDownloadFill> <span className="hidden md:block pl-2">Unduh Contoh File</span>
					</Link>
				</div>
				<form onSubmit={handleSubmit} id="file-upload__form">
					<p className="font-bold text-sm mb-3">File bulk create</p>
					<p className="text-xs mb-3 text-gray-500">Tipe file .csv. Ukuran maksimum 4 mb </p>
					<input id="bulk-file_input" type="file" accept=".csv" name="file" />

					{isLoading ?
						<button disabled type="button" className="mt-10 w-full h-10 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-900">
							<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
								<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
							</svg>
							Memuat...
						</button>
						:
						<button type="submit" className="mt-10 w-full h-10 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-900">Buat</button>
					}
				</form>
            </div>
        </div>

	)
}
