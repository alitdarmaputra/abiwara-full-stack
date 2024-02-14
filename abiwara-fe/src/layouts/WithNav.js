import React from "react";
import { Outlet } from "react-router-dom";
import SideNavbar from "../components/SideNavbar";
import TopNavbar from "../components/TopNavbar";
import { UserProvider } from "../context/user";

export default function WithNav() {
    const [active, setActive] = React.useState(0);

    return (
        <div className="flex-col">
			<UserProvider>
				<TopNavbar path=" Beranda" title="Beranda" className="bg-slate-50"></TopNavbar>
				<SideNavbar active={active} setActive={setActive} />
				<Outlet></Outlet>
			</UserProvider>
        </div>
    );
}
