import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Header, Segment, Transition } from 'semantic-ui-react'
import SiteMenu from './components/SiteMenu'
import { authControl } from './Util'

export default function UserInfo() {
    const navigate = useNavigate()
     // animation
    const [visible, setVisible] = useState(false)
    useEffect(() => {
        if( authControl() === null ) {
            localStorage.removeItem("user")
            localStorage.removeItem("aut")
            navigate("/")
        }
        setTimeout(() => {
            setVisible(true)}, 500)
        })
  
  

  return (
    <>
    <ToastContainer/>
        <SiteMenu/>  
           <Header textAlign='center' as='h1' inverted color='green' size='huge' block>User Bilgi </Header>
           <Transition visible={visible} animation='slide down' duration={750}>
                <Segment inverted   textAlign='center' color='red'  >
                    Hangi kullanıcının ne kadar aktif olduğunu görebilirsiniz!
                </Segment>        
           </Transition> 
    
    </>
  )
}
