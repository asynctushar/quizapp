import SideBar from "../components/SideBar";
import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import LaunchIcon from "@mui/icons-material/Launch";
import Loader from "../components/Loader";
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
} from "@mui/material";
import Meta from "../utils/Meta";
import { Link } from "react-router-dom";
import { getAllExams } from "../redux/actions/examAction";

const AllExams = () => {
	const dispatch = useDispatch();
	const { isDetailsLoading: isLoading, allExams: exams } = useSelector(
		(state) => state.examState,
	);

	const [page, setPage] = useState(0);
	const rowsPerPage = 5;
	const emptyRows = Math.max(0, (1 + page) * rowsPerPage - exams?.length);

	useEffect(() => {
		dispatch(getAllExams());
	}, [dispatch]);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	return (
		<Fragment>
			<Meta title="All Exam Results" />
			<div className="flex">
				<SideBar />
				<Fragment>
					{isLoading ? (
						<Loader />
					) : (
						<div className="w-[80%] sm:w-[60%] md:w-[70%] mx-auto mt-3">
							<h2 className="text-2xl font-medium text-center my-8">
								All Exam Results
							</h2>
							<TableContainer component={Paper}>
								<Table className="min-w-[700px]">
									<TableHead>
										<TableRow className="bg-[#5476b6]">
											<TableCell align="center">
												Id
											</TableCell>
											<TableCell align="center">
												User Name
											</TableCell>
											<TableCell align="center">
												Subject
											</TableCell>
											<TableCell align="center">
												Status
											</TableCell>

											<TableCell align="center">
												Details
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{(rowsPerPage > 2
											? exams?.slice(
													page * rowsPerPage,
													page * rowsPerPage +
														rowsPerPage,
											  )
											: exams
										)?.map((exam) => (
											<TableRow
												key={exam._id}
												style={{ height: 72.8 }}>
												<TableCell align="center">
													{exam._id}
												</TableCell>
												<TableCell align="center">
													{exam.user?.name}
												</TableCell>
												<TableCell align="center">
													{exam.test?.name}
												</TableCell>
												<TableCell
													align="center"
													className={
														exam.isComplete
															? "!text-green-600"
															: "!text-red-400"
													}>
													{exam.isComplete
														? "Completed"
														: "Unfinished"}
												</TableCell>

												<TableCell align="center">
													<Link
														to={`/admin/exam/${exam._id}`}>
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
												count={exams?.length}
												rowsPerPageOptions={[]}
												onPageChange={handleChangePage}
												rowsPerPage={rowsPerPage}
											/>
										</TableRow>
									</TableFooter>
								</Table>
							</TableContainer>
						</div>
					)}
				</Fragment>
			</div>
		</Fragment>
	);
};
export default AllExams;
