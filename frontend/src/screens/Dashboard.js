import SideBar from "../components/SideBar";
import { Fragment, useEffect } from "react";
import { Card, CardContent } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import { Link } from "react-router-dom";
import Meta from "../utils/Meta";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../redux/actions/userAction";
import { getAllTests } from "../redux/actions/testAction";
import { getAllExams } from "../redux/actions/examAction";

const Dashboard = () => {
	const dispatch = useDispatch();
	const allUsers = useSelector((state) => state.userState.allUsers);
	const tests = useSelector((state) => state.testState.tests);
	const exams = useSelector((state) => state.examState.allExams);

	useEffect(() => {
		dispatch(getAllExams());
		dispatch(getAllUsers());
		dispatch(getAllTests());
	}, [dispatch]);

	return (
		<Fragment>
			<Meta title="Admin Dashboard" />
			<div className="flex">
				<SideBar />
				<div className="mx-auto w-full lg:mt-16 sm:mt-8 mt-5 md:mt-12">
					<h2 className="text-center mb-12 font-medium text-2xl text-[#130E59E5]">
						Admin DashBoard
					</h2>
					<div className=" px-4 lg:px-20 flex flex-col gap-5 sm:gap-8 md:gap-12 lg:gap-28 sm:flex-row sm:justify-center">
						<Card className="px-5 py-3 shadow-2xl sm:w-1/4 sm:px-2 sm:py-2 !bg-[#5476b6]">
							<CardContent className="w-full flex justify-between items-center sm:aspect-square sm:flex-col-reverse sm:justify-center">
								<div className="text-center">
									<Link
										to="/admin/users"
										className="text-3xl font-medium text-gray-100">
										{" "}
										{allUsers.length}
									</Link>
									<p className="text-gray-200 text-md">
										{allUsers?.length > 1
											? "Users"
											: "User"}
									</p>
								</div>
								<PeopleAltIcon className="text-gray-100 !text-4xl mb-4" />
							</CardContent>
						</Card>
						<Card className="px-5 py-3 shadow-2xl sm:w-1/4 sm:px-2 sm:py-2 !bg-[#5476b6]">
							<CardContent className="w-full flex justify-between items-center sm:aspect-square sm:flex-col-reverse sm:justify-center">
								<div className="text-center">
									<Link
										to="/admin/tests"
										className="text-3xl font-medium text-gray-100">
										{" "}
										{tests?.length}
									</Link>
									<p className="text-gray-200 text-md">
										{tests?.length > 1 ? "tests" : "Test"}
									</p>
								</div>
								<ApartmentIcon className="text-gray-100 !text-4xl mb-4" />
							</CardContent>
						</Card>
						<Card className="px-5 py-3 shadow-2xl sm:w-1/4 sm:px-2 sm:py-2 !bg-[#5476b6]">
							<CardContent className="w-full flex justify-between items-center sm:aspect-square sm:flex-col-reverse sm:justify-center">
								<div className="text-center">
									<Link
										to="/admin/exams"
										className="text-3xl font-medium text-gray-100">
										{" "}
										{exams?.length}
									</Link>
									<p className="text-gray-200 text-md">
										{exams?.length > 1 ? "Exams" : "Exam"}
									</p>
								</div>
								<BookmarkAddedIcon className="text-gray-100 !text-4xl mb-4" />
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</Fragment>
	);
};
export default Dashboard;
