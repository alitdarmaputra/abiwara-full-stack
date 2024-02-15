import { useState } from "react";
import { FaAngleRight } from "react-icons/fa6";

export default function Collapse({ label, children, ...props }) {
	const [ isExpand, setExpand ] = useState(false);

	return (
		<div {...props} >
			<button className="mb-2 flex items-center text-start text-xl gap-2 font-bold roboto-bold dark:text-gray-200" onClick={() => setExpand(!isExpand)}>
				<FaAngleRight className={`${ isExpand ? "rotate-90" : "rotate-0" }`} />
				{label}
			</button>
			<hr className="mb-4"/>
			<div className={`overflow-hidden ${ isExpand ? "h-auto" : "h-0" } text-gray-700 dark:text-gray-400 transition-all ease-in`}>
				{ children }
			</div>
		</div>
	)
}
