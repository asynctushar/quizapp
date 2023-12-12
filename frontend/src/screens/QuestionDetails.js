import CreatableSelect from "react-select/creatable";
import SideBar from "../components/SideBar";
import { Button, Chip } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import Meta from "../utils/Meta";
import NotFound from "./NotFound";
import { getQuestionDetails } from "../redux/actions/testAction";
import OptionDetails from "../components/OptionDetails";
import Latex from "react-latex";
import MDEditor from "@uiw/react-md-editor";
const QuestionDetails = () => {
	const { id, module: moduleId, question: questionId } = useParams();
	const { isLoading, questionDetails } = useSelector(
		(state) => state.testState,
	);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [title, setTitle] = useState("");
	const [difficulty, setDifficulty] = useState("easy");
	const [standardTime, setStandardTime] = useState("");
	const [optionType, setOptionType] = useState("string");
	const [options, setOptions] = useState([]);
	const [open, setOpen] = useState(false);
	const [choiceType, setChoiceType] = useState("single");
	const [skills, setSkills] = useState([]);
	const [subjects, setSubjects] = useState([]);
	const [selectedOption, setSelectedOption] = useState(null);

	useEffect(() => {
		if (id && moduleId && questionId) {
			dispatch(getQuestionDetails(id, moduleId, questionId));
		}
	}, [dispatch, id, moduleId, questionId]);

	useEffect(() => {
		if (questionDetails) {
			setTitle(questionDetails.title);
			setStandardTime(questionDetails.standardTime / 1000);
			setDifficulty(questionDetails.difficulty);
			setOptionType(questionDetails.optionsType);
			setOptions(questionDetails.options);
			setSkills(
				questionDetails.skills.map((skill) => ({
					value: skill,
					label: skill,
				})),
			);
			setSubjects(
				questionDetails.subjects.map((sub) => ({
					label: sub,
					value: sub,
				})),
			);
			setChoiceType(questionDetails.isMulti ? "multiple" : "single");
		}
	}, [questionDetails]);

	const handleOpen = (option) => {
		setSelectedOption(option);
		setOpen(true);
	};

	return (
		<Fragment>
			<Meta title="Question Details" />
			<div className="flex">
				<SideBar />
				{isLoading ? (
					<Loader />
				) : (
					<Fragment>
						{!questionDetails ? (
							<NotFound />
						) : (
							<div className="px-4 md:px-10 lg:px-20 xl:px-48 mx-auto mb-24">
								<h2 className="text-2xl font-medium text-center my-8">
									Question Details
								</h2>
								<form className="flex flex-col gap-4">
									<div className="flex items-center">
										<span className="w-16">Title:</span>
										<div className="w-40 flex-1 sm:w-60 md:w-80 ml-3 outline-none bg-transparent border border-solid rounded bg-white border-gray-700  py-2 px-1 sm:px-5 display-linebreak">
											<Latex>{title}</Latex>
										</div>
									</div>
									{questionDetails?.image?.public_id && (
										<div className="flex">
											<span className="w-16">Image:</span>
											<img
												src={
													questionDetails?.image?.url
												}
												alt="quetion-img"
												className="w-auto"
											/>
										</div>
									)}
									<div className="flex items-center">
										<span className="w-16">Time(s):</span>
										<input
											type="number"
											required={true}
											value={standardTime}
											disabled
											placeholder="Standard time in second"
											className="w-40 flex-1 sm:w-60 md:w-80 ml-3 outline-none bg-transparent border border-solid rounded bg-white border-gray-700  py-2 px-1 sm:px-5 "
										/>
									</div>

									<div className="flex items-center">
										<span className="w-16">Skills:</span>
										<CreatableSelect
											className="flex-1 ml-2"
											isMulti
											isDisabled={true}
											value={skills}
											placeholder="Skills"
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
									</div>
									<div className="flex items-center">
										<span className="w-16">Subjects:</span>
										<CreatableSelect
											className="flex-1 ml-2"
											isMulti
											isDisabled={true}
											value={subjects}
											formatCreateLabel={(value) => value}
											placeholder="Subjects"
											onCreateOption={(value) =>
												setSkills((prev) => [
													...prev,
													{ label: value, value },
												])
											}
											onChange={(values) =>
												setSkills(values)
											}
										/>
									</div>
									<div className="py-3 rounded">
										Difficulty: {difficulty}
									</div>
									<div className="py-3 rounded">
										choice Type: {choiceType}
									</div>
									<div className="py-3  rounded">
										Option Type: {optionType}
									</div>

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
												variant="outlined"
											/>
										))}
									</div>

									<OptionDetails
										open={open}
										setOpen={setOpen}
										option={selectedOption}
										optionType={optionType}
									/>

									<Button
										variant="contained"
										onClick={() => navigate(-1)}
										type="button"
										className="!bg-[#5476b6] !py-4">
										Go Back
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

export default QuestionDetails;
