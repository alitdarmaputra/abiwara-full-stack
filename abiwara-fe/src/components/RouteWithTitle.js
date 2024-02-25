import { Helmet } from "react-helmet-async";

export default function RouteWithTitle({ title, children }) {
	return (
		<>
			<Helmet>
				<title>{title}</title>
			</Helmet>
			{children}
		</>
	)
}
