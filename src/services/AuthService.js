import axios from 'axios';
import swal from "sweetalert";
import {
    loginConfirmedAction,
    Logout,
} from '../store/actions/AuthActions';

// Sign up function for your custom backend endpoint
export function signUp(email, password) {
    const postData = {
        email,
        password,
    };
    return axios.post(
        `http://localhost:3006/auth/signup`, // Replace with your endpoint
        postData,
    );
}

// Login function for your custom backend endpoint
export async function login (email, password) {
        const postData = {
            email,
            password,
        };
    
        return await axios.post('http://localhost:3006/auth/login', postData)
            .then(response => {
                localStorage.setItem('token', response.data.token);
                console.log(response,"yay")
                return response.data;  // The backend sends a message, token, and user
            })
            .catch(error => {
                // Handle network or other errors
                throw error.response || error;  // Ensure the error is passed correctly
            });
    
    
}

// Format error function to show alerts based on the response from your backend
export function formatError(errorResponse) {
    switch (errorResponse.error) {
        case 'EMAIL_EXISTS':
            swal("Oops", "Email already exists", "error");
            break;
        case 'EMAIL_NOT_FOUND':
            swal("Oops", "Email not found", "error", { button: "Try Again!" });
            break;
        case 'INVALID_PASSWORD':
            swal("Oops", "Invalid Password", "error", { button: "Try Again!" });
            break;
        case 'USER_DISABLED':
            return 'User Disabled';
        default:
            return '';
    }
}

// Save token and user details to localStorage
export function saveTokenInLocalStorage(responseData) {
    // Assuming the responseData contains the token, user details, and expiry time
    const { token, user, message } = responseData;
    console.log(message, "messageee")

    // Set the expiration date to 1 hour from now
    const expireDate = new Date(new Date().getTime() + 3600 * 1000); // 1 hour expiry

    // Save token and user details in local storage
    localStorage.setItem('userDetails', JSON.stringify({
        token,
        user,
        expireDate
    }));
}




// Run the logout timer based on token expiration time
export function runLogoutTimer(dispatch, timer, navigate) {
    setTimeout(() => {
        dispatch(Logout(navigate));
    }, timer);
}

// Check for auto login based on token stored in localStorage
export function checkAutoLogin(dispatch, navigate) {
    const tokenDetailsString = localStorage.getItem('userDetails');
    let tokenDetails = '';
    
    if (!tokenDetailsString) {
        dispatch(Logout(navigate));
        return;
    }

    tokenDetails = JSON.parse(tokenDetailsString);
    let expireDate = new Date(tokenDetails.expireDate);
    let todaysDate = new Date();

    if (todaysDate > expireDate) {
        dispatch(Logout(navigate));
        return;
    }

    dispatch(loginConfirmedAction(tokenDetails));

    const timer = expireDate.getTime() - todaysDate.getTime();
    runLogoutTimer(dispatch, timer, navigate);
}

// Check if the user is logged in based on token stored in localStorage
export function isLogin() {
    const tokenDetailsString = localStorage.getItem('userDetails');
    return tokenDetailsString ? true : false;
}
