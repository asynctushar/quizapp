import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import SideBar from "../components/SideBar";
import { Button } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setIsTestUpdated } from "../redux/slices/testSlice";
import { getTestsModules, updateTest } from "../redux/actions/testAction";
import Loader from "../components/Loader";
import Meta from "../utils/Meta";

const UpdateTest = () => {
	const [name, setName] = useState("");
	const { isTestUpdated, isLoading, test } = useSelector(
		(state) => state.testState,
	);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { id } = useParams();

	useEffect(() => {
		if (id) {
			dispatch(getTestsModules(id));
		}
	}, [id, dispatch]);

	useEffect(() => {
		if (test) {
			setName(test.name);
		}
	}, [test]);

	useEffect(() => {
		if (isTestUpdated) {
			navigate("/admin/tests");
			dispatch(setIsTestUpdated(false));
		}
	}, [isTestUpdated, dispatch, navigate]);

	const handleSubmit = (event) => {
		event.preventDefault();

		const formData = {
			name,
		};

		dispatch(updateTest(formData, id));
	};

	return (
		<Fragment>
			<Meta title="Update Test" />
			<div className="flex">
				<SideBar />
				{isLoading ? (
					<Loader />
				) : (
					<div className="px-4 md:px-10 lg:px-20 xl:px-48 mx-auto">
						<h2 className="text-2xl font-medium text-center my-8">
							Update Test
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
									placeholder="test Name"
									className="w-40 sm:w-60 md:w-80 ml-3 outline-none bg-transparent"
								/>
							</div>

							<Button
								variant="contained"
								type="submit"
								className="!bg-[#5476b6] !py-4">
								Update
							</Button>
						</form>
					</div>
				)}
			</div>
		</Fragment>
	);
};
export default UpdateTest;
