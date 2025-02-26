export const isAuthenticated = (state) => {
    
        const tokenDetailsString = localStorage.getItem('userDetails')
    if(tokenDetailsString){
            return true
        }
        return false
        
    //     console.log("state", state)
    // if (state.auth.auth.id) return true;
    // return false;
};
