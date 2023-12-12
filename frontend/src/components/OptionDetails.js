import React from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogActions,
} from "@mui/material";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import { Option, Select } from "@material-tailwind/react";
import Latex from "react-latex";

const OptionDetails = ({ open, setOpen, optionType, option }) => {
	return (
		<Dialog open={open}>
			<DialogTitle className="text-center">Option Details</DialogTitle>
			<DialogContent className="m-2 sm:m-8">
				<div className="flex flex-col gap-4">
					{optionType !== "image" ? (
						<div className="border border-solid border-gray-700 py-3 px-1 sm:px-5 rounded">
							<FormatColorTextIcon className="text-gray-600" />
							<Latex className="w-40 sm:w-60 md:w-80 ml-3 outline-none bg-transparent">
								{option?.option}
							</Latex>
						</div>
					) : (
						<div className=" rounded flex justify-center">
							<img
								src={option?.option.url}
								alt={option?.option.public_id}
								className="w-20"
							/>
						</div>
					)}
					<Select
						label="Answer"
						className=" py-3 px-5 rounded"
						value={option?.answer}
						disabled={true}
						onChange={() => {}}>
						<Option value="right">Right</Option>
						<Option value="wrong">Wrong</Option>
					</Select>
					<div>
						Reason: <Latex>{option?.reason}</Latex>
					</div>
				</div>
			</DialogContent>
			<DialogActions className="m-4">
				<button
					onClick={() => {
						setOpen(!open);
					}}
					className="bg-blue-gray-400 hover:bg-blue-gray-500 py-2 rounded-lg w-24 text-center text-white  transition duration-200 font-semibold">
					Close
				</button>
			</DialogActions>
		</Dialog>
	);
};

export default OptionDetails;
