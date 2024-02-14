import { MdClose } from "react-icons/md";

export default function Modal({ active, setActive, title, children, action }) {
    if (!active) {
        return <></>
    }

    return (
        <div className="modal__container fixed flex items-center justify-center bg-black/50 left-0 top-0 right-0 bottom-0 bg-black font-montserrat">
            <div className="modal__wrapper bg-white w-full mx-2 md:mx-0 md:w-1/2 rounded-lg p-5 z-10">
                <div className="mb-5 modal__header flex items-center justify-between">
                    <div className="left-header opacity-100 font-bold text-xl">
                        {title}
                    </div>
                    <div className="right-header text-2xl p-1 hover:bg-slate-100 hover:cursor-pointer text-slate-500 hover:text-black rounded-lg font-bold" onClick={() => setActive(!active)}>
                        <MdClose></MdClose>
                    </div>
                </div>
                <hr className="mb-5"></hr>
                <div className="modal__content mb-5">
                    {children}
                </div>
                <hr className="mb-5"></hr>
                <div className="modal__footer flex items-center">
                    <div className="yes-footer w-24 py-2 rounded-lg text-center bg-blue-700 text-white hover:bg-blue-800 hover:cursor-pointer" onClick={async () => { if (await action()) setActive(false) }
                    }>Iya</div>
                    <div className="cancle-footer ml-3 w-24 py-2 rounded-lg text-center bg-white hover:bg-gray-100 hover:cursor-pointer text-gray-500 border border-gray-200" onClick={() => setActive(!active)}>Batalkan</div>
                </div>
            </div>
        </div>
    )
}
