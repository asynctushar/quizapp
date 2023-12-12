import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isLoading: false,
	tests: [],
	test: null,
	isTestsLoading: true,
	isTestCreated: false,
	isTestUpdated: false,
	isModuleCreated: false,
	isModuleUpdated: false,
	module: null,
	questionDetails: null,
	isQuestionCreated: false,
	isQuestionUpdated: false,
};

const userSlice = createSlice({
	name: "test",
	initialState,
	reducers: {
		setLoader: (state, action) => {
			state.isLoading = action.payload;
		},
		setTests: (state, action) => {
			state.tests = action.payload;
		},
		setTest: (state, action) => {
			state.test = action.payload;
		},
		setIsTestsLoading: (state, action) => {
			state.isTestsLoading = action.payload;
		},
		setIsTestCreated: (state, action) => {
			state.isTestCreated = action.payload;
		},
		setIsTestUpdated: (state, action) => {
			state.isTestUpdated = action.payload;
		},
		setIsModuleCreated: (state, action) => {
			state.isModuleCreated = action.payload;
		},
		setIsModuleUpdated: (state, action) => {
			state.isModuleUpdated = action.payload;
		},
		setModule: (state, action) => {
			state.module = action.payload;
		},
		setQuestionDetails: (state, action) => {
			state.questionDetails = action.payload;
		},
		setIsQuestionCreated: (state, action) => {
			state.isQuestionCreated = action.payload;
		},
		setIsQuestionUpdated: (state, action) => {
			state.isQuestionUpdated = action.payload;
		},
	},
});

export const {
	setLoader,
	setTests,
	setTest,
	setIsTestsLoading,
	setIsTestCreated,
	setIsTestUpdated,
	setIsModuleCreated,
	setModule,
	setIsModuleUpdated,
	setQuestionDetails,
	setIsQuestionCreated,
	setIsQuestionUpdated,
} = userSlice.actions;

export default userSlice.reducer;
