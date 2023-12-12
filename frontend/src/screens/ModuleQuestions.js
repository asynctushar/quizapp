import SideBar from "../components/SideBar";
import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {
	getModuleQuestions,
	deleteQuestion,
	uploadTileImage,
} from "../redux/actions/testAction";
import LaunchIcon from "@mui/icons-material/Launch";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import Loader from "../components/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import WeekendIcon from "@mui/icons-material/Weekend";
import EditIcon from "@mui/icons-material/Edit";
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
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import NotFound from "./NotFound";
import Meta from "../utils/Meta";
import Latex from "react-latex";

const ModuleQuestions = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { id, module: moduleId } = useParams();
	const { isLoading, module } = useSelector((state) => state.testState);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [image, setImage] = useState(null);
	const [questionRef, setQuestionRef] = useState(undefined);
	const [page, setPage] = useState(0);
	const rowsPerPage = 5;
	const emptyRows = Math.max(
		0,
		(1 + page) * rowsPerPage - module?.questions?.length,
	);

	useEffect(() => {
		if (id && moduleId) {
			dispatch(getModuleQuestions(id, moduleId));
		}
	}, [dispatch, id, moduleId]);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const deleteHandler = () => {
		dispatch(deleteQuestion(questionRef._id));
		setIsDeleteOpen(false);
		setQuestionRef(undefined);
	};

	const formatTime = (milliseconds) => {
		let seconds = Math.floor(milliseconds / 1000);
		let minutes = Math.floor(seconds / 60);
		seconds %= 60;

		return `${minutes} min ${seconds} sec`;
	};

	const updloadImageHandler = () => {
		const formData = new FormData();

		formData.append("question", image);

		dispatch(uploadTileImage(questionRef._id, formData));
		setIsOpen(false);
		setQuestionRef(undefined);
		setImage(null);
	};

	return (
		<Fragment>
			<Meta
				title={`${module?.test?.name}'s ${module?.name}'s Questions`}
			/>
			<div className="flex">
				<SideBar />
				<Fragment>
					{isLoading ? (
						<Loader />
					) : (
						<Fragment>
							{!module?.test ? (
								<NotFound />
							) : (
								<div className="w-[80%] sm:w-[60%] md:w-[70%] mx-auto mt-3">
									<div className="flex flex-col md:flex-row gap-6 md:gap-4 justify-between">
										<div className="flex gap-4">
											<Button
												onClick={() =>
													navigate(
														`/admin/test/${module?.test._id}/modules`,
													)
												}
												variant="contained"
												className="!text-gray-100 !bg-blue-gray-400">
												<ArrowBackIosNewIcon
													fontSize="small"
													className="mr-2"
												/>
												Back
											</Button>
											<Button
												onClick={() =>
													navigate(
														`/admin/test/${module?.test._id}/module/${module?._id}/question/new`,
													)
												}
												variant="outlined"
												className="!border-blue-gray-400 !text-blue-gray-400">
												<WeekendIcon
													fontSize="small"
													className="mr-2"
												/>
												Add Question
											</Button>
										</div>
										<div>
											<div className="flex gap-4">
												<h4 className="font-medium">
													Subject Name:
												</h4>
												<p className="font-normal text-blue-400">
													<Link to={`/subject/${id}`}>
														{module?.subject?.name}
													</Link>
												</p>
											</div>
											<div className="flex gap-4">
												<h4 className="font-medium">
													Module:{" "}
												</h4>{" "}
												<p className="break-words break-all">
													{module?.name}
												</p>
											</div>
										</div>
									</div>
									<h2 className="text-2xl font-medium text-center my-8">
										All Questions
									</h2>
									<TableContainer component={Paper}>
										<Table className="min-w-[700px]">
											<TableHead>
												<TableRow className="bg-[#5476b6]">
													<TableCell align="center">
														Id
													</TableCell>
													<TableCell align="center">
														Title
													</TableCell>
													<TableCell align="center">
														Title Image
													</TableCell>
													<TableCell align="center">
														Standard Time
													</TableCell>
													<TableCell align="center">
														Details
													</TableCell>
													<TableCell align="center">
														Edit
													</TableCell>

													<TableCell align="center">
														Delete
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{(rowsPerPage > 2
													? module?.questions?.slice(
															page * rowsPerPage,
															page * rowsPerPage +
																rowsPerPage,
													  )
													: module?.questions
												)?.map((question) => (
													<TableRow
														key={question._id}
														style={{
															height: 72.8,
														}}>
														<TableCell align="center">
															{question._id}
														</TableCell>
														<TableCell align="center">
															<Latex>
																{question?.title &&
																question.title
																	.length > 80
																	? `${question.title.slice(
																			0,
																			80,
																	  )}...`
																	: question.title}
															</Latex>
														</TableCell>
														<TableCell align="center">
															<IconButton
																onClick={() => {
																	setIsOpen(
																		true,
																	);
																	setQuestionRef(
																		question,
																	);
																}}>
																<AddPhotoAlternateIcon />
															</IconButton>
														</TableCell>

														<TableCell align="center">
															{formatTime(
																question.standardTime,
															)}
														</TableCell>

														<TableCell align="center">
															<Link
																to={`/admin/test/${id}/module/${module._id}/question/${question._id}`}>
																<IconButton>
																	<LaunchIcon />
																</IconButton>
															</Link>
														</TableCell>
														<TableCell align="center">
															<Link
																to={`/admin/test/${id}/module/${module._id}/question/${question._id}/update`}>
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
																	setQuestionRef(
																		question,
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
															module.questions
																?.length
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

									<Dialog
										open={isOpen}
										scroll="body"
										className="!w-screen"
										fullWidth={true}>
										<div className="p-4">
											<DialogTitle className="text-center">
												Upload Question Title Image
											</DialogTitle>
											<DialogContent className="m-4 flex justify-center items-center">
												{!image && (
													<Button component="label">
														<FileUploadIcon
															color="action"
															fontSize="large"
														/>
														<input
															hidden
															accept="image/*"
															type="file"
															onChange={(e) => {
																setImage(
																	e.target
																		.files[0],
																);
															}}
														/>
													</Button>
												)}

												{image && (
													<div>
														<input
															key={image.name}
															type="text"
															value={image.name}
															disabled={true}
															className="block w-36 sm:w-96  py-3 my-2 px-5 border border-solid border-slate-400 rounded bg-gray-300"
														/>
													</div>
												)}
											</DialogContent>
											<DialogActions className="mt-4 text-white">
												<button
													onClick={() => {
														setIsOpen(false);
														setImage(null);
														setQuestionRef(
															undefined,
														);
													}}
													className="bg-blue-gray-400 hover:bg-blue-gray-500 py-2 rounded-lg w-24 text-center text-neutral-50  transition duration-200 font-semibold">
													Cancel
												</button>
												<button
													disabled={
														!image ? true : false
													}
													onClick={
														updloadImageHandler
													}
													className=" border-blue-gray-400 text-blue-gray-400 hover:text-blue-gray-500 hover:border-blue-gray-500 hover:bg-blue-gray-200 border-solid border py-2 rounded-lg w-24 text-center transition duration-200 box-border">
													Upload
												</button>
											</DialogActions>
										</div>
									</Dialog>

									<Dialog open={isDeleteOpen}>
										<div className="p-4">
											<DialogTitle className="text-center">
												Delete Question?
											</DialogTitle>
											<DialogContent className="m-8">
												<DialogContentText className="text-gray-900">
													Please be careful. It will
													delete the related exams of
													this question.
												</DialogContentText>
											</DialogContent>
											<DialogActions className="mt-12">
												<button
													onClick={() => {
														setIsDeleteOpen(
															!isDeleteOpen,
														);
														setQuestionRef(
															undefined,
														);
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
export default ModuleQuestions;
