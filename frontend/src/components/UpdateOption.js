import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogActions,
	Button,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import { Option, Select, Textarea } from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import { setError } from "../redux/slices/appSlice";

const UpdateOption = ({
	open,
	setOpen,
	optionType,
	option: optionDetails,
	updateOption,
}) => {
	const [option, setOption] = useState("");
	const [answer, setAnswer] = useState("wrong");
	const [reason, setReason] = useState("");
	const dispatch = useDispatch();
	const [image, setImage] = useState(null);
	const [imgSrc, setImgSrc] = useState("");

	useEffect(() => {
		if (optionDetails && open) {
			if (optionType === "image") {
				if (optionDetails.option.public_id) {
					setOption(optionDetails.option);
				} else {
					setImage(optionDetails.option);
					const reader = new FileReader();

					reader.onload = (event) => {
						setImgSrc(event.target.result);
					};

					reader.readAsDataURL(optionDetails.option);
				}
			} else {
				setOption(optionDetails.option);
			}
			setAnswer(optionDetails.answer);
			setReason(optionDetails.reason);
		}
	}, [optionDetails, open]); // eslint-disable-line

	const submitHandler = () => {
		if (reason.length < 1) return dispatch(setError("Please add reason"));

		if (optionType === "string") {
			if (option.length < 1)
				return dispatch(setError("Please add option"));

			updateOption({ option, answer, reason, _id: optionDetails._id });
		} else {
			updateOption({
				option: image ? image : option,
				answer,
				reason,
				_id: optionDetails._id,
			});
		}
		setOpen(false);
		setOption("");
		setAnswer("wrong");
		setReason("");
		setImage(null);
		setImgSrc("");
	};

	return (
		<Dialog open={open}>
			<DialogTitle className="text-center">
				Update {optionType === "image" ? "Image" : ""} Option
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
						<div className="border border-solid border-gray-400 rounded flex flex-col items-center justify-center">
							{!image ? (
								<div className=" rounded flex justify-center">
									<img
										src={option?.url}
										alt={option?.public_id}
										className="w-20"
									/>
								</div>
							) : (
								<div className=" rounded flex justify-center">
									<img
										src={imgSrc}
										alt={image.name}
										className="w-20"
									/>
								</div>
							)}
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
										const reader = new FileReader();

										reader.onload = (event) => {
											setImgSrc(event.target.result);
										};

										reader.readAsDataURL(e.target.files[0]);
									}}
								/>
							</Button>
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
						setOpen(!open);
						setAnswer("wrong");
						setOption("");
						setReason("");
						setImage(null);
						setImgSrc("");
					}}
					className="bg-blue-gray-400 hover:bg-blue-gray-500 py-2 rounded-lg w-24 text-center text-white  transition duration-200 font-semibold">
					Cancel
				</button>
				<button
					onClick={submitHandler}
					className=" border-blue-gray-400 text-blue-gray-400 hover:text-blue-gray-500 hover:border-blue-gray-500 hover:bg-blue-gray-200 border-solid border py-2 rounded-lg w-24 text-center transition duration-200 box-border">
					Update
				</button>
			</DialogActions>
		</Dialog>
	);
};

export default UpdateOption;
