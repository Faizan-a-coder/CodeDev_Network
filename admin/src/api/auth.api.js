import axios from "axios";

export const adminLogin = async (data, url) => {
    return await axios.post(`${url}/auth/admin/login`, data);
};

export const adminRegister = async (data, url) => {
    return await axios.post(`${url}/auth/admin/register`, data);
};
