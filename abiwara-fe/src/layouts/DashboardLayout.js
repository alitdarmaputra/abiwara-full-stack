import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import SideNavbar from "../components/SideNavbar";
import TopNavbar from "../components/TopNavbar";

export default function DashboardLayout() {
    const [active, setActive] = React.useState(0);

    return (
		<div className="flex w-screen bg-[#F5F5FC] dark:bg-[#1A202C]">
			<SideNavbar active={active} setActive={setActive} />
			<div className="relative w-full h-screen">
				<TopNavbar />
				<div className="h-screen overflow-scroll px-5 pt-24">
					<Outlet />
				</div>
			</div>
			<ScrollRestoration />
		</div>
    );
}
