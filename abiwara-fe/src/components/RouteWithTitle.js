import { Helmet } from "react-helmet";

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
