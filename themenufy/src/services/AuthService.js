import axios from 'axios';
import swal from "sweetalert";
import {
    loginConfirmedAction,
    Logout,
} from '../actions/AuthActions';


// Login function for your custom backend endpoint
export async function login (email, password) {
    const postData = {
        email,
        password,
    };

    return await axios.post('http://localhost:3006/api/user/login', postData)
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
    console.log(errorResponse, "formatError");
    
    const errorMessage = errorResponse?.data?.message; // Get the actual error message from response
    
    switch (errorMessage) {
        case 'EMAIL_EXISTS':
            swal("Oops", "Email already exists", "error");
            break;
        case 'Connexion réussie.':
            swal("Success", "You are logged in!", "success");
            break;
        case 'Utilisateur non trouvé.':
            swal("Oops", "Email not found", "error", { button: "Try Again!" });
            break;
        case 'Mot de passe incorrect.':
            swal("Oops", "Invalid Password", "error", { button: "Try Again!" });
            break;
        case 'Connexion refusée. Il faut attendre la validation du compte.':
        case 'Connexion refusée. Vous devez confirmer votre compte.':
            swal("Oops", errorMessage, "error");
            return 'User Disabled'; // Also return this message
        default:
            swal("Oops", "An unknown error occurred", "error");
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



//! check source
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

//! check source
// Check if the user is logged in based on token stored in localStorage
export function isLogin() {
    const tokenDetailsString = localStorage.getItem('userDetails');
    return tokenDetailsString ? true : false;
}
