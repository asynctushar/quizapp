import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isLoading: false,
	detailsLoading: true,
	detailLoading: true,
	exam: null,
	examDetails: null,
	modulesQuestions: [],
	hasExamUpdated: false,
	hasModuleFinished: false,
	moduleBreak: null,
	breakFinished: false,
	examSubmittable: false,
	examSubmitted: false,
	exams: [],
	allExams: [],
};

const userSlice = createSlice({
	name: "exam",
	initialState,
	reducers: {
		setLoader: (state, action) => {
			state.isLoading = action.payload;
		},
		setDetailsLoader: (state, action) => {
			state.detailsLoading = action.payload;
		},
		setExam: (state, action) => {
			state.exam = action.payload;
		},
		setExamDetails: (state, action) => {
			state.examDetails = action.payload;
		},
		setModulesQuestions: (state, action) => {
			state.modulesQuestions = action.payload;
		},
		setHasExamUpdated: (state, action) => {
			state.hasExamUpdated = action.payload;
		},
		setHasModuleFinished: (state, action) => {
			state.hasModuleFinished = action.payload;
		},
		setModuleBreak: (state, action) => {
			state.moduleBreak = action.payload;
		},
		setBreakFinished: (state, action) => {
			state.breakFinished = action.payload;
		},
		setExamSubmittable: (state, action) => {
			state.examSubmittable = action.payload;
		},
		setExamSubmitted: (state, action) => {
			state.examSubmitted = action.payload;
			state.examSubmittable = false;
			state.modulesQuestions = [];
			state.hasExamUpdated = false;
			state.hasModuleFinished = false;
			state.moduleBreak = null;
			state.breakFinished = false;
			state.isLoading = false;
		},
		setExams: (state, action) => {
			state.exams = action.payload;
		},
		setAllExams: (state, action) => {
			state.allExams = action.payload;
		},
		setDetailLoading: (state, action) => {
			state.detailLoading = action.payload;
		},
	},
});

export const {
	setLoader,
	setExam,
	setModulesQuestions,
	setModuleBreak,
	setHasModuleFinished,
	setBreakFinished,
	setExamSubmittable,
	setExamSubmitted,
	setExamDetails,
	setDetailsLoader,
	setExams,
	setDetailLoading,
	setAllExams,
} = userSlice.actions;

export default userSlice.reducer;
