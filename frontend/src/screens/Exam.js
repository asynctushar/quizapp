import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Meta from "../utils/Meta";
import { useNavigate, useParams } from "react-router-dom";
import { setError } from "../redux/slices/appSlice";
import ExamQuestionSelect from "../components/ExamQuestionSelect";
import Latext from "react-latex";
import {
	Button,
	Card,
	CardBody,
	List,
	ListItem,
	ListItemPrefix,
	Typography,
} from "@material-tailwind/react";
import {
	completeModule,
	finishModuleBreak,
	finishExam,
	skipModuleBreak,
} from "../redux/actions/examAction";
import { setExamSubmitted, setExam } from "../redux/slices/examSlice";

const Exam = () => {
	const id = useParams().id;
	const {
		isLoading,
		exam,
		modulesQuestions,
		moduleBreak,
		examSubmittable,
		examSubmitted,
	} = useSelector((state) => state.examState);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [openMenu, setOpenMenu] = useState(false);
	const [selectedModule, setSelectedModule] = useState("");
	const [selectedQuestion, setSelectedQuestion] = useState("");
	const [answers, setAnswers] = useState([]);
	const [questionStartTime, setQuestionStartTime] = useState(null);
	const [moduleStartTime, setModuleStartTime] = useState(null);
	const [moduleTimeElapsed, setModuleTimeElapsed] = useState(null);
	const [timeRemaining, setTimeRemaining] = useState(null);
	const [unselectedQuestion, setUnselectedQuestion] = useState([]);

	// Function to get and set unfilled question indexes
	const updateUnselectedQuestionIndexes = () => {
	  const unfilledIndexes = answers.reduce((indexes, answer, index) => {
		if (answer.answer.length === 0) {
		  indexes.push(index);
		}
		return indexes;
	  }, []);
	  setUnselectedQuestion(unfilledIndexes);
	};
  
	// Update the unfilled question indexes whenever answers change
	useEffect(() => {
	  updateUnselectedQuestionIndexes();
	}, [answers]);
  

	useEffect(() => {
		if (!exam) {
			dispatch(setError("exam not found, Please start a new one"));
			navigate(`/test/${id}`);
		}

		return () => {
			dispatch(setExam(null));
			dispatch(setExamSubmitted(false));
		};
	}, [dispatch, navigate, id]); // eslint-disable-line

	useEffect(() => {
		if (exam && examSubmitted) {
			navigate(`/exam/${exam._id}`);
			dispatch(setExamSubmitted(false));
		}
	}, [exam, dispatch, navigate, examSubmitted]);

	// setting answers & selectedmodule & selectedquestion
	useEffect(() => {
		if (modulesQuestions && exam && !moduleBreak && !examSubmittable) {
			const lastModule = exam.modules[exam.modules.length - 1].module;
			const firstQuestion =
				exam.modules[exam.modules.length - 1].questions[0].question;

			const initialAnswers = exam.modules[
				exam.modules.length - 1
			].questions.map((question) => ({
				question: question.question,
				answer: [],
				totalTime: 0,
			}));

			setSelectedModule(lastModule);
			setModuleStartTime(Date.now());
			setQuestionStartTime(Date.now());
			setSelectedQuestion(firstQuestion);
			setAnswers(initialAnswers);
		} else if (moduleBreak) {
			setModuleStartTime(null);
		}
	}, [modulesQuestions, exam, moduleBreak, examSubmittable]);

	// countdown the break time
	useEffect(() => {
		if (moduleBreak) {
			const interval = setInterval(() => {
				const currentTime = Date.now();
				const breakTime = new Date(moduleBreak).getTime();
				const remainingTime = Math.max(0, breakTime - currentTime);
				setTimeRemaining(remainingTime);

				if (remainingTime === 0) {
					clearInterval(interval);
					dispatch(finishModuleBreak(exam._id));
				}
			}, 1000);

			return () => clearInterval(interval);
		}
	}, [moduleBreak, exam, dispatch]);

	// countdown for module's time
	useEffect(() => {
		if (moduleStartTime && selectedModule && modulesQuestions) {
			const interval = setInterval(() => {
				const currentTime = Date.now();
				const elapsedTime = currentTime - moduleStartTime;
				const remainingTime = Math.max(
					modulesQuestions?.find((mod) => mod._id === selectedModule)
						?.standardTime - elapsedTime,
					0,
				);
				setModuleTimeElapsed(remainingTime);

				if (remainingTime === 0) {
					clearInterval(interval);
				}
			}, 1000);

			return () => {
				clearInterval(interval);
			};
		}
	}, [moduleStartTime, selectedModule, modulesQuestions]);

	// format time
	const formatTime = (time) => {
		const elapsedMinutes = Math.floor(time / 60000);
		const elapsedSeconds = Math.floor((time % 60000) / 1000);

		return `${elapsedMinutes}m ${elapsedSeconds}s`;
	};

	// check box changing
	const checkboxChangeHandler = (e, optionId) => {
		const currentTime = Date.now() - questionStartTime;
		const answerIndex = answers.findIndex(
			(ans) => ans.question === selectedQuestion,
		);

		const answersCopy = [...answers];

		if (answerIndex !== -1) {
			answersCopy[answerIndex].totalTime += currentTime;
		}

		setQuestionStartTime(Date.now());

		const selectedQuestionData = modulesQuestions
			?.find((mod) => mod._id === selectedModule)
			?.questions?.find((ques) => ques._id === selectedQuestion);

		const selectedQuestionAnswer = {
			...answersCopy[answerIndex], // Use the same index as answerIndex
		};

		if (selectedQuestionData.isMulti) {
			if (!selectedQuestionAnswer.answer.includes(optionId)) {
				selectedQuestionAnswer.answer = [
					...selectedQuestionAnswer.answer,
					optionId,
				];
			} else {
				const optionIndex =
					selectedQuestionAnswer.answer.indexOf(optionId);
				if (optionIndex !== -1) {
					selectedQuestionAnswer.answer.splice(optionIndex, 1);
				}
			}
		} else {
			selectedQuestionAnswer.answer = [optionId];
		}

		answersCopy[answerIndex] = selectedQuestionAnswer; // Use the same index as answerIndex

		setAnswers(answersCopy);
	};

	// checkbox selector
	const checkedHandler = (optionId) => {
		const selectedQuestionAnswerIndex = answers.findIndex(
			(ans) => ans.question === selectedQuestion,
		);

		const selectedQuestionAnswer = {
			...answers[selectedQuestionAnswerIndex],
		};

		if (selectedQuestionAnswer.answer.includes(optionId)) return true;

		return false;
	};

	// type option's value change
	const typeOptionChange = (e) => {
		const currentTime = Date.now() - questionStartTime;
		const answerIndex = answers.findIndex(
			(ans) => ans.question === selectedQuestion,
		);

		const answersCopy = [...answers];

		if (answerIndex !== -1) {
			answersCopy[answerIndex].totalTime += currentTime;
		}

		setQuestionStartTime(Date.now());

		const selectedQuestionAnswer = {
			...answersCopy[answerIndex], // Use the same index as answerIndex
		};

		selectedQuestionAnswer.answer = [e.target.value];

		answersCopy[answerIndex] = selectedQuestionAnswer; // Use the same index as answerIndex

		setAnswers(answersCopy);
	};

	// type option's value
	const typeOptionValue = () => {
		const selectedQuestionAnswerIndex = answers?.findIndex(
			(ans) => ans.question === selectedQuestion,
		);

		const selectedQuestionAnswer = {
			...answers[selectedQuestionAnswerIndex],
		};

		return selectedQuestionAnswer?.answer[0] || "";
	};

	// select previous question
	const prevSelector = () => {
		// Update totalTime for the current question
		const currentTime = Date.now() - questionStartTime;
		const answerIndex = answers.findIndex(
			(ans) => ans.question === selectedQuestion,
		);

		if (answerIndex !== -1) {
			const updatedAnswers = [...answers];
			updatedAnswers[answerIndex].totalTime += currentTime;
			setAnswers(updatedAnswers);
		}

		setQuestionStartTime(Date.now());

		const currentModuleIndex = exam.modules.findIndex(
			(module) => module.module === selectedModule,
		);
		const currentModule = exam.modules[currentModuleIndex];
		const currentQuestionIndex = currentModule.questions.findIndex(
			(ques) => ques.question === selectedQuestion,
		);

		if (currentQuestionIndex > 0) {
			const prevQuestion =
				currentModule.questions[currentQuestionIndex - 1];
			setSelectedQuestion(prevQuestion.question);
		} else if (currentModuleIndex > 0) {
			const prevModule = exam.modules[currentModuleIndex - 1];
			const prevQuestion =
				prevModule.questions[prevModule.questions.length - 1];
			setSelectedModule(prevModule.module);
			setSelectedQuestion(prevQuestion.question);
		}
	};

	// disable prev button
	const isPrevDisabled = () => {
		const currentModuleIndex = exam?.modules?.findIndex(
			(module) => module.module === selectedModule,
		);
		const currentModule = exam?.modules[currentModuleIndex];
		const currentQuestionIndex = currentModule?.questions?.findIndex(
			(ques) => ques.question === selectedQuestion,
		);

		return currentQuestionIndex === 0;
	};

	// select next question
	const nextSelector = () => {
		// Update totalTime for the current question
		const currentTime = Date.now() - questionStartTime;
		const answerIndex = answers.findIndex(
			(ans) => ans.question === selectedQuestion,
		);

		if (answerIndex !== -1) {
			const updatedAnswers = [...answers];

			updatedAnswers[answerIndex].totalTime += currentTime;
			setAnswers(updatedAnswers);
		}

		const currentModuleIndex = exam.modules.findIndex(
			(module) => module.module === selectedModule,
		);
		const currentModule = exam.modules[currentModuleIndex];
		const currentQuestionIndex = currentModule.questions.findIndex(
			(ques) => ques.question === selectedQuestion,
		);

		if (
			currentQuestionIndex === currentModule.questions.length - 1 &&
			disableSubmitModule()
		) {
			setOpenMenu(true);
			return;
		}

		if (currentQuestionIndex < currentModule.questions.length - 1) {
			const nextQuestion =
				currentModule.questions[currentQuestionIndex + 1];
			setSelectedQuestion(nextQuestion.question);
		} else if (currentModuleIndex < exam.modules.length - 1) {
			const nextModule = exam.modules[currentModuleIndex + 1];
			const nextQuestion = nextModule.questions[0];
			setSelectedModule(nextModule.module);
			setSelectedQuestion(nextQuestion.question);
		}
	};

	// disable next button
	const isNextDisabled = () => {
		const currentModuleIndex = exam?.modules?.findIndex(
			(module) => module.module === selectedModule,
		);
		const currentModule = exam?.modules[currentModuleIndex];
		const currentQuestionIndex = currentModule?.questions?.findIndex(
			(ques) => ques.question === selectedQuestion,
		);

		if (
			currentQuestionIndex === currentModule?.questions?.length - 1 &&
			!disableSubmitModule()
		) {
			return true;
		}

		return false;
	};

	// disable module submit button
	const disableSubmitModule = () => {
		if (answers?.every((answer) => answer.answer.length > 0)) {
			return false;
		} else {
			return true;
		}
	};

	// submit moduele
	const submitModule = () => {
		const totalTime = Date.now() - moduleStartTime;

		dispatch(completeModule(exam._id, selectedModule, answers, totalTime));
	};

	// submit exam
	const submitExam = () => {
		dispatch(finishExam(exam._id));
	};

	return (
		<Fragment>
			<Meta title={`${exam?.test.name}'s exam`} />
			<Fragment>
				{isLoading ? (
					<Loader />
				) : moduleBreak ? (
					<div className="px-4 h-[calc(100vh-6rem-1px)] bg-white text-blue-gray-900 md:px-24 lg:px-32 xl:px-48 py-4 flex flex-col items-center">
						<h1 className="mt-8">Module Break</h1>
						<p className="my-6">
							You have 10 minutes to prepare yourself for the next
							module. You can skip the time if you want.
						</p>
						<div className="flex items-center gap-2">
							{moduleBreak && (
								<>
									{timeRemaining === null ? (
										""
									) : (
										<>
											<p>
												<>
													Module Break:{" "}
													{Math.floor(
														timeRemaining / 60000,
													)}
													m{" "}
													{Math.floor(
														(timeRemaining %
															60000) /
															1000,
													)}
													s
												</>
											</p>
											<Button
												size="sm"
												color="blue"
												disabled={!moduleBreak}
												onClick={() =>
													dispatch(
														skipModuleBreak(
															exam._id,
														),
													)
												}>
												Skip
											</Button>
										</>
									)}
								</>
							)}
						</div>
					</div>
				) : examSubmittable ? (
					<div className="px-4 h-[calc(100vh-6rem-1px)] text-blue-gray-900 md:px-24 lg:px-32 xl:px-48 py-4 flex flex-col items-center">
						<p className="mt-10">
							Congratulations, You have completed all the modules.
							You can submit the exam now
						</p>
						<Button
							className="mt-10"
							onClick={submitExam}
							size="md">
							Submit Exam
						</Button>
					</div>
				) : (
					<div className="px-4 min-h-[calc(100vh-6rem-1px)] bg-white text-blue-gray-100 md:px-24 lg:px-32 xl:px-48 py-4 flex flex-col items-center ">
						<div className="w-full flex justify-center sm:justify-between gap-3 items-center flex-wrap mb-2">
							<span className="text-gray-800 font-semibold">
								<>
									{moduleTimeElapsed === null ? (
										""
									) : moduleTimeElapsed <= 0 ? (
										"Just end the the test please"
									) : moduleStartTime && moduleTimeElapsed ? (
										<>
											Module Time:{" "}
											{formatTime(moduleTimeElapsed)}
										</>
									) : (
										""
									)}
								</>
							</span>
							<Button
								disabled={disableSubmitModule()}
								onClick={submitModule}
								size="sm">
								Submit Module
							</Button>
						</div>
						<div className="flex-1 w-full flex flex-wrap gap-4 justify-center my-4">
							<Card className="w-full sm:w-[calc(50%-8px)] bg-[#f3f3f7]">
								<CardBody>
									{modulesQuestions
										?.find(
											(mod) => mod._id === selectedModule,
										)
										?.questions?.find(
											(ques) =>
												ques._id === selectedQuestion,
										)?.image?.public_id && (
										<img
											alt="title-img"
											className="w-auto mx-auto"
											src={
												modulesQuestions
													?.find(
														(mod) =>
															mod._id ===
															selectedModule,
													)
													?.questions?.find(
														(ques) =>
															ques._id ===
															selectedQuestion,
													)?.image?.url
											}
										/>
									)}
									<Typography
										variant="h5"
										color="blue-gray"
										className="my-4 text-left font-medium text-sm display-linebreak">
										<Latext>
											{
												modulesQuestions
													?.find(
														(mod) =>
															mod._id ===
															selectedModule,
													)
													?.questions?.find(
														(ques) =>
															ques._id ===
															selectedQuestion,
													)?.title
											}
										</Latext>
										{""}
									</Typography>
								</CardBody>
							</Card>
							<Card className="w-full sm:w-[calc(50%-8px)] bg-[#f3f3f7]">
								<CardBody>
									<Typography
										variant="h3"
										color="blue-gray"
										className="mb-1 text-center">
										Answer
									</Typography>
									{modulesQuestions
										?.find(
											(mod) => mod._id === selectedModule,
										)
										?.questions?.find(
											(ques) =>
												ques._id === selectedQuestion,
										)?.optionsType === "type" ? (
										<div className="flex justify-center items-center">
											<input
												type="text"
												className="my-10 bg-[#d2d1e0] py-3 px-5 outline-none border-b-2 border-[#5476b6]"
												placeholder="Answer"
												value={typeOptionValue()}
												onChange={typeOptionChange}
											/>
										</div>
									) : (
										<List>
											{""}
											{modulesQuestions
												?.find(
													(mod) =>
														mod._id ===
														selectedModule,
												)
												?.questions?.find(
													(ques) =>
														ques._id ===
														selectedQuestion,
												)
												?.options?.map(
													(option, index) => (
														<ListItem
															ripple={false}
															key={option._id}
															className="p-0 m-3"
															disabled={isLoading}
															onClick={(e) =>
																checkboxChangeHandler(
																	e,
																	option._id,
																)
															}>
															<label
																htmlFor={
																	option._id
																}
																className={`flex w-full h-full cursor-pointer items-center border-2 ${
																	checkedHandler(
																		option._id,
																	)
																		? "border border-gray-800"
																		: "border border-gray-300"
																} p-4 rounded-lg`}>
																<ListItemPrefix className="mr-3">
																	<div className="flex items-center justify-center w-6  h-6 border border-gray-800 rounded-full">
																		{index ===
																		0
																			? "A"
																			: index ===
																			  1
																			? "B"
																			: index ===
																			  2
																			? "C"
																			: "D"}
																	</div>
																</ListItemPrefix>
																{modulesQuestions
																	?.find(
																		(mod) =>
																			mod._id ===
																			selectedModule,
																	)
																	?.questions?.find(
																		(
																			ques,
																		) =>
																			ques._id ===
																			selectedQuestion,
																	)
																	?.optionsType ===
																"image" ? (
																	<img
																		src={
																			option
																				.option
																				?.url
																		}
																		alt={
																			option
																				.option
																				?.public_id
																		}
																		className="w-auto h-10"
																	/>
																) : (
																	<p
																		color="blue-gray"
																		className="font-medium">
																		<Latext>
																			{
																				option.option
																			}
																		</Latext>
																	</p>
																)}
															</label>
														</ListItem>
													),
												)}
										</List>
									)}
								</CardBody>
							</Card>
						</div>

						<div className="flex justify-between w-full mt-3">
							<Button
								disabled={isPrevDisabled()}
								onClick={prevSelector}
								size="sm">
								Prev
							</Button>

							<Button
								disabled={isNextDisabled()}
								onClick={nextSelector}
								size="sm">
								Next
							</Button>
						</div>

						<ExamQuestionSelect
							unanswered={unselectedQuestion}
							openMenu={openMenu}
							setOpenMenu={setOpenMenu}
							selectedQuestion={selectedQuestion}
							setSelectedQuestion={setSelectedQuestion}
							modules={modulesQuestions}
							selectedModule={selectedModule}
							exam={exam}
						/>
					</div>
				)}
			</Fragment>
		</Fragment>
	);
};

export default Exam;
