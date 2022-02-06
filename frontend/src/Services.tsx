import axios from "axios";




const axiosConfig = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    auth:{
    username: process.env.REACT_APP_GLOBAL_USERNAME!,
    password:process.env.REACT_APP_GLOBAL_PASSWORD!
    }
})

//ALL Foods List
export const allFoodsList = () =>{
    return axiosConfig.get("food/list")
}