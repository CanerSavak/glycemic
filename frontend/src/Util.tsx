import CryptoJS from 'crypto-js';
import { UserResult } from './models/IUser';
                        
export const encryptData = (data:any, salt:string) =>
  CryptoJS.AES.encrypt(JSON.stringify(data), salt).toString();


export const decryptData = (ciphertext:string, salt:string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, salt);
  try {
     return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
  catch(err){
    return null;
  }
}

//user object control
export const control = () => {

    const localUser = localStorage.getItem("user")
    if (localUser) {
      const key = process.env.REACT_APP_SALT
      const decrypt = decryptData(localUser,key!)
      if( decrypt !== null){
        try{            
            const usr:UserResult = decrypt
            return usr
        }catch(error){
                localStorage.removeItem("user")
                return null;
        }  
        

      }else {
          localStorage.removeItem("user")
          return null
      }
        
    }else{
        
        return null;
    }

}

// auth control
export const authControl = () => {
  const stLocal = localStorage.getItem("auth")
  if(stLocal){
    try {
      const key = process.env.REACT_APP_SALT
      const decyrpte =decryptData(stLocal,key!)
      if(decyrpte !== null){
      return decyrpte
      }
    } catch (error) {
      return null
    }
  }else{
    return null
  }
}