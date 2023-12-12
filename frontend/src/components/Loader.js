import { Spinner } from "@material-tailwind/react";

const Loader = () => {
	return (
		<div className="flex justify-center items-center w-full h-[calc(100vh-97px)] ">
			<Spinner className="h-16 w-16 text-blue-500/10 mb-20" />;
		</div>
	);
};
export default Loader;
