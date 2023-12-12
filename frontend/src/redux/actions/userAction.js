import {
	setLoader,
	setUser,
	logoutUser,
	setUsersLoader,
	setAllUsers,
} from "../slices/userSlice";
import { setError } from "../slices/appSlice";
import axios from "axios";

// get user
export const getUserAction = () => async (dispatch) => {
	try {
		dispatch(setLoader(true));
		const { data } = await axios.get(process.env.REACT_APP_API_URL + "/api/v1/login/success", {withCredentials: true});

		dispatch(setUser(data.user));
		dispatch(setLoader(false));
	} catch (err) {
		dispatch(setLoader(false));
	}
};

// log out user
export const logoutAction = () => async (dispatch) => {
	try {
		dispatch(setLoader(true));
		await axios.get(process.env.REACT_APP_API_URL + "/api/v1/logout", {withCredentials: true});

		dispatch(logoutUser());
		dispatch(setLoader(false));
	} catch (err) {
		dispatch(setLoader(false));
		dispatch(setError(err.response.data.message));
	}
};

// get all users -- admin
export const getAllUsers = () => async (dispatch) => {
	try {
		dispatch(setUsersLoader(true));
		const { data } = await axios.get(process.env.REACT_APP_API_URL + "/api/v1/admin/users", {withCredentials: true});

		dispatch(setAllUsers(data.users));
		dispatch(setUsersLoader(false));
	} catch (err) {
		dispatch(setError(err.response.data.message));
		dispatch(setUsersLoader(false));
	}
};

// update user's role -- admin
export const updateUserRole = (id, role) => async (dispatch) => {
	try {
		const { data } = await axios.put(
			process.env.REACT_APP_API_URL + `/api/v1/admin/user/${id}`,
			{ role },
			{ headers: { "Content-Type": "application/json" }, withCredentials: true },
		);

		dispatch(setAllUsers(data.users));
	} catch (err) {
		dispatch(setError(err.response.data.message));
	}
};
