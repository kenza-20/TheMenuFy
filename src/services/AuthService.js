import axios from 'axios';
import swal from "sweetalert";
import {
    loginConfirmedAction,
    Logout,
} from '../actions/AuthActions';

// 🔹 Login function
export async function login(email, password) {
    const postData = { email, password };

    return await axios.post('http://localhost:3000/api/user/login', postData)
        .then(response => {
            console.log("Full Backend Response:", response.data); // Debugging
            localStorage.setItem('token', response.data.token);
            return response.data;  // Backend should send token & user info
        })
        .catch(error => {
            throw error.response || error;
        });
}

// 🔹 Error Formatting Function
export function formatError(errorResponse) {
    console.log("Error Response:", errorResponse);

    const errorMessage = errorResponse?.data?.message; 
    
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
            return 'User Disabled';
        default:
            swal("Oops", "An unknown error occurred", "error");
            return '';
    }
}

// 🔹 Save Token in LocalStorage


export function saveTokenInLocalStorage(responseData) {
    const { token, user, message } = responseData;
    const userId = user?.id || responseData.userId; // 🔥 Fix: Extract userId properly

    console.log("User ID:", userId, "Message:", message); // Debugging

    // Set expiration to 1 hour
    const expireDate = new Date(new Date().getTime() + 3600 * 1000);

    // Store data in localStorage
    localStorage.setItem('userDetails', JSON.stringify({ token, user, expireDate }));
    if (userId) {
        localStorage.setItem('userId', userId);
    }
}

// 🔹 Auto Login Check
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

// 🔹 Check if User is Logged In
export function isLogin() {
    const tokenDetailsString = localStorage.getItem('userDetails');
    return tokenDetailsString ? true : false;
}
