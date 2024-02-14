import React from "react"
import { Outlet } from "react-router-dom"

export default function WithoutNav() {
    return (
        <Outlet className="bg-white"></Outlet>
    )
}
