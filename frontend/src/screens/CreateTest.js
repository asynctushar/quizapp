import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import SideBar from "../components/SideBar";
import { Button } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsTestCreated } from "../redux/slices/testSlice";
import { createTest } from "../redux/actions/testAction";
import Loader from "../components/Loader";
import Meta from "../utils/Meta";

const CreateTest = () => {
	const [name, setName] = useState("");
	const { isTestCreated, isLoading } = useSelector(
		(state) => state.testState,
	);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		if (isTestCreated) {
			navigate("/admin/tests");
			dispatch(setIsTestCreated(false));
		}
	}, [isTestCreated, dispatch, navigate]);

	const handleSubmit = (event) => {
		event.preventDefault();

		const formData = {
			name,
		};

		dispatch(createTest(formData));
	};

	return (
		<Fragment>
			<Meta title="Create Test" />
			<div className="flex">
				<SideBar />
				{isLoading ? (
					<Loader />
				) : (
					<div className="px-4 md:px-10 lg:px-20 xl:px-48 mx-auto">
						<h2 className="text-2xl font-medium text-center my-8">
							Create Test
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
									onChange={(e) => setName(e.target.value)}
									placeholder="Test Name"
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
			</div>
		</Fragment>
	);
};

export default CreateTest;
