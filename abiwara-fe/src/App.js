import React from "react";
import { createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom';
import { AuthProvider } from "./context/auth";
import Book from "./pages/Book";
import BookCreate from "./pages/Book/Create";
import BookDetail from "./pages/Book/Detail";
import BookEdit from "./pages/Book/Edit";
import Borrower from "./pages/Borrower";
import BorrowerCreate from "./pages/Borrower/Create";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login"
import Member from "./pages/Member";
import { Notfound } from "./pages/Notfound";
import ProcessVerification from "./pages/Register/ProcessVerification";
import Register from "./pages/Register"
import Verification from "./pages/Register/Verification";
import ForgetPassword from "./pages/Reset/ForgetPassword";
import ResetPassword from "./pages/Reset/ResetPassword";
import { RouteGuard } from "./components/RouteGuard";
import VisitorCreate from "./pages/Visitor/Create";
import Visitor from "./pages/Visitor";
import { UpdateProfile } from "./pages/UpdateProfile";
import DashboardLayout from "./layouts/DashboardLayout";
import { UserProvider } from "./context/user";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Information from "./pages/Information";
import Catalogue from "./pages/Catalogue";
import Help from "./pages/Help";
import BorrowStep from "./pages/Help/BorrowStep";

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [{
				path: "/",
				element: <Home /> 
			}, {
				path: "/catalogue",
				element: <Catalogue />
			}, {
				path: "/information",
				element: <Information />
			}, { 
				path: "/help",
				element: <Help />
			}, {
				path: "/help/borrow-step",
				element: <BorrowStep />
			}
		]
	}, {
		path: "/",
		element: (
			<RouteGuard>
				<DashboardLayout />
			</RouteGuard>
		),
		children: [
			{ 
				path: "/dashboard",
				element: <Dashboard />
			}, { 
				path: "/book",
				element: <Book />
			}, { 
				path: "/book/:id",
				element: <BookDetail />
			}, { 
				path: "/book/create",
				element: <BookCreate />
			}, { 
				path: "/book/:id/edit",
				element: <BookEdit />
			}, { 
				path: "/visitor",
				element: <Visitor />
			}, { 
				path: "/visitor/create",
				element: <VisitorCreate />
			}, { 
				path: "/member",
				element: <Member />
			}, { 
				path: "/borrow",
				element: <Borrower />
			}, { 
				path: "/borrow/create",
				element: <BorrowerCreate />
			}, { 
				path: "/update-profile",
				element: <UpdateProfile />
			},
		]
	}, {
		path: "/login",
		element: <Login />
	}, {
		path: "/register",
		element: <Register />
	}, {
		path: "/register/verification",
		element: <Verification />
	}, {
		path: "/register/verification/:token",
		element: <ProcessVerification />
	}, {
		path: "/forget-password",
		element: <ForgetPassword />
	}, {
		path: "/reset-password/:token",
		element: <ResetPassword />
	}, {
		path: "*",
		element: <Notfound />
	}
])

export default function App() {
    return (
		<AuthProvider>
			<UserProvider>
				<RouterProvider router={router} />
			</UserProvider>
		</AuthProvider>
    )
}
