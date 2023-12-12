import React from "react";
import {
	Button,
	Menu,
	MenuHandler,
	MenuList,
	Option,
	Select,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const QuestionSelect = ({
	openMenu,
	setOpenMenu,
	selectedModule,
	setSelectedModule,
	selectedQuestion,
	setSelectedQuestion,
	modules,
}) => {
	const handleQuestionSelect = (id) => {
		setSelectedQuestion(id);
		setOpenMenu(false);
	};

	return (
		<Menu
			open={openMenu}
			placement="bottom"
			handler={() => setOpenMenu(!openMenu)}
			dismiss={{ itemPress: false, isRequired: {} }}>
			<MenuHandler>
				<Button
					variant="text"
					className="flex items-center gap-3 text-base font-normal capitalize tracking-normal text-blue-gray-100">
					Module:{" "}
					{modules?.find((mod) => mod._id === selectedModule)?.name} ,
					Question:{" "}
					{modules
						?.find((mod) => mod._id === selectedModule)
						?.questions?.findIndex(
							(ques) => ques._id === selectedQuestion,
						) + 1}
					<ChevronDownIcon
						strokeWidth={2.5}
						className={`h-3.5 w-3.5 transition-transform ${
							openMenu ? "rotate-180" : ""
						}`}
					/>
				</Button>
			</MenuHandler>
			<MenuList className="w-full sm:w-10/12 md:w-8/12 lg:w-1/2 p-5 h-96 flex flex-col items-center bg-blue-gray-100">
				<div className="w-48">
					<Select
						label="Select Module"
						onChange={(val) => {
							setSelectedModule(val);
							setSelectedQuestion(
								modules.find((mod) => mod._id === val)
									.questions[0]?._id,
							);
						}}
						value={selectedModule}>
						{modules?.map((module) => (
							<Option value={module._id} key={module._id}>
								{module.name}
							</Option>
						))}
					</Select>
				</div>
				<h3 className="text-gray-700 mt-4">Select Question</h3>
				<div className="flex flex-wrap gap-2 mt-4 justify-center">
					{modules
						?.find((mod) => mod._id === selectedModule)
						?.questions.map((ques, i) => (
							<button
								onClick={() => handleQuestionSelect(ques._id)}
								key={ques._id}
								disabled={selectedQuestion === ques._id}
								className={`w-10 h-10 flex justify-center items-center ${
									selectedQuestion === ques._id
										? "bg-blue-600"
										: "bg-blue-400 cursor-pointer"
								} text-white hover:bg-blue-600 transition`}>
								{i + 1}
							</button>
						))}
				</div>
			</MenuList>
		</Menu>
	);
};

export default QuestionSelect;
