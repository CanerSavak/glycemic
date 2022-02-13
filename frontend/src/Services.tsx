import axios from "axios";
import { config } from "process";
import { ResultFoods } from "./models/IFood";
import { authControl } from "./Util";

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
export const foodAdd = ( cid:number, name:string, glycemicindex:number, image:string, source:string,) => {
         
    const headers = authControl()
          const obj = {
            "cid":cid,
            "name":name,
            "glycemicindex":glycemicindex,
            "image":image,
            "source":source,
            "enabled":false
           }
        return axios.post(process.env.REACT_APP_BASE_URL+"/food/save",obj,{
            headers: headers
        })
        
}

//food detail
export const foodDetails = (url:string) => {
    const urltosend:string= "/food/detail/"+url
    return axiosConfig.get(process.env.REACT_APP_BASE_URL+urltosend)
}

// user foods list
export const userFoodList = () => {
    const headers = authControl()
    return axios.get(process.env.REACT_APP_BASE_URL+"/food/userFoodList",{
        headers: headers
    })
}

// admin wait foods list
export const adminWaitFoodList = () => {
    const headers = authControl()
    return axios.get(process.env.REACT_APP_BASE_URL+"/food/adminWaitFoodList",{
        headers: headers
    })
}
// admin wait foods push update
export const adminWaitPushFood = (item: ResultFoods) => {
    const headers = authControl()
    const obj = {
        "gid": item.gid,
        "cid": item.cid,
        "name": item.name,
        "glycemicindex": item.glycemicindex,
        "image": item.image,
        "source": item.source,
        "enabled": item.enabled,
        "url": item.url
    }
  return axios.put(process.env.REACT_APP_BASE_URL+"/food/foodUpdate",obj,{
      headers: headers
  })
}


// admin wait foods push delete
export const adminhFoodDelete = ( gid: number ) => {
    const headers = authControl()
    const obj = {
        "gid": gid,
    }
  return axios.delete(process.env.REACT_APP_BASE_URL+"/food/foodDelete",{
      headers: headers,
      params: obj
  })
}
