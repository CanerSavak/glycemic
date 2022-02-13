import axios from "axios";
import { config } from "process";

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


//user and admin logout
export const logout = () =>{
    return axiosConfig.get("register/userLogOut")
}

//user register
export const userRegister = ( name:string,surname:string, cityid:number, mobile:string,  email:string, password:string ) => {
    const obj = {
        "name":name,
        "surname":surname,
        "cityid":cityid,
        "mobile":mobile,
        "email":email,
        "password":password,
        "enabled":true,
        "tokenExpired":true,
        "roles":[{
            "rid":0, "name":"role_user"
        }]

    }
    return axios.post(process.env.REACT_APP_BASE_URL+"/register/userRegister",obj)
}


//food add
export const foodAdd = (email:string, password:string, cid:number, name:string, glycemicindex:number, image:string, source:string,) => {
           // const config = axios.create({
           //     baseURL: process.env.REACT_APP_BASE_URL,
          //      auth:{
          //      username:email,
          //      password:password
          //      }
         //   })
    
          const param = {
            "cid":cid,
            "name":name,
            "glycemicindex":glycemicindex,
            "image":image,
            "source":source,
            "enabled":true
           }
        return axios.post(process.env.REACT_APP_BASE_URL+"/food/save",param)
        
}