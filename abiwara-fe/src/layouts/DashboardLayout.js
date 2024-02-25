import React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import SideNavbar from "../components/SideNavbar";
import TopNavbar from "../components/TopNavbar";

export default function DashboardLayout() {
    return (
		<div className="flex w-screen overflow-hidden bg-[#F5F5FC] dark:bg-[#1A202C]">
			<SideNavbar />
			<div className="relative w-full h-screen">
				<TopNavbar />
				<div className="h-screen overflow-y-auto px-5 pt-24">
					<Outlet />
				</div>
			</div>
			<ScrollRestoration />
		</div>
    );
}
