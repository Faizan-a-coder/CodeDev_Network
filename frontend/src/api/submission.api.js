import axios from "axios";

const createSubmission = async (url,data,token)=>{
    const response = await axios.post(`${url}/submissions`,data,{headers:{
        Authorization:`Bearer ${token}`
    }});

    return response.data;
}

const getAllSubmissionsOfAProblem = async (url,slug,token)=>{
    const response = await axios.get(`${url}/problems/${slug}/submissions`,{headers:{
        Authorization:`Bearer ${token}`
    }});

    return response.data;
}



export {createSubmission,getAllSubmissionsOfAProblem}