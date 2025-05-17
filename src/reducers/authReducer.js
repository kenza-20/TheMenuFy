const initialState = {
    loading: false,
    user: null,
    error: null,
  };
  
  const authReducer = (state = initialState, action) => {
    switch (action.type) {
      case "LOADING":
        return { ...state, loading: true };
  
      case "LOGIN_SUCCESS":
        return { ...state, loading: false, user: action.payload, error: null };
  
      case "LOGIN_ERROR":
        return { ...state, loading: false, user: null, error: action.payload };
  
      case "LOGOUT_ACTION":
        return { ...state, user: null };
  
      default:
        return state;
    }
  };
  
  export default authReducer;
  