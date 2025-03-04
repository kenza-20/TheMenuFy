


export const SIGNUP_CONFIRMED_ACTION = '[signup action] confirmed signup';
export const SIGNUP_FAILED_ACTION = '[signup action] failed signup';
export const LOGIN_CONFIRMED_ACTION = '[login action] confirmed login';
export const LOGIN_FAILED_ACTION = '[login action] failed login';
export const LOADING_TOGGLE_ACTION = '[Loading action] toggle loading';
export const LOGOUT_ACTION = '[Logout action] logout action';

import {
    login,
    formatError,
    saveTokenInLocalStorage
} from '../services/AuthService';


export function Logout(navigate) {
	localStorage.removeItem('userDetails');
    navigate('/sign-in');
	//history.push('/login');
    
	return {
        type: LOGOUT_ACTION,
    };
}


export function loginAction(email, password, navigate) {
    return async (dispatch) => {
        try {
            const response = await login(email, password);
            console.log("response", response);

            // Save token and user details in localStorage
            saveTokenInLocalStorage(response);
            dispatch(loginConfirmedAction(response.user));

            console.log("Login successful! Navigating to dashboard...");
            navigate("/dashboard");  // ✅ Easy fix: Navigate after successful login

        } catch (error) {
            // const errorMessage = formatError(error);
            // dispatch(loginFailedAction(errorMessage));
            console.log("Login failed! Navigating to login page...");
        }
    };
}




export function loginFailedAction(data) {
    return {
        type: LOGIN_FAILED_ACTION,
        payload: data,
    };
}

// In AuthActions.js
export const loginConfirmedAction = (user) => {
    return {
        type: 'LOGIN_SUCCESS',
        payload: user, // or you can send additional info like 'token' here
    };
};



export function loadingToggleAction(status) {
    return {
        type: LOADING_TOGGLE_ACTION,
        payload: status,
    };
}