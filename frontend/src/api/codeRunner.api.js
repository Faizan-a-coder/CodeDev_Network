import axios from 'axios';

const runCode = async(url,data,token)=>{
    const response = await axios.post(`${url}/submissions/run`,data,{
        headers:{
            Authorization:`Bearer ${token}`
        }
    });

    return response.data;
}

export default runCode;