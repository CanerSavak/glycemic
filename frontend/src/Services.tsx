import axios from "axios";
import { string } from "yup/lib/locale";




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

//user and admin login
export const userAndAdminLogin = (email:string, password:string) => {
    const conf = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
    auth:{
    username:email,
    password:password
        }
    })
    const params = {
        email:email,       
    }
    return conf.post("/register/login", {} ,{params:params})
}