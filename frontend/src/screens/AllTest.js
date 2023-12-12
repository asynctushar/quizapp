import SideBar from "../components/SideBar";
import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteTest, getAllTests } from "../redux/actions/testAction";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import LaunchIcon from "@mui/icons-material/Launch";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
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
	DialogContentText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Meta from "../utils/Meta";

const AllTest = () => {
	const dispatch = useDispatch();
	const { isTestsLoading: isLoading, tests } = useSelector(
		(state) => state.testState,
	);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [testRef, setTestRef] = useState(undefined);
	const [page, setPage] = useState(0);
	const rowsPerPage = 5;
	const emptyRows = Math.max(0, (1 + page) * rowsPerPage - tests?.length);

	useEffect(() => {
		dispatch(getAllTests());
	}, [dispatch]);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const deleteHandler = () => {
		dispatch(deleteTest(testRef._id));
		setIsDeleteOpen(false);
		setTestRef(undefined);
	};

	return (
		<Fragment>
			<Meta title="All Tests" />
			<div className="flex">
				<SideBar />
				<Fragment>
					{isLoading ? (
						<Loader />
					) : (
						<div className="w-[80%] sm:w-[60%] md:w-[70%] mx-auto mt-3">
							<h2 className="text-2xl font-medium text-center my-8">
								All Tests
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
												Update
											</TableCell>
											<TableCell align="center">
												Delete
											</TableCell>
											<TableCell align="center">
												Modules
											</TableCell>
											<TableCell align="center">
												Details
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{(rowsPerPage > 2
											? tests?.slice(
													page * rowsPerPage,
													page * rowsPerPage +
														rowsPerPage,
											  )
											: tests
										)?.map((test) => (
											<TableRow
												key={test._id}
												style={{ height: 72.8 }}>
												<TableCell align="center">
													{test._id}
												</TableCell>
												<TableCell align="center">
													{test.name}
												</TableCell>

												<TableCell align="center">
													<Link
														to={`/admin/test/${test._id}/update`}>
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
															setTestRef(test);
														}}>
														<DeleteIcon />
													</IconButton>
												</TableCell>
												<TableCell align="center">
													<Link
														to={`/admin/test/${test._id}/modules`}>
														<IconButton>
															<HolidayVillageIcon />
														</IconButton>
													</Link>
												</TableCell>
												<TableCell align="center">
													<Link
														to={`/test/${test._id}`}>
														<IconButton>
															<LaunchIcon />
														</IconButton>
													</Link>
												</TableCell>
											</TableRow>
										))}
										{emptyRows > 0 && (
											<TableRow
												style={{
													height: 72.8 * emptyRows,
												}}>
												<TableCell colSpan={4} />
											</TableRow>
										)}
									</TableBody>
									<TableFooter>
										<TableRow>
											<TablePagination
												page={page}
												count={tests?.length}
												rowsPerPageOptions={[]}
												onPageChange={handleChangePage}
												rowsPerPage={rowsPerPage}
											/>
										</TableRow>
									</TableFooter>
								</Table>
							</TableContainer>

							<Dialog open={isDeleteOpen}>
								<DialogTitle className="text-center">
									Delete Test?
								</DialogTitle>
								<DialogContent className="m-8">
									<DialogContentText className="text-gray-900">
										This will delete test's modules and
										modules's questions and the related
										exams also.
									</DialogContentText>
								</DialogContent>
								<DialogActions className="m-4">
									<button
										onClick={() => {
											setIsDeleteOpen(!isDeleteOpen);
											setTestRef(undefined);
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
							</Dialog>
						</div>
					)}
				</Fragment>
			</div>
		</Fragment>
	);
};
export default AllTest;
