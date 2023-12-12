import React, { Fragment, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTestsModules } from "../redux/actions/testAction";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Meta from "../utils/Meta";
import NotFound from "./NotFound";
import { Button, Typography } from "@material-tailwind/react";
import axios from "axios";
import {
	setExam,
	setLoader,
	setModulesQuestions,
} from "../redux/slices/examSlice";
import { setError } from "../redux/slices/appSlice";

const Test = () => {
	const id = useParams().id;
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { isLoading, test } = useSelector((state) => state.testState);
	const { isLoading: isExamLoading } = useSelector(
		(state) => state.examState,
	);

	useEffect(() => {
		dispatch(getTestsModules(id));
	}, [id, dispatch]);

	const start = async () => {
		try {
			dispatch(setLoader(true));
			const { data } = await axios.get(process.env.REACT_APP_API_URL + `/api/v1/exam/test/${id}/start`, {withCredentials: true});

			dispatch(setExam(data.exam));
			dispatch(setModulesQuestions(data.modulesQuestions));
			dispatch(setLoader(false));
			navigate(`/exam/test/${id}/start`);
		} catch (err) {
			dispatch(setLoader(false));
			dispatch(setError(err.response.data.message));
		}
	};

	return (
		<Fragment>
			<Meta title={`${test?.name}'s Test Preview`} />
			<Fragment>
				{isLoading ? (
					<Loader />
				) : (
					<Fragment>
						{!test ? (
							<NotFound />
						) : (
							<div className="px-4 md:px-24 lg:px-32 xl:px-48 pb-20">
								<Typography variant="h4" className="mt-6">
									Test Name: {test.name}
								</Typography>
								<Typography variant="h4" className="mt-6">Modules : </Typography>
								<ol className="m-8 list-decimal">
									{test.modules.map((module) => (
										<li key={module._id}>
											{module.name}({" "}
											{`${module.questionsCount} ${
												module.questionsCount > 1
													? "questions"
													: "question"
											}`}
											)
										</li>
									))}
								</ol>
								<p className="my-10">
									{" "}
									Please don't quit or go back from the exam
									screen. It will cause an unfinished exam and the tracking will not be accurate.
								</p>

								<p className="my-10">
									{" "}
									You will have to answer all questions to submit the test.
								</p>
								<Button
									disabled={isExamLoading}
									onClick={start}>
									Start Test
								</Button>
							</div>
						)}
					</Fragment>
				)}
			</Fragment>
		</Fragment>
	);
};

export default Test;
