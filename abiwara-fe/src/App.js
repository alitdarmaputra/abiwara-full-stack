import React from "react";
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from "./context/auth";
import Book from "./pages/Book";
import BookCreate from "./pages/Book/Create";
import BookDetail from "./pages/Book/Detail";
import BookEdit from "./pages/Book/Edit";
import Borrower from "./pages/Borrower";
import BorrowerCreate from "./pages/Borrower/Create";
import Dashboard from "./pages/Dashboard";
import WithNav from "./layouts/WithNav";
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

export default function App() {
    return (
        <AuthProvider>
				<Routes>
					<Route path="/" element={<Navigate to={"/login"} />}></Route>
						<Route element={<RouteGuard><WithNav /></RouteGuard>}>
							<Route element={<Dashboard />} path="/dashboard"></Route>
							<Route element={<Book />} path="/book"></Route>
							<Route element={<BookDetail />} path="/book/:id"></Route>
							<Route element={<BookCreate />} path="/book/create"></Route>
							<Route element={<BookEdit />} path="/book/:id/edit"></Route>
							<Route element={<Book />} path="/check-in"></Route>
							<Route element={<Visitor />} path="/visitor"></Route>
							<Route element={<VisitorCreate />} path="/visitor/create"></Route>
							<Route element={<VisitorCreate />} path="/visitor/create"></Route>
							<Route element={<Member />} path="/member"></Route>
							<Route element={<Borrower />} path="/borrow"></Route>
							<Route element={<BorrowerCreate />} path="/borrow/create"></Route>
							<Route element={<UpdateProfile />} path="/update-profile"></Route>
						</Route>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
					<Route path="/register/verification" element={<Verification />} />
					<Route path="/register/verification/:token" element={<ProcessVerification />} />
					<Route path="/forget-password" element={<ForgetPassword />} />
					<Route path="/reset-password/:token" element={<ResetPassword />} />
					<Route path="*" element={<Notfound />} />
				</Routes>
        </AuthProvider>
    )
}
