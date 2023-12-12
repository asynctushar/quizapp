import SideBar from "../components/SideBar";
import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteModule, getTestsModules } from "../redux/actions/testAction";
import LaunchIcon from "@mui/icons-material/Launch";
import Loader from "../components/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import WeekendIcon from "@mui/icons-material/Weekend";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TableFooter,
	TablePagination,
	IconButton,
	Dialog,
	DialogContent,
	DialogTitle,
	DialogActions,
	Button,
	DialogContentText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import NotFound from "./NotFound";
import Meta from "../utils/Meta";

const TestModules = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { id } = useParams();
	const { isLoading, test } = useSelector((state) => state.testState);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [moduleRef, setModuleRef] = useState(undefined);
	const [page, setPage] = useState(0);
	const rowsPerPage = 5;
	const emptyRows = Math.max(
		0,
		(1 + page) * rowsPerPage - test?.modules.length,
	);

	useEffect(() => {
		if (id) {
			dispatch(getTestsModules(id));
		}
	}, [dispatch, id]);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const deleteHandler = () => {
		dispatch(deleteModule(moduleRef._id));
		setIsDeleteOpen(false);
		setModuleRef(undefined);
	};

	const formatTime = (milliseconds) => {
		let seconds = Math.floor(milliseconds / 1000);
		let minutes = Math.floor(seconds / 60);
		seconds %= 60;

		return `${minutes} min ${seconds} sec`;
	};

	return (
		<Fragment>
			<Meta title={`${test?.name}'s Modules`} />
			<div className="flex">
				<SideBar />
				<Fragment>
					{isLoading ? (
						<Loader />
					) : (
						<Fragment>
							{!test ? (
								<NotFound />
							) : (
								<div className="w-[80%] sm:w-[60%] md:w-[70%] mx-auto mt-3">
									<div className="flex flex-col md:flex-row gap-6 md:gap-4 justify-between">
										<div className="flex gap-4">
											<Button
												onClick={() =>
													navigate("/admin/tests")
												}
												variant="contained"
												className="!text-gray-100 !bg-[#5476b6]">
												<ArrowBackIosNewIcon
													fontSize="small"
													className="mr-2"
												/>
												Back
											</Button>
											<Button
												onClick={() =>
													navigate(
														`/admin/test/${id}/module/new`,
													)
												}
												variant="outlined"
												className="!border-blue-gray-400 !text-blue-gray-400">
												<WeekendIcon
													fontSize="small"
													className="mr-2"
												/>
												Add Module
											</Button>
										</div>
										<div>
											<div className="flex gap-4">
												<h4 className="font-medium">
													Test Name:
												</h4>
												<p className="font-normal text-blue-400">
													<Link to={`/test/${id}`}>
														{test?.name}
													</Link>
												</p>
											</div>
											<div className="flex gap-4">
												<h4 className="font-medium">
													Id:{" "}
												</h4>{" "}
												<p className="break-words break-all">
													{id}
												</p>
											</div>
										</div>
									</div>
									<h2 className="text-2xl font-medium text-center my-8">
										All Modules
									</h2>
									<TableContainer component={Paper}>
										<Table className="min-w-[700px]">
											<TableHead>
												<TableRow className="bg-[#5476b6]">
													<TableCell align="center">
														Id
													</TableCell>
													<TableCell align="center">
														Name
													</TableCell>
													<TableCell align="center">
														Standard Time
													</TableCell>

													<TableCell align="center">
														Questions
													</TableCell>
													<TableCell align="center">
														Update
													</TableCell>
													<TableCell align="center">
														Delete
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{(rowsPerPage > 2
													? test?.modules.slice(
															page * rowsPerPage,
															page * rowsPerPage +
																rowsPerPage,
													  )
													: test?.modules
												)?.map((module) => (
													<TableRow
														key={module._id}
														style={{
															height: 72.8,
														}}>
														<TableCell align="center">
															{module._id}
														</TableCell>
														<TableCell align="center">
															{module.name}
														</TableCell>
														<TableCell align="center">
															{formatTime(
																module.standardTime,
															)}
														</TableCell>

														<TableCell align="center">
															<Link
																to={`/admin/test/${test._id}/module/${module._id}/questions`}>
																<IconButton>
																	<LaunchIcon />
																</IconButton>
															</Link>
														</TableCell>
														<TableCell align="center">
															<Link
																to={`/admin/test/${id}/module/${module._id}/update`}>
																<IconButton>
																	<EditIcon />
																</IconButton>
															</Link>
														</TableCell>
														<TableCell align="center">
															<IconButton
																onClick={() => {
																	setIsDeleteOpen(
																		!isDeleteOpen,
																	);
																	setModuleRef(
																		module,
																	);
																}}>
																<DeleteIcon />
															</IconButton>
														</TableCell>
													</TableRow>
												))}
												{emptyRows > 0 && (
													<TableRow
														style={{
															height:
																72.8 *
																emptyRows,
														}}>
														<TableCell
															colSpan={4}
														/>
													</TableRow>
												)}
											</TableBody>
											<TableFooter>
												<TableRow>
													<TablePagination
														page={page}
														count={
															test.modules.length
														}
														rowsPerPageOptions={[]}
														onPageChange={
															handleChangePage
														}
														rowsPerPage={
															rowsPerPage
														}
													/>
												</TableRow>
											</TableFooter>
										</Table>
									</TableContainer>

									<Dialog open={isDeleteOpen}>
										<div className="p-4">
											<DialogTitle className="text-center">
												Delete Module?
											</DialogTitle>
											<DialogContent className="m-8">
												<DialogContentText className="text-gray-900">
													This will delete the
													module's questions and the
													related exams also.
												</DialogContentText>
											</DialogContent>
											<DialogActions className="mt-12">
												<button
													onClick={() => {
														setIsDeleteOpen(
															!isDeleteOpen,
														);
														setModuleRef(undefined);
													}}
													className="bg-blue-gray-400 hover:bg-blue-gray-500 py-2 rounded-lg w-24 text-center text-white  transition duration-200 font-semibold">
													Cancel
												</button>
												<button
													onClick={deleteHandler}
													className=" border-blue-gray-400 text-blue-gray-400 hover:text-blue-gray-500 hover:border-blue-gray-500 hover:bg-blue-gray-200 border-solid border py-2 rounded-lg w-24 text-center transition duration-200 box-border">
													Delete
												</button>
											</DialogActions>
										</div>
									</Dialog>
								</div>
							)}
						</Fragment>
					)}
				</Fragment>
			</div>
		</Fragment>
	);
};
export default TestModules;
