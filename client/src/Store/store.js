/* eslint-disable import/prefer-default-export */

import { configureStore } from '@reduxjs/toolkit';

import loginReducer from '../Features/loginSlice';
import hamburgerReducer from '../Features/hamburgerSlice';
import userReducer from '../Features/userSlice';

export const store = configureStore({
	reducer: {
		login: loginReducer,
		hamburger: hamburgerReducer,
		user: userReducer
	},
});
