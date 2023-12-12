import { useEffect, forwardRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./utils/ProtectedRoute";
import { getUserAction } from "./redux/actions/userAction";
import NotFound from "./screens/NotFound";
import { HelmetProvider } from "react-helmet-async";
import Home from "./screens/Home";
import SignIn from "./screens/SignIn";
import Test from "./screens/Test";
import Exam from "./screens/Exam";
import ExamDetails from "./screens/ExamDetails";
import Dashboard from "./screens/Dashboard";
import AllTest from "./screens/AllTest";
import AllUsers from "./screens/AllUsers";
import ModuleQuestions from "./screens/ModuleQuestions";
import TestModules from "./screens/TestModules";
import AllExams from "./screens/AllExams";
import UserExamDetails from "./screens/UserExamDetails";
import CreateTest from "./screens/CreateTest";
import UpdateTest from "./screens/UpdateTest";
import CreateModule from "./screens/CreateModule";
import UpdateModule from "./screens/UpdateModule";
import CreateQuestion from "./screens/CreateQuestion";
import QuestionDetails from "./screens/QuestionDetails";
import { Alert, Snackbar } from "@mui/material";
import { clearError, clearSuccess } from "./redux/slices/appSlice";
import UpdateQuestion from "./screens/UpdateQuestion";

const App = () => {
	const dispatch = useDispatch();
	const { error, success } = useSelector((state) => state.appState);
	const [isErrorOpen, setIsErrorOpen] = useState(false);
	const [isSuccessOpen, setIsSuccessOpen] = useState(false);
	const CustomAlert = forwardRef((props, ref) => (
		<Alert elevation={6} variant="filled" {...props} ref={ref} />
	));

	useEffect(() => {
		dispatch(getUserAction());
	}, [dispatch]);

	useEffect(() => {
		if (error) {
			setIsErrorOpen(true);
		} else if (success) {
			setIsSuccessOpen(true);
		}
	}, [error, success]);

	const handleErrorClose = () => {
		setIsErrorOpen(false);
		dispatch(clearError());
	};

	const handleSuccessClose = () => {
		setIsSuccessOpen(false);
		dispatch(clearSuccess());
	};

	return (
		<HelmetProvider>
			<Router>
				<div className="bg-white min-h-screen">
					<Navbar />
					<hr className=" border-t border-gray-500" />
					<Routes>
						<Route
							path="/"
							element={
								<ProtectedRoute>
									<Home />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/test/:id"
							element={
								<ProtectedRoute>
									<Test />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/exam/test/:id/start"
							element={
								<ProtectedRoute>
									<Exam />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/exam/:id"
							element={
								<ProtectedRoute>
									<UserExamDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/exam/:id"
							element={
								<ProtectedRoute role="admin">
									<ExamDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/dashboard"
							element={
								<ProtectedRoute role="admin">
									<Dashboard />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/tests"
							element={
								<ProtectedRoute role="admin">
									<AllTest />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/users"
							element={
								<ProtectedRoute role="admin">
									<AllUsers />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/test/:id/module/:module/questions"
							element={
								<ProtectedRoute role="admin">
									<ModuleQuestions />
								</ProtectedRoute>
							}
						/>

						<Route
							path="/admin/test/:id/modules"
							element={
								<ProtectedRoute role="admin">
									<TestModules />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/exams"
							element={
								<ProtectedRoute role="admin">
									<AllExams />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/exam/:id"
							element={
								<ProtectedRoute>
									<UserExamDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/test/new"
							element={
								<ProtectedRoute role="admin">
									<CreateTest />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/test/:id/update"
							element={
								<ProtectedRoute role="admin">
									<UpdateTest />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/test/:id/module/new"
							element={
								<ProtectedRoute role="admin">
									<CreateModule />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/test/:id/module/:module/update"
							element={
								<ProtectedRoute role="admin">
									<UpdateModule />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/test/:id/module/:module/question/new"
							element={
								<ProtectedRoute role="admin">
									<CreateQuestion />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/test/:id/module/:module/question/:question"
							element={
								<ProtectedRoute role="admin">
									<QuestionDetails />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/admin/test/:id/module/:module/question/:question/update"
							element={
								<ProtectedRoute role="admin">
									<UpdateQuestion />
								</ProtectedRoute>
							}
						/>
						<Route path="/login" element={<SignIn />} />
						<Route path="/*" element={<NotFound />} />
					</Routes>
					<Snackbar
						open={isErrorOpen}
						autoHideDuration={3000}
						onClose={handleErrorClose}>
						<CustomAlert
							onClose={handleErrorClose}
							severity="error"
							className="w-fit mx-auto md:mr-auto ">
							{error}
						</CustomAlert>
					</Snackbar>
					<Snackbar
						open={isSuccessOpen}
						autoHideDuration={3000}
						onClose={handleSuccessClose}>
						<CustomAlert
							onClose={handleSuccessClose}
							severity="success"
							className="w-fit mx-auto md:mr-auto ">
							{success}
						</CustomAlert>
					</Snackbar>
				</div>
			</Router>
		</HelmetProvider>
	);
};

export default App;
