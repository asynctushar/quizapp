import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getExamDetails } from "../redux/actions/examAction";
import Loader from "../components/Loader";
import { Link, useParams } from "react-router-dom";
import LaunchIcon from "@mui/icons-material/Launch";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import Latext from "react-latex";
import ProgressBar from "@ramonak/react-progress-bar";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import VerticalBarGraph from '../components/VerticalBarGraph'
import {
	Card,
	CardBody,
	Typography,
	Checkbox,
	List,
	ListItem,
	ListItemPrefix,
	Chip,
	Carousel,
} from "@material-tailwind/react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
	Dialog,
	DialogContent,
	DialogActions,
} from "@mui/material";
import Meta from "../utils/Meta";
import NotFound from "./NotFound";

const ExamDetails = () => {
	const dispatch = useDispatch();
	const { id } = useParams();
	const { detailLoading: isLoading, examDetails: exam } = useSelector(
		(state) => state.examState,
	);

	const allQuestions = exam?.modules
		?.map((module) => module?.questions)
		.flat();

	const wrongAnswers = allQuestions?.filter(
		(question) =>
			!question?.isCorrect ||
			question?.totalTime > question?.question?.standardTime,
	);

	const wrongReasons = wrongAnswers?.flatMap((question) => {
		const wrongOptions = question?.answer
			.map((id) => {
				if (question?.question?.optionsType === "type") {
					return (
						question?.question?.options?.find(
							(op) => op.option === id,
						) ||
						question?.question?.options?.find(
							(op) => op.answer === "wrong",
						)
					);
				} else {
					return question?.question?.options?.find(
						(op) => op._id === id,
					);
				}
			})
			.filter((option) => option?.answer !== "right");
		return wrongOptions?.map((option) => option?.reason);
	});

	const wrongSkills = wrongAnswers?.flatMap(
		(question) => question?.question?.skills,
	);
	const wrongSubjects = wrongAnswers?.flatMap(
		(question) => question?.question?.subjects,
	);

	const uniqueWrongSkills = [...new Set(wrongSkills)];
	const uniqueWrongSubjects = [...new Set(wrongSubjects)];

	const reasonCounts = {};
	const skillCounts = {};
	const subjectCounts = {};

	wrongReasons?.forEach((reason) => {
		reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
	});

	wrongSkills?.forEach((skill) => {
		skillCounts[skill] = (skillCounts[skill] || 0) + 1;
	});
	wrongSubjects?.forEach((subject) => {
		subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
	});

	const mostCommonReason =
		wrongReasons?.length > 0
			? Object.keys(reasonCounts)?.reduce((a, b) =>
				reasonCounts[a] > reasonCounts[b] ? a : b,
			)
			: null;

	const mostCommonSkill =
		wrongSkills?.length > 0
			? Object.keys(skillCounts)?.reduce((a, b) =>
				skillCounts[a] > skillCounts[b] ? a : b,
			)
			: null;
	const mostCommonSubject =
		wrongSubjects?.length > 0
			? Object.keys(subjectCounts)?.reduce((a, b) =>
				subjectCounts[a] > subjectCounts[b] ? a : b,
			)
			: null;

	function overtime(allQuestions, uniqueWrongSkills) {
		// Check if allQuestions is null or undefined
		if (!allQuestions) {
			return;
		}

		// Use the filter method to find wrong answers
		const wrongAnswers = allQuestions.filter((question) => {
			return question?.totalTime > question?.question?.standardTime;
		});

		// Calculate the threshold for "more than half"
		const threshold = Math.ceil(allQuestions.length / 2);

		// Check if the number of wrong answers is greater than the threshold
		if (wrongAnswers.length >= threshold) {
			uniqueWrongSkills.push("Time Management");
		}
	}

	overtime(allQuestions, uniqueWrongSkills);

	// module Based
	const moduleBasedAllQuestions = exam?.modules?.map((module) => {
		const moduleName = module.questions[0]?.question?.module?.name;

		return {
			module: module.module,
			moduleName,
			questions: module?.questions,
		};
	});

	const moduleBasedWrongAnswers = moduleBasedAllQuestions?.map((module) => ({
		module: module?.module,
		moduleName: module.moduleName,
		questions: module?.questions?.filter(
			(question) =>
				!question?.isCorrect ||
				question?.totalTime > question?.question?.standardTime,
		),
	}));


	const moduleBasedWrongReasons = moduleBasedWrongAnswers?.map((module) => {
		const wrongReasons = module?.questions?.flatMap((question) => {
			const wrongOptions = question?.answer
				.map((id) => {
					if (question?.question?.optionsType === "type") {
						return (
							question?.question?.options?.find(
								(op) => op.option === id,
							) ||
							question?.question?.options?.find(
								(op) => op.answer === "wrong",
							)
						);
					} else {
						return question?.question?.options?.find(
							(op) => op._id === id,
						);
					}
				})
				.filter((option) => option?.answer !== "right");

			return wrongOptions?.map((option) => option?.reason ?? "Conceptual understanding");

		});

		return {
			module: module.module,
			moduleName: module.moduleName,
			reasons: wrongReasons,
		};
	});

	const moduleBasedWrongSkills = moduleBasedWrongAnswers?.map((module) => ({
		module: module.module,
		moduleName: module.moduleName,
		skills: module?.questions?.flatMap(
			(question) => question?.question?.skills,
		),
	}));

	const moduleBasedWrongSubjects = moduleBasedWrongAnswers?.map((module) => ({
		module: module.module,
		moduleName: module.moduleName,
		subjects: module?.questions?.flatMap(
			(question) => question?.question?.subjects,
		),
	}));

	const moduleBasedUniqueWrongSkills = moduleBasedWrongSkills?.map(
		(module) => {
			const skills = [...new Set(module.skills)];

			moduleBasedAllQuestions?.forEach((module) => {
				overtime(module?.questions, skills);
			});

			return {
				module: module.module,
				moduleName: module.moduleName,
				skills,
			};
		},
	);


	const moduleBasedUniqueWrongSubjects = moduleBasedWrongSubjects?.map(
		(module) => ({
			module: module.module,
			moduleName: module.moduleName,
			subjects: [...new Set(module.subjects)],
		}),
	);

	const moduleBasedMostCommonReason = moduleBasedWrongReasons
		?.map((module) => {
			const reasonCounts = {};

			module?.reasons?.forEach((reason) => {
				reasonCounts[reason.trim()] = (reasonCounts[reason.trim()] || 0) + 1;
			});

			const reasons = Object.keys(reasonCounts);
			const counts = reasons.map((reason) => reasonCounts[reason]);

			// Capitalize the first letter of each reason
			const capitalizedReasons = reasons.map((reason) =>
				reason.replace(/^\w/, (c) => c.toUpperCase())
			);

			return {
				module: module?.module,
				moduleName: module.moduleName,
				reasons: capitalizedReasons,
				counts,
			};
		})
		.filter((entry) => entry.reasons && entry.reasons.length > 0);





	const moduleBasedMostCommonSkill = moduleBasedWrongSkills?.map((module) => {
		const skillCounts = {};

		module?.skills?.forEach((skill) => {
			skillCounts[skill] = (skillCounts[skill] || 0) + 1;
		});

		const mostCommonSkill =
			module?.skills?.length > 0
				? Object.keys(skillCounts)?.reduce((a, b) =>
					skillCounts[a] > skillCounts[b] ? a : b,
				)
				: null;

		return {
			module: module?.module,
			moduleName: module.moduleName,
			skill: mostCommonSkill,
		};
	});

	function calculateModuleBasedSubjectPercentages(moduleBasedWrongSubjects, exam) {
		const moduleBasedSubjectCounts = moduleBasedWrongSubjects?.map((module) => {
			const subjectCounts = {};

			module?.subjects?.forEach((subject) => {
				subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
			});

			// Create an array of [subject, count] pairs
			const subjectsAndCounts = Object.keys(subjectCounts).map((subject) => [subject, subjectCounts[subject]]);
			return subjectsAndCounts;
		});

		const moduleBasedTotalSubjectCounts = exam?.modules?.map((module) => {
			const moduleName = module.questions[0]?.question?.module?.name;

			const subjectCounts = {};

			// Iterate through questions within the module
			module?.questions?.forEach((question) => {
				// Iterate through subjects within the question
				question.question.subjects?.forEach((subject) => {
					subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
				});
			});

			return {
				module: module.module,
				moduleName,
				subjectCounts,
			};
		});

		function calculateSubjectPercentages(moduleBasedSubjectCounts, moduleBasedTotalSubjectCounts) {
			const subjectPercentages = [];

			for (let i = 0; i < moduleBasedTotalSubjectCounts?.length; i++) {
				const moduleTotalSubjectCount = moduleBasedTotalSubjectCounts[i];
				const subjectPercentagesForModule = {};

				if (!moduleTotalSubjectCount) {
					subjectPercentages.push(subjectPercentagesForModule);
					continue;
				}

				for (const subject in moduleTotalSubjectCount.subjectCounts) {
					if (moduleTotalSubjectCount.subjectCounts.hasOwnProperty(subject)) {
						const totalSubjectCount = moduleTotalSubjectCount.subjectCounts[subject];
						const subjectCount = moduleBasedSubjectCounts[i]?.find((entry) => entry[0] === subject);

						if (subjectCount) {
							const [_, count] = subjectCount;
							const percentage = Math.round((1 - count / totalSubjectCount) * 100);
							subjectPercentagesForModule[subject] = percentage;
						}

					}
				}

				subjectPercentages.push(subjectPercentagesForModule);
			}

			return subjectPercentages;
		}


		// Calculate module-based subject percentages
		const moduleBasedSubjectPercentages = calculateSubjectPercentages(moduleBasedSubjectCounts, moduleBasedTotalSubjectCounts);

		return moduleBasedSubjectPercentages;
	}

	// Usage
	const moduleBasedSubjectPercentages = calculateModuleBasedSubjectPercentages(moduleBasedWrongSubjects, exam);


	console.log(moduleBasedSubjectPercentages);

	function calculateModuleBasedSkillPercentages(moduleBasedWrongSkills, exam) {
		const moduleBasedSkillCounts = moduleBasedWrongSkills?.map((module) => {
			const SkillCounts = {};

			module?.skills?.forEach((skill) => {
				SkillCounts[skill] = (SkillCounts[skill] || 0) + 1;
			});

			// Create an array of [Skill, count] pairs
			const skillsAndCounts = Object.keys(SkillCounts).map((Skill) => [Skill, SkillCounts[Skill]]);
			return skillsAndCounts;
		});

		const moduleBasedTotalSkillCounts = exam?.modules?.map((module) => {
			const moduleName = module.questions[0]?.question?.module?.name;

			const SkillCounts = {};

			// Iterate through questions within the module
			module?.questions?.forEach((question) => {
				// Iterate through skills within the question
				question.question.skills?.forEach((Skill) => {
					SkillCounts[Skill] = (SkillCounts[Skill] || 0) + 1;
				});
			});

			return {
				module: module.module,
				moduleName,
				SkillCounts,
			};
		});

		function calculateSkillPercentages(moduleBasedSkillCounts, moduleBasedTotalSkillCounts) {
			const SkillPercentages = [];

			for (let i = 0; i < moduleBasedTotalSkillCounts?.length; i++) {
				const moduleTotalSkillCount = moduleBasedTotalSkillCounts[i];
				const SkillPercentagesForModule = {};

				if (!moduleTotalSkillCount) {
					SkillPercentages.push(SkillPercentagesForModule);
					continue;
				}

				for (const Skill in moduleTotalSkillCount.SkillCounts) {
					if (moduleTotalSkillCount.SkillCounts.hasOwnProperty(Skill)) {
						const totalSkillCount = moduleTotalSkillCount.SkillCounts[Skill];
						const SkillCount = moduleBasedSkillCounts[i]?.find((entry) => entry[0] === Skill);

						if (SkillCount) {
							const [_, count] = SkillCount;
							const percentage = Math.round((1 - count / totalSkillCount) * 100);
							SkillPercentagesForModule[Skill] = percentage;
						}

					}
				}

				SkillPercentages.push(SkillPercentagesForModule);
			}

			return SkillPercentages;
		}


		// Calculate module-based Skill percentages
		const moduleBasedSkillPercentages = calculateSkillPercentages(moduleBasedSkillCounts, moduleBasedTotalSkillCounts);

		return moduleBasedSkillPercentages;
	}

	// Usage
	const moduleBasedSkillPercentages = calculateModuleBasedSkillPercentages(moduleBasedWrongSkills, exam);

	const moduleBasedMostCommonSubject = moduleBasedWrongSubjects?.map(
		(module) => {
			const subjectCounts = {};

			module?.subjects?.forEach((subject) => {
				subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
			});

			const mostCommonSubject =
				module?.subjects?.length > 0
					? Object.keys(subjectCounts)?.reduce((a, b) =>
						subjectCounts[a] > subjectCounts[b] ? a : b,
					)
					: null;

			return {
				module: module?.module,
				moduleName: module.moduleName,
				subject: mostCommonSubject,
			};
		},
	);

	function calculateModuleScores(moduleBasedAllQuestions) {
		if (!moduleBasedAllQuestions) {
			return;
		}
		// Create an array to store module scores
		const moduleScores = moduleBasedAllQuestions.map((module) => {
			const totalQuestions = module.questions.length;
			const correctQuestions = module.questions.filter((question) => question.isCorrect).length;
			const scorePercentage = Math.round((correctQuestions / totalQuestions) * 100);

			return {
				module: module.module,
				moduleName: module.moduleName,
				score: scorePercentage,
			};
		});

		return moduleScores;
	}

	const moduleScores = calculateModuleScores(moduleBasedAllQuestions);
	console.log(moduleScores);
	const moduleBasedDetails = moduleBasedUniqueWrongSkills?.map(
		(module, index) => {
			return {
				module: module.module,
				moduleName: module.moduleName,
				uniqueSkills: module.skills,
				uniqueSubjects: moduleBasedUniqueWrongSubjects[index].subjects,
				mostCommonReason: moduleBasedMostCommonReason[index],
				mostCommonSkill: moduleBasedMostCommonSkill[index].skill,
				mostCommonSubject: moduleBasedMostCommonSubject[index].subject,
				score: moduleScores[index].score,
				percentage: moduleBasedSubjectPercentages[index],
				skillp: moduleBasedSkillPercentages[index]
			};
		},
	);

	function overtime(moduleBasedAllQuestions, moduleBasedUniqueWrongSkills) {
		// Check if allQuestions is null or undefined
		if (!moduleBasedAllQuestions) {
			return;
		}

		// Use the filter method to find wrong answers
		const wrongAnswers = moduleBasedAllQuestions.filter((question) => {
			return (
				(question?.totalTime > moduleBasedAllQuestions?.question?.standardTime)
			);
		});

		// Calculate the threshold for "more than half"
		const threshold = Math.ceil(moduleBasedAllQuestions.length / 2);

		// Check if the number of wrong answers is greater than the threshold
		if (wrongAnswers.length >= threshold) {
			moduleBasedUniqueWrongSkills.push("Time Management");
		}
	}

	overtime(moduleBasedAllQuestions, moduleBasedUniqueWrongSkills);


	const [isDetailsOpen, setIsDetailsOpen] = useState(false);
	const [selectedQuestion, setSelectedQuestion] = useState(null);

	useEffect(() => {
		if (id) {
			dispatch(getExamDetails(id));
		}
	}, [dispatch, id]);

	const getExamResult = (exam) => {
		let questionCount = 0;
		let correctQuestionsCount = 0;

		exam?.test?.modules.forEach((module) => {
			module?.questions.forEach((question) => {
				questionCount++;
			});
		});

		exam?.modules?.forEach((module) => {
			module?.questions?.forEach((question) => {
				if (question.isCorrect === true) {
					correctQuestionsCount++;
				}
			});
		});

		const percentage = (correctQuestionsCount / questionCount) * 100;

		if (Number.isInteger(percentage)) {
			return `${percentage}%`;
		} else {
			return `${Math.round(percentage)}%`;
		}
	};

	const getOptionDetails = (id) => {
		return selectedQuestion?.question?.options.find((op) => op._id === id);
	};

	const formatTime = (milliseconds) => {
		let seconds = Math.floor(milliseconds / 1000);
		let minutes = Math.floor(seconds / 60);
		seconds %= 60;

		return `${minutes} min ${seconds} sec`;
	};

	return (
		<Fragment>
			<Meta title="Exam Result" />
			<Fragment>
				{isLoading ? (
					<Loader />
				) : (
					<Fragment>
						{!exam ? (
							<NotFound />
						) : (
							<div className="px-4 pb-96 bg-white text-blue-gray-900 md:px-24 lg:px-32 xl:px-48 py-4 flex flex-col items-center">
								<div className="flex flex-col gap-4 justify-between w-full">
									<Card className="p-4" color="blue">
										<div className="flex gap-4">
											<h4 className="font-medium">
												Test Name:
											</h4>
											<p className="font-normal ">
												<Link
													to={`/test/${exam?.test._id}`}>
													{exam?.test.name}
												</Link>
											</p>
										</div>
										<div className="flex gap-4">
											<h4 className="font-medium">
												Test Id:{" "}
											</h4>{" "}
											<p className="break-words break-all">
												{exam?.test._id}
											</p>
										</div>
										<div className="flex gap-4">
											<h4 className="font-medium">
												User Name:{" "}
											</h4>{" "}
											<p className="break-words break-all">
												{exam?.user?.name}
											</p>
										</div>
										<div className="flex gap-4">
											<h4 className="font-medium">
												User Id:{" "}
											</h4>{" "}
											<p className="break-words break-all">
												{exam?.user?._id}
											</p>
										</div>
										<div className="flex gap-4">
											<h4 className="font-medium">
												Status:{" "}
											</h4>{" "}
											<p className="break-words break-all">
												{exam?.isComplete
													? "Completed"
													: "Not Completed"}
											</p>
										</div>
										<div className="flex gap-4">
											<h4 className="font-medium">
												Overall Score:{" "}
											</h4>{" "}
											<p className="break-words break-all">
												{getExamResult(exam)}
											</p>
										</div>
									</Card>
									<Card className="p-4" color="blue">
										<div className="flex gap-4">
											<h4 className="font-medium">
												Total Modules:
											</h4>
											<p className="font-normal ">
												{exam?.test?.modules?.length}
											</p>
										</div>
										<div className="flex gap-4">
											<h4 className="font-medium">
												Module Completed:
											</h4>
											<p className="font-normal">
												{
													exam?.modules?.filter(
														(mod) =>
															mod.isComplete ===
															true,
													)?.length
												}
											</p>
										</div>
										<div className="flex gap-4">
											<h4 className="font-medium">
												Total Questions:
											</h4>
											<p className="font-normal">
												{exam?.test?.modules?.reduce(
													(total, module) => {
														return (
															total +
															module?.questions
																?.length
														);
													},
													0,
												)}
											</p>
										</div>
										<div className="flex gap-4">
											<h4 className="font-medium">
												Question Answered:
											</h4>
											<p className="font-normal">
												{exam?.modules
													?.filter(
														(mod) =>
															mod.isComplete ===
															true,
													)
													?.reduce(
														(total, module) => {
															const answeredCount =
																module?.questions?.reduce(
																	(
																		t,
																		ques,
																	) => {
																		if (
																			ques.hasAnswered
																		) {
																			return (
																				t +
																				1
																			);
																		} else
																			return t;
																	},
																	0,
																);

															return (
																total +
																answeredCount
															);
														},
														0,
													)}
											</p>
										</div>
									</Card>
								</div>
								{/* {wrongAnswers?.length > 0 && (
									<>
										<div className="flex flex-col gap-4 sm:flex-row justify-between w-full pt-12">
											{uniqueWrongSkills?.length > 0 && (
												<Card
													className="p-4"
													color="blue">
													Skills need to improve:{" "}
													{uniqueWrongSkills?.map(
														(item) => (
															<Chip
																key={item}
																color="red"
																value={item}
																className="mt-2"
															/>
														),
													)}
												</Card>
											)}
											{uniqueWrongSubjects?.length >
												0 && (
												<Card
													className="p-4"
													color="blue">
													Subject's need to be
													improved: {""}
													{uniqueWrongSubjects?.map(
														(item) => (
															<Chip
																key={item}
																color="red"
																value={item}
																className="mt-2"
															/>
														),
													)}
												</Card>
											)}
											<Card className="p-4" color="blue">
												{wrongSkills?.length > 0 && (
													<h2 className="my-3">
														Most Common Skill
														Required:
														<Chip
															color="red"
															value={
																mostCommonSkill
															}
															className="mt-2"
														/>
													</h2>
												)}
												{wrongSubjects?.length > 0 && (
													<h2 className="my-3">
														Most Common Subject need
														to Improve:{" "}
														<Chip
															color="red"
															value={
																mostCommonSubject
															}
															className="mt-2"
														/>
													</h2>
												)}
												{wrongReasons?.length > 0 && (
													<h2 className="my-3">
														Most Common wrong answer
														Reason:{" "}
														<Chip
															color="red"
															value={
																mostCommonReason
															}
															className="mt-2"
														/>
													</h2>
												)}
											</Card>
										</div>
									</>
								)} */}
								<h2 className="text-2xl font-medium text-center my-8 mt-10">
									Module Details
								</h2>
								<Carousel className="rounded-xl my-9 "
									prevArrow={({ handlePrev }) => (
										<IconButton
											variant="text"
											color="white"
											size="lg"
											onClick={handlePrev}
											className="!absolute top-2/4 !left-0 -translate-y-2/4"

										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={2}
												stroke="currentColor"
												className="h-6 w-6"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
												/>
											</svg>
										</IconButton>
									)}
									nextArrow={({ handleNext }) => (
										<IconButton
											variant="text"
											color="white"
											size="lg"
											onClick={handleNext}
											className="!absolute top-2/4 !right-0 -translate-y-2/4"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={2}
												stroke="currentColor"
												className="h-6 w-6"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
												/>
											</svg>
										</IconButton>
									)}
									navigation={({ setActiveIndex, activeIndex, length }) => (
										<div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2 mt-10">
											{new Array(length).fill("").map((_, i) => (
												<span
													key={i}
													className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${activeIndex === i ? "!w-8 bg-black" : "!w-4 bg-black/50"
														}`}
													onClick={() => setActiveIndex(i)}
												/>
											))}
										</div>
									)}
								>

									{moduleBasedDetails?.map((module) => (
										<div
											key={module?.module}
											className="relative h-full w-full pb-10 pl-10 pr-10">
											<div className="flex flex-col gap-4 justify-between w-full ">
												<Card
													className="p-4"
													color="blue">
													<div className="flex gap-4">
														<h4 className="font-medium">
															Module Id:
														</h4>
														<p className="font-normal">
															{module?.module}
														</p>
													</div>
													<div className="flex gap-4">
														<h4 className="font-medium">
															Module Name:
														</h4>{" "}
														<p className="break-words break-all">
															{module?.moduleName}
														</p>
													</div>
													<div className="flex gap-4">
														<h4 className="font-medium">
															Module Score:
														</h4>{" "}
														<p className="break-words break-all">
															{module?.score}%
														</p>
													</div>
												</Card>
											</div>
											<div className="grid grid-cols-2 grid-rows-2 gap-6 mt-6">
												<div>
													<Chip
														style={{ whiteSpace: 'normal' }}

														color="red"
														value={"Subjects requiring improvement"}
														className="mb-4 text-center mt-1"
													/>

													{Object.entries(module?.percentage).map(([subjectName, percentage]) => (
														<div key={subjectName} className="mb-4">
															<div>
																<div className="flex justify-between">
																	<p className="text-left">{subjectName}</p>
																	<p className="text-right">{`${percentage}%`}</p>
																</div>


																<ProgressBar bgColor="#2e5cb1" height="10px"
																	completed={percentage}
																/>

															</div>
														</div>
													))}
												</div>
												<div><Chip
														style={{ whiteSpace: 'normal' }}

														color="blue"
														value={"Score"}
														className="mb-4 text-center mt-1"
													/>
												<div style={{ paddingTop: '10%', paddingLeft: '30%', paddingRight: '30%', paddingBottom: '10%' }}>
													
													<CircularProgressbar value={module?.score} text={`${module?.score}%`} />

												</div>
												</div>

												<div className="row-span-2">
													<Chip
														style={{ whiteSpace: 'normal' }}

														color="blue"
														value={"Reasons for wrong answers"}
														className="mb-4 text-center mt-2"
													/>


													<div className="mb-5">
														<div>


															<VerticalBarGraph data={{
																labels: module?.mostCommonReason?.reasons,
																data: module?.mostCommonReason?.counts
															}} />




														</div>
													</div>

												</div>
												<div className="row-start-2">
													<Chip
														style={{ whiteSpace: 'normal' }}

														color="red"
														value={"Skills requiring improvement"}
														className="mb-4 text-center mt-2"
													/>

													{Object.entries(module?.skillp).map(([subjectName, percentage]) => (
														<div key={subjectName} className="mb-5">

															<div>
																<div className="flex justify-between">
																	<p className="text-left">{subjectName}</p>
																	<p className="text-right">{`${percentage}%`}</p>
																</div>


																<ProgressBar bgColor="#2e5cb1" height="10px"
																	completed={percentage}
																// text={`${percentage}%`}
																/>
																{/* <p className="text-center">{`${percentage}`}% </p> */}


															</div>
														</div>
													))}
												</div>
											</div>
										</div>
									))}


								</Carousel>
								<h2 className="text-2xl font-medium text-center my-8">
									{exam?.user?.name}'s Exam Result
								</h2>
								<TableContainer component={Paper}>
									<Table className="min-w-[700px]">
										<TableHead>
											<TableRow className="bg-[#5476b6]">
												<TableCell align="center">
													module
												</TableCell>

												<TableCell align="center">
													question
												</TableCell>

												<TableCell align="center">
													IsCorrect
												</TableCell>
												<TableCell align="center">
													Details
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{allQuestions?.map((ques) => (
												<TableRow
													key={ques._id}
													style={{ height: 72.8 }}>
													<TableCell align="center">
														{
															ques?.question
																?.module?.name
														}
													</TableCell>
													<TableCell align="center">
														<Latext>
															{ques?.question
																?.title &&
																ques.question.title
																	.length > 80
																? `${ques.question.title.slice(
																	0,
																	80,
																)}...`
																: ques.question
																	.title}
														</Latext>
													</TableCell>

													<TableCell align="center">
														{ques?.isCorrect
															? "Yes"
															: "No"}
													</TableCell>
													<TableCell align="center">
														<IconButton
															onClick={() => {
																setSelectedQuestion(
																	ques,
																);
																setIsDetailsOpen(
																	true,
																);
															}}>
															<LaunchIcon />
														</IconButton>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>

								<Dialog open={isDetailsOpen} fullScreen={true}>
									<DialogContent className="">
										<h2 className="text-2xl text-center font-semibold">
											Question Details
										</h2>
										<div className="flex-1 w-full flex flex-wrap gap-4 justify-center my-4">
											<Card className="w-full sm:w-[calc(50%-8px)] bg-blue-gray-50">
												<CardBody>
													{selectedQuestion?.question
														?.image?.public_id && (
															<img
																alt="title-img"
																className="w-auto h-24 mx-auto"
																src={
																	selectedQuestion
																		?.question
																		?.image?.url
																}
															/>
														)}
													<Typography
														variant="h5"
														color="blue-gray"
														className="my-4 text-left display-linebreak font-medium text-sm">
														<Latext>
															{
																selectedQuestion
																	?.question
																	?.title
															}
														</Latext>
														{""}
													</Typography>
												</CardBody>
											</Card>
											<Card className="w-full sm:w-[calc(50%-8px)] bg-blue-gray-50">
												<CardBody>
													<Typography
														variant="h3"
														color="blue-gray"
														className="mb-1 text-center">
														{selectedQuestion
															?.question
															?.optionsType ===
															"type"
															? "Correct Option"
															: "Options"}
													</Typography>

													{selectedQuestion?.question
														?.optionsType ===
														"type" ? (
														<List>
															{""}
															{selectedQuestion?.question?.options
																?.filter(
																	(opt) =>
																		opt.answer ===
																		"right",
																)
																?.map(
																	(
																		option,
																	) => (
																		<ListItem
																			ripple={
																				false
																			}
																			key={
																				option._id
																			}>
																			<label
																				htmlFor={
																					option._id
																				}
																				className="flex w-full cursor-pointer items-center py-1">
																				<ListItemPrefix className="mr-3">
																					<Checkbox
																						disabled={
																							true
																						}
																						checked={
																							true
																						}
																						color={
																							option?.answer ===
																								"wrong"
																								? "red"
																								: "blue"
																						}
																						icon={
																							option?.answer ===
																								"wrong" ? (
																								<CloseSharpIcon />
																							) : (
																								false
																							)
																						}
																					/>
																				</ListItemPrefix>
																				{selectedQuestion
																					?.question
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
																						className="w-auto h-12"
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
													) : (
														<List>
															{""}
															{selectedQuestion?.question?.options?.map(
																(option) => (
																	<ListItem
																		ripple={
																			false
																		}
																		key={
																			option._id
																		}>
																		<label
																			htmlFor={
																				option._id
																			}
																			className="flex w-full cursor-pointer items-center py-1">
																			<ListItemPrefix className="mr-3">
																				<Checkbox
																					disabled={
																						true
																					}
																					checked={
																						true
																					}
																					color={
																						option?.answer ===
																							"wrong"
																							? "red"
																							: "blue"
																					}
																					icon={
																						option?.answer ===
																							"wrong" ? (
																							<CloseSharpIcon />
																						) : (
																							false
																						)
																					}
																				/>
																			</ListItemPrefix>
																			{selectedQuestion
																				?.question
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
																					className="w-auto h-12"
																				/>
																			) : (
																				<p
																					color="blue-gray"
																					className="font-medium">
																					<Latext>
																						{
																							option?.option
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
										<Card
											className="p-4 text-white"
											color="blue">

											<span>

												<strong>User Answered:</strong>{" "}
												<>
													{selectedQuestion?.question
														?.optionsType ===
														"type" ? (
														<span className="font-semibold text-light-blue-50">
															<Latext>
																{
																	selectedQuestion
																		?.answer[0]
																}
															</Latext>
														</span>
													) : (
														<>
															{selectedQuestion?.answer?.map(
																(
																	ans,
																	index,
																) => {
																	const optionDetails =
																		getOptionDetails(
																			ans,
																		)?.option;
																	if (
																		index ===
																		0
																	) {
																		return (
																			<span
																				key={
																					index
																				}
																				className="font-semibold text-light-blue-50">
																				<Latext>{
																					optionDetails
																				}</Latext>
																			</span>
																		);
																	} else if (
																		index ===
																		selectedQuestion
																			.answer
																			.length -
																		1
																	) {
																		return (
																			<span
																				key={
																					index
																				}>
																				{" "}
																				<span>
																					&
																				</span>{" "}
																				<span className="font-semibold text-light-blue-50">
																					<Latext>{
																						optionDetails
																					}</Latext>
																				</span>
																			</span>
																		);
																	} else {
																		return (
																			<span
																				key={
																					index
																				}>
																				,{" "}
																				<span className="font-semibold text-light-blue-50">
																					<Latext>{
																						optionDetails
																					}
																					</Latext>
																				</span>
																			</span>
																		);
																	}
																},
															)}
														</>
													)}
												</>


											</span>
											<span>
												<strong>Standard Time:</strong>{" "}
												{formatTime(selectedQuestion?.question.standardTime)}
											</span>
											<span>
												<strong>User's Time:</strong>{" "}
												<span
													className={
														selectedQuestion?.totalTime > selectedQuestion?.question.standardTime
															? "text-red-500" // Apply a red text class when user time is larger
															: ""
													}
												>
													{formatTime(selectedQuestion?.totalTime)}
												</span>
											</span>

											<span>
												<strong>Result:</strong>{" "}
												{selectedQuestion?.isCorrect
													? "Correct"
													: "Incorrect"}
											</span>

											<span>
												<strong>
													Reason for wrong answer:
												</strong>{" "}
												{selectedQuestion?.isCorrect
													? "N/A"
													: selectedQuestion?.reason?.map(
														(item, index) => {
															if (
																index === 0
															) {
																return (
																	<span
																		key={
																			index
																		}
																		className="font-semibold text-light-blue-50">
																		<Latext>
																			{
																				item
																			}
																		</Latext>
																	</span>
																);
															} else if (
																index ===
																selectedQuestion
																	.reason
																	.length -
																1
															) {
																return (
																	<span
																		key={
																			index
																		}>
																		{" "}
																		<span>
																			&
																		</span>{" "}
																		<span className="font-semibold text-light-blue-50">
																			<Latext>
																				{
																					item
																				}
																			</Latext>
																		</span>
																	</span>
																);
															} else {
																return (
																	<span
																		key={
																			index
																		}>
																		{
																			", "
																		}
																		<span className="font-semibold text-light-blue-50">
																			<Latext>
																				{
																					item
																				}
																			</Latext>
																		</span>
																	</span>
																);
															}
														},
													)}
											</span>
											<span className="display-linebreak">

												<strong>Explanation:</strong>{" "}
												<Latext>{
													selectedQuestion?.question?.options.find(
														(option) =>
															option.answer ===
															"right",
													)?.reason
												}
												</Latext>
											</span>
											<span>
												<strong>Skills: </strong>{" "}
												{selectedQuestion?.question?.skills?.map(
													(item, index) => {
														if (index === 0) {
															return (
																<span
																	key={index}
																	className="font-semibold text-light-blue-50">
																	{item}
																</span>
															);
														} else if (
															index ===
															selectedQuestion
																.reason.length -
															1
														) {
															return (
																<span
																	key={index}>
																	{" "}
																	<span>
																		&
																	</span>{" "}
																	<span className="font-semibold text-light-blue-50">
																		{item}
																	</span>
																</span>
															);
														} else {
															return (
																<span
																	key={index}>
																	,{" "}
																	<span className="font-semibold text-light-blue-50">
																		{item}
																	</span>
																</span>
															);
														}
													},
												)}
											</span>
											<span>
												<strong>Subjects:</strong>{" "}
												{selectedQuestion?.question?.subjects?.map(
													(item, index) => {
														if (index === 0) {
															return (
																<span
																	key={index}
																	className="font-semibold text-light-blue-50">
																	{item}
																</span>
															);
														} else if (
															index ===
															selectedQuestion
																.reason.length -
															1
														) {
															return (
																<span
																	key={index}>
																	{" "}
																	<span>
																		&
																	</span>{" "}
																	<span className="font-semibold text-light-blue-50">
																		{item}
																	</span>
																</span>
															);
														} else {
															return (
																<span
																	key={index}>
																	,{" "}
																	<span className="font-semibold text-light-blue-50">
																		{item}
																	</span>
																</span>
															);
														}
													},
												)}
											</span>
										</Card>
									</DialogContent>
									<DialogActions className="m-4">
										<button
											onClick={() => {
												setSelectedQuestion(null);
												setIsDetailsOpen(false);
											}}
											className="bg-[#5476b6] hover:bg-[#343997] py-2 rounded-lg w-24 text-center text-white  transition duration-200 font-semibold">
											Close
										</button>
									</DialogActions>
								</Dialog>
							</div>
						)}
					</Fragment>
				)}
			</Fragment>
		</Fragment>
	);
};
export default ExamDetails;
