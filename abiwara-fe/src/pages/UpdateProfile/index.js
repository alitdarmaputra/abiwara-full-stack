import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";

export function UpdateProfile() {
	const auth = useAuth();
	const navigate = useNavigate();
	return (
		<button onClick={() => {
			navigate(0)
		}}>update profile</button>
	)
}
