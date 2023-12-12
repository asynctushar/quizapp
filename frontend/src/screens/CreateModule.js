import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SideBar from "../components/SideBar";
import { Button } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setIsModuleCreated } from "../redux/slices/testSlice";
import { createModule, getTestsModules } from "../redux/actions/testAction";
import Loader from "../components/Loader";
import Meta from "../utils/Meta";
import NotFound from "./NotFound";

const CreateModule = () => {
	const [name, setName] = useState("");
	const [standardTime, setStandardTime] = useState("");
	const { id } = useParams();
	const { isModuleCreated, isLoading, test } = useSelector(
		(state) => state.testState,
	);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		if (id) {
			dispatch(getTestsModules(id));
		}
	}, [dispatch, id]);

	useEffect(() => {
		if (isModuleCreated) {
			navigate(`/admin/test/${test._id}/modules`);
			dispatch(setIsModuleCreated(false));
		}
	}, [isModuleCreated, dispatch, navigate, test]);

	const handleSubmit = (event) => {
		event.preventDefault();

		const formData = {
			name,
			standardTime: standardTime * 1000,
		};

		dispatch(createModule(formData, test._id));
	};

	return (
		<Fragment>
			<Meta title="Create Module" />
			<div className="flex">
				<SideBar />
				{isLoading ? (
					<Loader />
				) : (
					<Fragment>
						{!test ? (
							<NotFound />
						) : (
							<div className="px-4 md:px-10 lg:px-20 xl:px-48 mx-auto">
								<h2 className="text-2xl font-medium text-center my-8">
									Create Module
								</h2>
								<form
									className="flex flex-col gap-4"
									onSubmit={(e) => handleSubmit(e)}>
									<div className="border border-solid border-gray-700 py-3 px-5 rounded">
										<FormatColorTextIcon className="text-gray-600" />
										<input
											type="text"
											required={true}
											value={name}
											onChange={(e) =>
												setName(e.target.value)
											}
											placeholder="Module Name"
											className="w-40 sm:w-60 md:w-80 ml-3 outline-none bg-transparent placeholder:text-gray-600"
										/>
									</div>
									<div className="border border-solid border-gray-700 py-3 px-5 rounded">
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

export default CreateModule;
