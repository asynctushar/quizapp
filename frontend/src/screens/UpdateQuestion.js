import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";
import SideBar from "../components/SideBar";
import { Button, Chip } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import Loader from "../components/Loader";
import Meta from "../utils/Meta";
import NotFound from "./NotFound";
import { Option, Select } from "@material-tailwind/react";
import CreatableSelect from "react-select/creatable";
import WeekendIcon from "@mui/icons-material/Weekend";
import AddOption from "../components/AddOption";
import { useDispatch, useSelector } from "react-redux";
import { setError } from "../redux/slices/appSlice";
import { useNavigate, useParams } from "react-router-dom";
import {
	getQuestionDetails,
	updateImageQuestion,
	updateStringQuestion,
} from "../redux/actions/testAction";
import UpdateOption from "../components/UpdateOption";
import { setIsQuestionUpdated } from "../redux/slices/testSlice";
import Latex from 'react-latex'

const UpdateQuestion = () => {

	const dispatch = useDispatch();
	const { id, module: moduleId, question: questionId } = useParams();
	const {
		isLoading,
		questionDetails: question,
		isQuestionUpdated,
	} = useSelector((state) => state.testState);
	const [title, setTitle] = useState("");
	const [difficulty, setDifficulty] = useState("");
	const [standardTime, setStandardTime] = useState("");
	const [optionType, setOptionType] = useState("");
	const [choiceType, setChoiceType] = useState("");
	const [options, setOptions] = useState([]);
	const [skills, setSkills] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [addOpen, setAddOpen] = useState(false);
	const [open, setOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (id && moduleId && questionId) {
			dispatch(getQuestionDetails(id, moduleId, questionId));
		}
	}, [dispatch, id, moduleId, questionId]);

	useEffect(() => {
		if (isQuestionUpdated) {
			dispatch(setIsQuestionUpdated(false));
			navigate(`/admin/test/${id}/module/${moduleId}/questions`);
		}
	}, [isQuestionUpdated, navigate, id, moduleId, dispatch]);

	useEffect(() => {
		if (question) {
			setTitle(question.title);
			setStandardTime(question.standardTime / 1000);
			setDifficulty(question.difficulty);
			setOptionType(question.optionsType);
			setOptions(question.options);
			setSkills(
				question.skills.map((skill) => ({
					value: skill,
					label: skill,
				})),
			);
			setSubjects(
				question.subjects.map((sub) => ({
					label: sub,
					value: sub,
				})),
			);
			setChoiceType(question.isMulti ? "multiple" : "single");
		}
	}, [question]);

	const handleDelete = (index) => {
		setOptions((prev) => {
			const optionsCopy = [...prev];
			optionsCopy.splice(index, 1);

			return optionsCopy;
		});
	};

	const handleOpen = (option) => {
		setSelectedOption(option);
		setOpen(true);
	};

	const addOption = (option) => {
		if (options.length >= 4) return dispatch(setError("Max four options"));

		setOptions((prev) => [...prev, option]);
	};

	const updateOption = (option) => {
		setOptions((prevOptions) => {
			return prevOptions.map((prevOption) => {
				if (prevOption._id) {
					if (prevOption._id === selectedOption._id) {
						return option;
					} else {
						return prevOption;
					}
				} else {
					if (prevOption.id === selectedOption.id) {
						return option;
					} else {
						return prevOption;
					}
				}
			});
		});
	};

	const submitHandler = (e) => {
		e.preventDefault();

		if (optionType !== "type" && options.length !== 4)
			return dispatch(setError("Please provide four options"));

		if (options.every((option) => option.answer === "wrong"))
			return dispatch(setError("Please add atleast one right option"));

		if (choiceType === "multiple") {
			const rightAnswers = options.filter(
				(option) => option.answer === "right",
			);

			if (rightAnswers.length < 2)
				return dispatch(
					setError(
						"Multiple choice required atleast two right answer.",
					),
				);
		} else {
			const rightAnswers = options.filter(
				(option) => option.answer === "right",
			);

			if (rightAnswers.length !== 1)
				return dispatch(setError("Provide single right answer"));
		}

		if (skills.length < 1)
			return dispatch(setError("Please provide skills"));
		if (subjects.length < 1)
			return dispatch(setError("Please provide subjects"));

		if (optionType !== "image") {
			// create string quesiton
			const data = {
				title,
				standardTime: standardTime * 1000,
				options,
				optionType,
				difficulty,
				isMulti: choiceType === "multiple" ? true : false,
				skills: skills.map((skill) => skill.value),
				subjects: subjects.map((sub) => sub.value),
			};

			dispatch(updateStringQuestion(id, moduleId, questionId, data));
		} else {
			const imageUpdatedOptions = options.filter(
				(option) => !option.option.public_id,
			);

			const imageUpdatedOptionsCopy = imageUpdatedOptions.map(
				(option) => {
					const originalFile = option.option;
					const newFileName = option._id ? option._id : option.id;
					const newFile = new File([originalFile], newFileName, {
						type: originalFile.type,
						lastModified: originalFile.lastModified,
					});

					return { ...option, option: newFile };
				},
			);

			const skillsCopy = skills.map((skill) => skill.value);
			const subjectsCopy = subjects.map((sub) => sub.value);

			const optionsStr = JSON.stringify(options);
			const skillsStr = JSON.stringify(skillsCopy);
			const subjectsStr = JSON.stringify(subjectsCopy);

			const formData = new FormData();

			imageUpdatedOptionsCopy.forEach((option) => {
				formData.append("images", option.option);
			});

			formData.append("options", optionsStr);
			formData.append("title", title);
			formData.append("difficulty", difficulty);
			formData.append("standardTime", standardTime * 1000);
			formData.append(
				"isMulti",
				choiceType === "multiple" ? true : false,
			);

			formData.append("skills", skillsStr);
			formData.append("subjects", subjectsStr);

			dispatch(updateImageQuestion(id, moduleId, questionId, formData));
		}
	};

	return (
		<Fragment>
			<Meta title="Update Question" />
			<div className="flex">
				<SideBar />
				{isLoading ? (
					<Loader />
				) : (
					<Fragment>
						{!question ? (
							<NotFound />
						) : (
							<div className="px-4 md:px-10 lg:px-20 xl:px-48 mx-auto text-gray-900">
								<h2 className="text-2xl font-medium text-center my-4">
									Update Question
								</h2>
								<div className="text-gray-600" >Title</div>
								<form
									className="flex flex-col gap-4"
									onSubmit={submitHandler}>
									<div className="border border-solid border-gray-700 py-2 px-1 sm:px-5 rounded bg-gray-100 h-auto">
										<textarea
											rows={10} // Set the number of visible rows here
											value={title}
											onChange={(e) => {
												const capitalizedTitle = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
												setTitle(capitalizedTitle);
											}}
											className="w-auto sm:w-80 md:w-96 ml-3 outline-none bg-transparent placeholder:text-gray-600"
										/>
									</div>


									<div className="border border-solid border-gray-700 py-2 px-1 sm:px-5 rounded bg-gray-100 h-auto">
										<div className="preview display-linebreak">
											<Latex>{title}</Latex>
										</div>
									</div>

									<div className="border border-solid border-gray-700 py-2 px-1 sm:pl-5 rounded bg-gray-100 flex items-center">
										<AccessTimeIcon className="text-gray-600" />
										<input
											type="number"
											required={true}
											value={standardTime}
											onChange={(e) =>
												setStandardTime(e.target.value)
											}
											placeholder="Standard time in second"
											className="flex-1 w-40 sm:w-60 md:w-80 ml-3 outline-none bg-transparent placeholder:text-gray-600"
										/>
									</div>
									<CreatableSelect
										isMulti
										value={subjects}
										placeholder="Subjects"
										formatCreateLabel={(value) => value}
										onCreateOption={(value) =>
											setSubjects((prev) => [
												...prev,
												{ label: value, value },
											])
										}
										onChange={(values) =>
											setSubjects(values)
										}
									/>
									<CreatableSelect
										isMulti
										value={skills}
										formatCreateLabel={(value) => value}
										placeholder="Skills"
										onCreateOption={(value) =>
											setSkills((prev) => [
												...prev,
												{ label: value, value },
											])
										}
										onChange={(values) => setSkills(values)}
									/>
									<Select
										label="Difficulty"
										className=" py-3 px-5 rounded"
										value={difficulty}
										onChange={(value) =>
											setDifficulty(value)
										}>
										<Option value="easy">Easy</Option>
										<Option value="medium">Medium</Option>
										<Option value="hard">Hard</Option>
									</Select>
									<Select
										label="Choice Type"
										className=" py-3 px-5 rounded "
										value={choiceType}
										onChange={(value) => {
											setChoiceType(value);
										}}>
										<Option value="single">Single</Option>
										<Option value="multiple">
											Multiple
										</Option>
									</Select>
									<Select
										label="Option Type"
										className=" py-3 px-5 rounded "
										value={optionType}
										onChange={(value) => {
											if (
												value === "image" &&
												question.optionsType !== "image"
											) {
												setOptionType(value);
												setOptions([]);
											} else if (
												value === "string" &&
												question.optionsType !== "image"
											) {
												setOptionType(value);
												setOptions(question.options);
											} else if (
												value === "type" &&
												question.optionsType !== "image"
											) {
												setOptionType(value);
												setOptions(question.options);
											} else {
												setOptionType(value);
												setOptions([]);
											}
										}}>
										<Option value="string">String</Option>
										<Option value="image">Image</Option>
										<Option value="type">Type</Option>
									</Select>
									<div className=" text-center">Options</div>
									<div className="flex gap-5 flex-wrap">
										{options?.map((option, i) => (
											<Chip
												key={i}
												color={
													option.answer === "wrong"
														? "error"
														: "success"
												}
												label={`Option ${i + 1}`}
												className="w-24"
												onClick={() =>
													handleOpen(option)
												}
												onDelete={() => handleDelete(i)}
												deleteIcon={<DeleteIcon />}
												variant="outlined"
											/>
										))}
									</div>
									<div className="flex justify-center mt-4">
										<Button
											onClick={() => setAddOpen(true)}
											variant="outlined"
											type="button"
											className="!border-blue-gray-400 !text-blue-gray-400">
											<WeekendIcon
												fontSize="small"
												className="mr-2"
											/>
											Add Option
										</Button>
									</div>
									<UpdateOption
										open={open}
										setOpen={setOpen}
										option={selectedOption}
										optionType={optionType}
										updateOption={updateOption}
									/>
									<AddOption
										addOpen={addOpen}
										setAddOpen={setAddOpen}
										optionType={optionType}
										addOption={addOption}
									/>
									<Button
										variant="contained"
										type="submit"
										className="!bg-[#5476b6] !py-4">
										Update
									</Button>
								</form>
							</div>
						)}
					</Fragment>
				)}
			</div>
		</Fragment>
	);
};

export default UpdateQuestion;
