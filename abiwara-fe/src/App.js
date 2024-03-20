import React from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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
import DashboardLayout from "./layouts/DashboardLayout";
import { UserProvider } from "./context/user";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Information from "./pages/Information";
import Catalogue from "./pages/Catalogue";
import Help from "./pages/Help";
import BorrowStep from "./pages/Help/BorrowStep";
import CatalogueDetail from "./pages/Catalogue/CatalogueDetail";
import RouteWithTitle from "./components/RouteWithTitle";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./context/theme";
import BookBulkCreate from "./pages/Book/BulkCreate";
import Profile from "./pages/Profile";
import EditProfile from "./pages/Profile/Edit";
import Bookmark from "./pages/Bookmark";

const router = createBrowserRouter([
	{
		path: "/",
		element: <RootLayout />,
		children: [{
				path: "/",
				element: <RouteWithTitle title="Abiwara"><Home /></RouteWithTitle> 
			}, {
				path: "/catalogue",
				element: <RouteWithTitle title="Katalog Buku"><Catalogue /></RouteWithTitle> 
			},{
				path: "/catalogue/:id",
				element: <CatalogueDetail />
			},{
				path: "/information",
				element: <RouteWithTitle title="Informasi"><Information /></RouteWithTitle> 
			}, { 
				path: "/help",
				element: <RouteWithTitle title="Bantuan"><Help /></RouteWithTitle> 
			}, {
				path: "/help/borrow-step",
				element: <RouteWithTitle title="Alur Peminjaman"><BorrowStep /></RouteWithTitle> 
			}, {
				path: "/me",
				element: <RouteGuard><RouteWithTitle title="Profile Pengguna"><Profile /></RouteWithTitle></RouteGuard>
			}, {
				path: "/me/edit",
				element: <RouteGuard><RouteWithTitle title="Edit Profile"><EditProfile /></RouteWithTitle></RouteGuard>
			}, {
				path: "bookmark",
				element: <RouteGuard><RouteWithTitle title="Bookmark"><Bookmark /></RouteWithTitle></RouteGuard>
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
				element: <RouteWithTitle title="Dashboard"><Dashboard /></RouteWithTitle> 
			}, { 
				path: "/book",
				element: <RouteWithTitle title="Buku"><Book /></RouteWithTitle> 
			}, { 
				path: "/book/:id",
				element: <BookDetail />
			}, { 
				path: "/book/create",
				element: <RouteWithTitle title="Tambah Buku"><BookCreate /></RouteWithTitle> 
			},{
				path: "/book/bulk-create",
				element: <RouteWithTitle title="Bulk Create Buku"><BookBulkCreate /></RouteWithTitle>
			}, { 
				path: "/book/:id/edit",
				element: <RouteWithTitle title="Edit Buku"><BookEdit /></RouteWithTitle> 
			}, { 
				path: "/visitor",
				element: <RouteWithTitle title="Kunjungan"><Visitor /></RouteWithTitle> 
			}, { 
				path: "/visitor/create",
				element: <RouteWithTitle title="Tambah Kunjungan"><VisitorCreate /></RouteWithTitle> 
			}, { 
				path: "/member",
				element: <RouteWithTitle title="Anggota"><Member /></RouteWithTitle> 
			}, { 
				path: "/borrow",
				element: <RouteWithTitle title="Pinjaman"><Borrower /></RouteWithTitle> 
			}, { 
				path: "/borrow/create",
				element: <RouteWithTitle title="Tambah Pinjaman"><BorrowerCreate /></RouteWithTitle> 
			}
		]
	}, {
		path: "/login",
		element: <RouteWithTitle title="Login"><Login /></RouteWithTitle> 
	}, {
		path: "/register",
		element: <RouteWithTitle title="Daftar"><Register /></RouteWithTitle> 
	}, {
		path: "/register/verification",
		element: <RouteWithTitle title="Verifikasi"><Verification /></RouteWithTitle> 
	}, {
		path: "/register/verification/:token",
		element: <RouteWithTitle title="Verifikasi"><ProcessVerification /></RouteWithTitle> 
	}, {
		path: "/forget-password",
		element: <RouteWithTitle title="Lupa Password"><ForgetPassword /></RouteWithTitle> 
	}, {
		path: "/reset-password/:token",
		element: <RouteWithTitle title="Reset Password"><ResetPassword /></RouteWithTitle> 
	}, {
		path: "/not-found",
		element: <RouteWithTitle title="Halaman tidak ditemukan"><Notfound /></RouteWithTitle> 
	}, {
		path: "*",
		element: <RouteWithTitle title="Halaman tidak ditemukan"><Notfound /></RouteWithTitle> 
	}
])

export default function App() {
    return (
		<HelmetProvider>
			<ThemeProvider>
				<AuthProvider>
					<UserProvider>
						<RouterProvider router={router} />
					</UserProvider>
				</AuthProvider>
			</ThemeProvider>
		</HelmetProvider>
    )
}
