/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
	name: 'user',
	initialState: {
		name: null,
		photo: null
	},
	reducers: {
		setUser(state, action) {
            const { firstName, photo } = action.payload;
			state.name = firstName;
            state.photo = photo;
		},
	},
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
