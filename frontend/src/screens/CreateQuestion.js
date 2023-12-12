import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";
import SideBar from "../components/SideBar";
import { Button, Chip } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Meta from "../utils/Meta";
import NotFound from "./NotFound";
import { Option, Select } from "@material-tailwind/react";
import CreatableSelect from "react-select/creatable";
import {
	createImageQuestion,
	createStringQuestion,
	getModuleQuestions,
} from "../redux/actions/testAction";
import WeekendIcon from "@mui/icons-material/Weekend";
import AddOption from "../components/AddOption";
import { setError } from "../redux/slices/appSlice";
import OptionDetails from "../components/OptionDetails";
import { setIsQuestionCreated } from "../redux/slices/testSlice";
import Latex from 'react-latex'

const CreateQuestion = () => {
	const { id, module: moduleId } = useParams();
	const { isLoading, module, isQuestionCreated } = useSelector(
		(state) => state.testState,
	);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [title, setTitle] = useState("");
	const [difficulty, setDifficulty] = useState("easy");
	const [standardTime, setStandardTime] = useState("");
	const [optionType, setOptionType] = useState("string");
	const [choiceType, setChoiceType] = useState("single");
	const [options, setOptions] = useState([]);
	const [skills, setSkills] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [addOpen, setAddOpen] = useState(false);
	const [open, setOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState(null);

	useEffect(() => {
		if (id && moduleId) {
			dispatch(getModuleQuestions(id, moduleId));
		}
	}, [dispatch, id, moduleId]);

	useEffect(() => {
		if (isQuestionCreated) {
			navigate(
				`/admin/test/${module.test._id}/module/${module._id}/questions`,
			);
			dispatch(setIsQuestionCreated(false));
		}
	}, [isQuestionCreated, dispatch, navigate, module]);

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

	const handleSubmit = (e) => {
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
				difficulty,
				optionType,
				isMulti: choiceType === "multiple" ? true : false,
				skills: skills.map((skill) => skill.value),
				subjects: subjects.map((sub) => sub.value),
			};

			dispatch(createStringQuestion(id, moduleId, data));
		} else {
			// create image question
			const optionCopy = options.map((option) => ({
				...option,
				option: option.option.name,
			}));

			const skillsCopy = skills.map((skill) => skill.value);
			const subjectsCopy = subjects.map((sub) => sub.value);

			const optionsStr = JSON.stringify(optionCopy);
			const skillsStr = JSON.stringify(skillsCopy);
			const subjectsStr = JSON.stringify(subjectsCopy);

			const formData = new FormData();

			options.forEach((option) => {
				formData.append("images", option.option);
			});

			formData.append("options", optionsStr);
			formData.append("title", title);
			formData.append("difficulty", difficulty);
			formData.append("standardTime", standardTime);
			formData.append(
				"isMulti",
				choiceType === "multiple" ? true : false,
			);

			formData.append("skills", skillsStr);
			formData.append("subjects", subjectsStr);

			dispatch(createImageQuestion(id, moduleId, formData));
		}
	};

	return (
		<Fragment>
			<Meta title="Create Question" />
			<div className="flex">
				<SideBar />
				{isLoading ? (
					<Loader />
				) : (
					<Fragment>
						{!module?.test ? (
							<NotFound />
						) : (
							<div className="px-4 md:px-10 lg:px-20 xl:px-48 mx-auto text-gray-900">
								<h2 className="text-2xl font-medium text-center my-4">
									Create Question
								</h2>
								<div className="text-gray-600">Title</div>

								<form
									className="flex flex-col gap-4"
									onSubmit={(e) => handleSubmit(e)}>
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


									<div className="text-gray-600">Preview</div>
									<div className="border border-solid border-gray-700 py-2 px-1 sm:px-5 rounded bg-gray-100 h-auto">
										<div className="preview display-linebreak">
											<Latex>{title}</Latex>
										</div>
									</div>

									<div className="border border-solid border-gray-700 py-2 px-1 sm:pl-5 rounded bg-gray-100">
										<AccessTimeIcon className="text-gray-600" />
										<input
											type="number"
											required={true}
											value={standardTime}
											onChange={(e) =>
												setStandardTime(e.target.value)
											}
											placeholder="Standard time in second"
											className="w-40 sm:w-60 md:w-80 ml-3 outline-none bg-transparent placeholder:text-gray-600"
										/>
									</div>
									<CreatableSelect
										isMulti
										value={subjects}
										placeholder="Subjects"
										formatCreateLabel={(value) => value}
										onCreateOption={(value) => {
											const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
											setSubjects((prev) => [...prev, { label: capitalizedValue, value: capitalizedValue }]);
										}}
										onChange={(values) => setSubjects(values)}
									/>

									<CreatableSelect
										isMulti
										value={skills}
										formatCreateLabel={(value) => value}
										placeholder="Skills"
										onCreateOption={(value) => {
											const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
											setSkills((prev) => [...prev, { label: capitalizedValue, value: capitalizedValue }]);
										}}
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
											setOptionType(value);
											setOptions([]);
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
									<OptionDetails
										open={open}
										setOpen={setOpen}
										option={selectedOption}
										optionType={optionType}
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
										Create
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

export default CreateQuestion;
