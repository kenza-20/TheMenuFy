import axios from "axios";
const url="http://localhost:3000/api/user"

export async function forgotPassword(formData) {
    return await axios.post(`${url}/forgot-password`, formData );
  }
  