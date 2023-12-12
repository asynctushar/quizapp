import {
	setIsModuleCreated,
	setIsModuleUpdated,
	setIsQuestionCreated,
	setIsQuestionUpdated,
	setIsTestCreated,
	setIsTestUpdated,
	setIsTestsLoading,
	setLoader,
	setModule,
	setQuestionDetails,
	setTest,
	setTests,
} from "../slices/testSlice";
import { setError, setSuccess } from "../slices/appSlice";
import axios from "axios";

// get all tests
export const getAllTests = () => async (dispatch) => {
	try {
		dispatch(setIsTestsLoading(true));
		const { data } = await axios.get(process.env.REACT_APP_API_URL + "/api/v1/tests", {withCredentials: true});

		dispatch(setTests(data.tests));
		dispatch(setIsTestsLoading(false));
	} catch (err) {
		dispatch(setError(err.response.data.message));
		dispatch(setIsTestsLoading(false));
	}
};

// get test's modules
export const getTestsModules = (id) => async (dispatch) => {
	try {
		dispatch(setLoader(true));
		const { data } = await axios.get(process.env.REACT_APP_API_URL +`/api/v1/test/${id}/modules`, {withCredentials: true});

		dispatch(setTest(data.test));
		dispatch(setLoader(false));
	} catch (err) {
		dispatch(setError(err.response.data.message));
		dispatch(setLoader(false));
	}
};

// create new test --admin
export const createTest = (formData) => async (dispatch) => {
	try {
		dispatch(setLoader(true));
		await axios.post(process.env.REACT_APP_API_URL + `/api/v1/test/new`, formData, {
			headers: { "Content-Type": "application/json" },
			withCredentials: true
		});

		dispatch(setSuccess("Test Created successfully"));
		dispatch(setIsTestCreated(true));
		dispatch(setLoader(false));
	} catch (err) {
		dispatch(setError(err.response.data.message));
		dispatch(setLoader(false));
	}
};

// update test --admin
export const updateTest = (formData, testId) => async (dispatch) => {
	try {
		dispatch(setLoader(true));
		await axios.put(process.env.REACT_APP_API_URL + `/api/v1/test/${testId}`, formData, {
			headers: { "Content-Type": "application/json" },
			withCredentials: true,
		});

		dispatch(setSuccess("Subject Updated successfully"));
		dispatch(setIsTestUpdated(true));
		dispatch(setLoader(false));
	} catch (err) {
		dispatch(setError(err.response.data.message));
		dispatch(setLoader(false));
	}
};

// delete test -- admin
export const deleteTest = (id) => async (dispatch) => {
	try {
		dispatch(setIsTestsLoading(true));
		const { data } = await axios.delete(process.env.REACT_APP_API_URL + `/api/v1/test/${id}`, {withCredentials: true});

		dispatch(setTests(data.tests));
		dispatch(setSuccess("Test deleted successfully"));
		dispatch(setIsTestsLoading(false));
	} catch (err) {
		dispatch(setError(err.response.data.message));
		dispatch(setIsTestsLoading(false));
	}
};

// create new module --admin
export const createModule = (formData, testId) => async (dispatch) => {
	try {
		dispatch(setLoader(true));
		await axios.post(process.env.REACT_APP_API_URL + `/api/v1/test/${testId}/module/new`, formData, {
			headers: { "Content-Type": "application/json" },
			withCredentials: true
		});

		dispatch(setSuccess("Module Created successfully"));
		dispatch(setIsModuleCreated(true));
	} catch (err) {
		dispatch(setError(err.response.data.message));
		dispatch(setLoader(false));
	}
};

// update module --admin
export const updateModule = (formData, moduleId) => async (dispatch) => {
	try {
		dispatch(setLoader(true));
		await axios.put(process.env.REACT_APP_API_URL + `/api/v1/module/${moduleId}`, formData, {
			headers: { "Content-Type": "application/json" },
			withCredentials: true
		});

		dispatch(setSuccess("Module Updated successfully"));
		dispatch(setIsModuleUpdated(true));
	} catch (err) {
		dispatch(setError(err.response.data.message));
		dispatch(setLoader(false));
	}
};

// delete module -- admin
export const deleteModule = (id) => async (dispatch) => {
	try {
		dispatch(setLoader(true));
		const { data } = await axios.delete(process.env.REACT_APP_API_URL + `/api/v1/module/${id}`, {withCredentials: true});

		dispatch(setTest(data.test));
		dispatch(setSuccess("Module deleted successfully"));
		dispatch(setLoader(false));
	} catch (err) {
		dispatch(setError(err.response.data.message));
		dispatch(setLoader(false));
	}
};

// get module --admin
export const getModule = (testId, moduleId) => async (dispatch) => {
	try {
		dispatch(setLoader(true));
		const { data } = await axios.get(
			process.env.REACT_APP_API_URL + `/api/v1/test/${testId}/module/${moduleId}`,
			{
				headers: { "Content-Type": "application/json" },
				withCredentials: true
			},
		);

		dispatch(setModule(data.module));
		dispatch(setLoader(false));
	} catch (err) {
		dispatch(setError(err.response.data.message));
		dispatch(setLoader(false));
	}
};

