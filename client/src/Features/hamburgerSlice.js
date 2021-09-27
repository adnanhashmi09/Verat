/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const hamburgerSlice = createSlice({
	name: 'hamburger',
	initialState: { active: false },
	reducers: {
		toggleHamburger(state, action) {
			state.active = action.payload;
		},
	},
});

export const { toggleHamburger } = hamburgerSlice.actions;

export default hamburgerSlice.reducer;
