/* eslint-disable no-param-reassign */

import { createSlice } from '@reduxjs/toolkit';

const loginSlice = createSlice({
	name: 'login',
	initialState: { login: false },
	reducers: {
		toggleLogin(state, action) {
			state.login = action.payload;
		},
	},
});

export const { toggleLogin } = loginSlice.actions;

export default loginSlice.reducer;
