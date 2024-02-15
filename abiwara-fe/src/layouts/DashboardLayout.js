import React from "react";
import { Outlet } from "react-router-dom";
import SideNavbar from "../components/SideNavbar";
import TopNavbar from "../components/TopNavbar";

export default function DashboardLayout() {
    const [active, setActive] = React.useState(0);

    return (
		<div className="flex">
			<SideNavbar active={active} setActive={setActive} />
			<div>
				<TopNavbar path=" Beranda" title="Beranda" className="bg-slate-50"></TopNavbar>
				<Outlet></Outlet>
			</div>
		</div>
    );
}