// get module questions --admin
export const getModuleQuestions = (testId, moduleId) => async (dispatch) => {
	try {
		dispatch(setLoader(true));
		const { data } = await axios.get(
			process.env.REACT_APP_API_URL + `/api/v1/test/${testId}/module/${moduleId}/questions`,
			{
				headers: { "Content-Type": "application/json" },
				withCredentials: true
			},
		);

		dispatch(setModule(data.module));
		dispatch(setLoader(false));
	} catch (err) {
		dispatch(setError(err.response.data.message));
		dispatch(setLoader(false));
	}
};

// upload title image -- admin
export const uploadTileImage = (id, formData) => async (dispatch) => {
	try {
		dispatch(setLoader(true));
		const { data } = await axios.put(process.env.REACT_APP_API_URL + `/api/v1/question/${id}`, formData, {
			withCredentials: true,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		dispatch(setModule(data.module));
		dispatch(setSuccess("Title image uploaded successfully"));
		dispatch(setLoader(false));
	} catch (err) {
		dispatch(setError(err.response.data.message));
		dispatch(setLoader(false));
	}
};
// delete question -- admin
export const deleteQuestion = (id) => async (dispatch) => {
	try {
		dispatch(setLoader(true));
		const { data } = await axios.delete(process.env.REACT_APP_API_URL + `/api/v1/question/${id}`,  {withCredentials: true});

		dispatch(setModule(data.module));
		dispatch(setSuccess("Question deleted successfully"));
		dispatch(setLoader(false));
	} catch (err) {
		dispatch(setError(err.response.data.message));
		dispatch(setLoader(false));
	}
};

// create string question -- admin
export const createStringQuestion =
	(id, moduleId, question) => async (dispatch) => {
		try {
			dispatch(setLoader(true));
			const { data } = await axios.post(
				process.env.REACT_APP_API_URL + `/api/v1/test/${id}/module/${moduleId}/question/string/new`,
				question,
				{ withCredentials: true },
			);

			dispatch(setModule(data.module));
			dispatch(setSuccess("Question created successfully"));
			dispatch(setIsQuestionCreated(true));
			dispatch(setLoader(false));
		} catch (err) {
			dispatch(setError(err.response.data.message));
			dispatch(setLoader(false));
		}
	};

// update string question -- admin
export const updateStringQuestion =
	(id, moduleId, questionId, question) => async (dispatch) => {
		try {
			dispatch(setLoader(true));
			const { data } = await axios.post(
				process.env.REACT_APP_API_URL + `/api/v1/test/${id}/module/${moduleId}/question/${questionId}/string/update`,
				question,
				{ withCredentials: true },
			);

			dispatch(setModule(data.module));
			dispatch(setSuccess("Question updated successfully"));
			dispatch(setIsQuestionUpdated(true));
			dispatch(setLoader(false));
		} catch (err) {
			dispatch(setError(err.response.data.message));
			dispatch(setLoader(false));
		}
	};

// create image question -- admin
export const createImageQuestion =
	(id, moduleId, question) => async (dispatch) => {
		try {
			dispatch(setLoader(true));
			const { data } = await axios.post(
				process.env.REACT_APP_API_URL + `/api/v1/test/${id}/module/${moduleId}/question/image/new`,
				question,
				{
					withCredentials: true,
					headers: {
						"Content-Type": "multipart/form-data",
					},
				},
			);

			dispatch(setModule(data.module));
			dispatch(setSuccess("Question created successfully"));
			dispatch(setIsQuestionCreated(true));
			dispatch(setLoader(false));
		} catch (err) {
			dispatch(setError(err.response.data.message));
			dispatch(setLoader(false));
		}
	};

// update image question -- admin
export const updateImageQuestion =
	(id, moduleId, questionId, formData) => async (dispatch) => {
		try {
			dispatch(setLoader(true));
			const { data } = await axios.post(
				process.env.REACT_APP_API_URL + `/api/v1/test/${id}/module/${moduleId}/question/${questionId}/image/update`,
				formData,
				{
					withCredentials: true,
					headers: {
						"Content-Type": "multipart/form-data",
					},
				},
			);

			dispatch(setModule(data.module));
			dispatch(setSuccess("Question updated successfully"));
			dispatch(setIsQuestionUpdated(true));
			dispatch(setLoader(false));
		} catch (err) {
			dispatch(setError(err.response.data.message));
			dispatch(setLoader(false));
		}
	};

// get question details -- admin
export const getQuestionDetails =
	(id, moduleId, questionId) => async (dispatch) => {
		try {
			dispatch(setLoader(true));
			const { data } = await axios.get(
				process.env.REACT_APP_API_URL + `/api/v1/test/${id}/module/${moduleId}/question/${questionId}`,
				{ withCredentials: true },
			);

			dispatch(setQuestionDetails(data.question));
			dispatch(setLoader(false));
		} catch (err) {
			dispatch(setError(err.response.data.message));
			dispatch(setLoader(false));
		}
	};
