import axios from "axios";
const url = "http://localhost:3000/superAdmin/admins";




export const getallAdmins = async (id) => {
id = id || "";
return await axios.get(`${url}/${id}`);
};

export const getById = async (id) => {
    return await axios.get(`http://localhost:3000/superAdmin/admin/${id}`);
};


export const addAdmin = async (admin) => {
return await axios.post(url, admin);
};


export const editAdmin = async (id, admin) => {
return await axios.put(`${url}/${id}`, admin);
};


export const deleteAdmin = async (id) => {
return await axios.delete(`${url}/${id}`);
};


export const blockAdmin = async (id) => {
    return await axios.patch(`${url}/${id}/block`);
};


export const unblockAdmin = async (id) => {
    return await axios.patch(`${url}/${id}/unblock`);
};


export const updateProfileSuperAdmin = async (id, admin) => {
    return await axios.put(`http://localhost:3000/superAdmin/profile/${id}`, admin);
};

export const getByEmail = async (email) => {
    return await axios.get(`http://localhost:3000/superAdmin/getByEmail/${email}`);
};
