import React, { useState } from "react";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogActions,
	Button,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { setError } from "../redux/slices/appSlice";
import { Option, Textarea, Select } from "@material-tailwind/react";

const AddOption = ({ addOpen, setAddOpen, addOption, optionType }) => {
	const [option, setOption] = useState("");
	const [answer, setAnswer] = useState("wrong");
	const [reason, setReason] = useState("");
	const dispatch = useDispatch();
	const [image, setImage] = useState(null);

	const submitHandler = () => {
		if (reason.length < 1) return dispatch(setError("Please add reason"));

		if (optionType !== "image") {
			if (option.length < 1)
				return dispatch(setError("Please add option"));
			addOption({ option, answer, reason, id: Math.random() });
		} else {
			if (!image) return dispatch("Please add image");

			addOption({ option: image, answer, reason, id: Math.random() });
		}
		setAddOpen(!addOpen);
		setOption("");
		setAnswer("wrong");
		setReason("");
		setImage(null);
	};

	return (
		<Dialog open={addOpen}>
			<DialogTitle className="text-center">
				Add {optionType === "image" ? "Image" : ""} Option
			</DialogTitle>
			<DialogContent className="m-2 sm:m-8">
				<div className="flex flex-col gap-4">
					{optionType !== "image" ? (
						<div className="border border-solid border-gray-400 py-3 px-1 sm:px-5 rounded">
							<FormatColorTextIcon className="text-gray-600" />
							<input
								type="text"
								required={true}
								value={option}
								onChange={(e) => setOption(e.target.value)}
								placeholder="Option"
								className="w-40 sm:w-60 md:w-80 ml-3 outline-none bg-transparent"
							/>
						</div>
					) : (
						<div className="border border-solid border-gray-400 rounded flex justify-center">
							{!image ? (
								<Button
									component="label"
									className="w-48 sm:w-60 md:w-80">
									<FileUploadIcon
										color="action"
										fontSize="large"
									/>
									<input
										hidden
										accept="image/*"
										type="file"
										onChange={(e) => {
											setImage(e.target.files[0]);
										}}
									/>
								</Button>
							) : (
								<div className="w-48 sm:w-60 md:w-80 py-2 px-2">
									<input
										type="text"
										value={image.name}
										disabled={true}
									/>
								</div>
							)}
						</div>
					)}
					<Select
						label="Answer"
						className=" py-3 px-5 rounded"
						value={answer}
						onChange={(value) => setAnswer(value)}>
						<Option value="right">Right</Option>
						<Option value="wrong">Wrong</Option>
					</Select>
					<Textarea
						label={`Reason for ${answer} answer`}
						value={reason}
						onChange={(e) => setReason(e.target.value)}
					/>
				</div>
			</DialogContent>
			<DialogActions className="m-4">
				<button
					onClick={() => {
						setAddOpen(!addOpen);
						setAnswer("wrong");
						setOption("");
						setReason("");
						setImage(null);
					}}
					className="bg-blue-gray-400 hover:bg-blue-gray-500 py-2 rounded-lg w-24 text-center text-white  transition duration-200 font-semibold">
					Cancel
				</button>
				<button
					onClick={submitHandler}
					className=" border-blue-gray-400 text-blue-gray-400 hover:text-blue-gray-500 hover:border-blue-gray-500 hover:bg-blue-gray-200 border-solid border py-2 rounded-lg w-24 text-center transition duration-200 box-border">
					Add
				</button>
			</DialogActions>
		</Dialog>
	);
};

export default AddOption;
