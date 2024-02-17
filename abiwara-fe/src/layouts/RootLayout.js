import { Outlet } from "react-router";
import { ScrollRestoration } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function RootLayout() {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
			<ScrollRestoration />
        </>
    )
}

