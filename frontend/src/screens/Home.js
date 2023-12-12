import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
	Typography,
	Tabs,
	TabsHeader,
	TabsBody,
	Tab,
	TabPanel,
	Card,
	CardBody,
	CardFooter,
	Button,
} from "@material-tailwind/react";
import Loader from "../components/Loader";
import { Fragment, useEffect } from "react";
import Meta from "../utils/Meta";
import { getAllTests } from "../redux/actions/testAction";
import { getOwnExams } from "../redux/actions/examAction";
import Footer from "../components/footer";


const Home = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.userState);
	const { tests, istestsLoading: isLoading } = useSelector(
		(state) => state.testState,
	);
	const { exams } = useSelector((state) => state.examState);

	useEffect(() => {
		dispatch(getAllTests());
		dispatch(getOwnExams());
	}, [dispatch]);

	return (
		<Fragment>
			<Meta title="Trang chủ" />
			<Fragment>
				{isLoading ? (
					<Loader />
				) : (
					<div className="px-4 md:px-24 lg:px-32 xl:px-48 pb-20">
						<Typography
							variant="h3"
							className="text-center mt-10 text-lg sm:text-2xl">
							Welcome, {user?.name}! Take a practice test and get ready
							for the exam.
						</Typography>
						<Typography variant="h4" className="mt-20">
							Available Tests
						</Typography>
						<Tabs value="active" className="mt-4">
							<TabsHeader className="w-52 sm:w-72 mx-auto md:mx-0">
								<Tab value="active">Active</Tab>
								<Tab value="results">Results</Tab>
							</TabsHeader>
							<TabsBody>
								<TabPanel
									value="active"
									className="flex flex-wrap gap-4 justify-center md:justify-start px-0">
									{tests?.map((test) => (
										<Card
											key={test?._id}
											className="w-10/12 sm:w-52 bg-blue-50">
											<CardBody>
												<Typography
													variant="h5"
													color="blue-gray"
													className="mb-2">
													{test?.name}
												</Typography>
												<Typography>{`${
													test?.modules?.length
												} ${
													test?.modules?.length > 1
														? "modules"
														: "module"
												}`}</Typography>
												
											</CardBody>
											<CardFooter className="pt-0">
												<Button
													onClick={() => {
														navigate(
															`/test/${test?._id}`,
														);
													}}>
													Start Test
												</Button>
											</CardFooter>
										</Card>
									))}
								</TabPanel>
								<TabPanel
									value="results"
									className="flex flex-wrap gap-4 justify-center md:justify-start px-0">
										{ exams?.map((exam) => (
										
										<Card
											key={exam._id}
											className="w-10/12 sm:w-52 bg-blue-50">
											<CardBody>
												<Typography
													variant="h5"
													color="blue-gray"
													className="mb-2">
													{exam?.test?.name}
												</Typography>
												<Typography>
													status:{" "}
													<span
														className={
															exam?.isComplete
																? "text-green-500"
																: "text-pink-300"
														}>
														{exam?.isComplete
															? "Completed"
															: "Uncompleted"}
													</span>
												</Typography>
											</CardBody>
											<CardFooter className="pt-0">
													<Button
														color="blue"
													onClick={() =>
														navigate(
															`/exam/${exam._id}`,
														)
													}>
													Details
												</Button>
											</CardFooter>
										</Card>
									))}
								</TabPanel>
							</TabsBody>
						</Tabs>
					</div>
				)}
			</Fragment>
		<Footer />
		</Fragment>

	);
};

export default Home;
