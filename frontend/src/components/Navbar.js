import React, { useEffect } from "react";
import Google from "../assets/google.png";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../assets/logo.png";
import { logoutAction } from "../redux/actions/userAction";
import {
	Menu,
	MenuHandler,
	MenuItem,
	MenuList,
	Typography,
} from "@material-tailwind/react";

const Navbar = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { isAuthenticated, user } = useSelector((state) => state.userState);

	const logoutHandler = () => {
		dispatch(logoutAction());
		setIsMenuOpen(false);
	};

	const adminNavigation = () => {
		setIsMenuOpen(false);
		navigate("/admin/dashboard");
	};

	const isLoginPage = location.pathname === "/login"; // Check if the current route is /login

	return (
		<header
			className="mx-auto px-4 md:px-24 lg:px-32 xl:px-48 z-[1300] bg-[#130E59E5]">
			<nav className="h-24 flex items-center justify-between relative">
				<NavLink to="/" className=" font-bold cursor-pointer">
					<img src={Logo} alt="top-logo" className="h-24" />
				</NavLink>
				{isAuthenticated && (
					<div className="flex gap-2 items-center">
						<h3 className="text-right text-blue-gray-50">{user?.name}</h3>

						<Menu
							placement="bottom-end"
							open={isMenuOpen}
							handler={() => setIsMenuOpen(!isMenuOpen)}
							dismiss={{ itemPress: false, isRequired: {} }}>
							<MenuHandler>
								<span className="material-symbols-outlined font-medium text-2xl cursor-pointer rounded-full overflow-hidden select-none text-blue-gray-50">
									account_circle
								</span>
							</MenuHandler>
							<MenuList className="shadow-2xl">
								{user?.role === "admin" && (
									<MenuItem
										className="flex items-center gap-2 "
										onClick={adminNavigation}>
										<span className="material-symbols-outlined">
											admin_panel_settings
										</span>
										<Typography
											variant="small"
											className="font-normal">
											Admin Dashboard
										</Typography>
									</MenuItem>
								)}
								<MenuItem
									className="flex items-center gap-2 "
									onClick={logoutHandler}>
									<span className="material-symbols-outlined">
										logout
									</span>
									<Typography
										variant="small"
										className="font-normal">
										Log Out
									</Typography>
								</MenuItem>
							</MenuList>
						</Menu>
					</div>
				)}
				{isLoginPage && (
					<a
						href={process.env.REACT_APP_API_URL + "/api/v1/auth/google"}
						className="flex justify-center items-center w-auto rounded-lg p-2 border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-200 transition-all duration-200"
					>
						<img src={Google} alt="Google" className="h-6" />
						<span className="ml-2 font-medium text-black">Sign in</span>
					</a>
				)}

			</nav>
		</header>
	);
};

export default Navbar;
