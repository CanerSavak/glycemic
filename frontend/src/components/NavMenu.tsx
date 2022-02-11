import React, { useEffect, useState } from 'react';
import {  NavLink } from 'react-router-dom';
import { Input, Modal, Image, Header, Button, Form, Menu, Icon } from 'semantic-ui-react';
import { cities } from '../Datas';
import { ToastContainer, toast } from 'react-toastify';
import { userAndAdminLogin } from '../Services';
import { IUser } from '../models/IUser';


export default function NavMenu() {

  
  // user input control for regex
  let regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  let regphone = /^[0]?[5]\d{9}$/;
  const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
            
   // modal delete state
   const [modalRegisterStatus, setModalRegisterStatus] = useState(false);
   const [modalLoginStatus, setModalLoginStatus] = useState(false);

 
   // login and register states
   const [userName, setUserName] = useState("");
   const [userSurname, setUserSurname] = useState("");
   const [userPhone, setUserPhone] = useState("");
   const [userMail, setUserMail] = useState("");
   const [userPass, setUserPass] = useState("");

   //register function
   const fncRegister = () => {
    if (userName == '') {
      toast.warning('Lütfen isim alanını doldurunuz!');
    } else if (userSurname == '') {
      toast.warning('Lütfen soyadı alanını doldurunuz!');
    } else if (userPhone == '') {
      toast.warning('Lütfen telefon alanını doldurunuz!');
    }else if (regphone.test(userPhone) === false) {
      toast.warning('Lütfen geçerli bir telefon numarası giriniz!');
    } else if (userMail == '') {
      toast.warning('Lütfen email alanını doldurunuz!');
    }else if (regemail.test(userMail) === false){
      toast.warning('Lütfen geçerli bir email giriniz!')        
    }    
    else if (userPass == '') {
      toast.warning('Lütfen şifre alanını doldurunuz!');
    }else if (userPass.length <= 8){      
      toast.warning('Şifre 8 karakterden kısa olamaz!');
    }
    else if (!strongRegex.test(userPass)) {
      toast.warning('Şifreniz en az bir büyük bir küçük harf özel işaret ve numara içermelidir!'); 
    }else{
      toast.success("giriş başarılıııııııııııııııııııııııııııııııııııııııııııı")
    }
  }

  // login status
  const [loginStatus, setLoginStatus] = useState(false)
  useEffect(() => {
    console.log( "useEffect Call" )
  }, [loginStatus])

  //login fnc
  const login = () => {
    toast.loading("Yükleniyor.")
    userAndAdminLogin(userMail, userPass).then( res => {
      const usr: IUser = res.data
      if ( usr.status! ) {
        const userResult = usr.result!
        const stUserResult = JSON.stringify( userResult )
        localStorage.setItem( "user", stUserResult )
        setLoginStatus( usr.status! )
      }
      toast.dismiss();
    }).catch( err => {
      toast.dismiss();
      toast.error( "Bu yetkilerde bir kullanıcı yok!" )
    })
  }

 
 

  return ( 
  <>
   <nav className="navbar navbar-inverse">
  <div className="container-fluid">
    <div className="navbar-header">
        <NavLink className='navbar-brand' to = '/' style={{color:"red"}}>Glycemic</NavLink>
    </div>
    <ul className="nav navbar-nav">
      <li><NavLink className='navbar-brand' to = '/home'>Home</NavLink></li>
      <li><a href="#">Gıda Ekle</a></li>
      <li><a href="#">Eklediklerim</a></li>
    </ul>
    <ul className="nav navbar-nav navbar-right">
      <li><a onClick={() =>setModalRegisterStatus(true)} href="#"><span className="glyphicon glyphicon-user"></span> Kayıt Ol</a></li>
      <li><a onClick={() =>setModalLoginStatus(true)} href="#"><span className="glyphicon glyphicon-log-in"></span> Giriş Yap</a></li>
    </ul>  
  </div>
</nav>  

  
<Modal     
      open={modalRegisterStatus}     
    >
      <Modal.Header >Glycemic'e Hoşgeldiniz</Modal.Header>
        <Modal.Content image   >  
              <Image size='large' src='./glycemic.jpg' wrapped  /> 
              <Modal.Description></Modal.Description>    
        <Modal.Content >            
        <Form >
                      <Header textAlign='center'>Kayıt Ol</Header>                   
                        <Form.Field>                          
                          <label >İsim</label>
                          <Form.Input icon='user' iconPosition='left' required style={{ width:380 , }} placeholder='İsim' onChange={(e) => setUserName(e.target.value)} />
                        </Form.Field>
                        <Form.Field >
                          <label>Soy İsim</label>
                          <Form.Input icon='user' iconPosition='left' required   placeholder='Soy İsim' onChange={(e) => setUserSurname(e.target.value)}/>
                        </Form.Field>
                        <Form.Field >
                          <label>Email</label>
                          <Form.Input value={userMail} icon='mail' iconPosition='left' required  placeholder='Email' onChange={(e) => setUserMail(e.target.value)} />
                        </Form.Field>
                        <Form.Field >
                          <label>Şifre</label>
                          <Form.Input icon='key' value={userPass} iconPosition='left' required   placeholder='Şifre' onChange={(e) => setUserPass(e.target.value)}/>
                        </Form.Field>
                        <Form.Field >
                          <label>Telefon</label>
                          <Form.Input icon='mobile' iconPosition='left' required  placeholder='Telefon' onChange={(e) => setUserPhone(e.target.value)} />
                        </Form.Field>
                        <Form.Field >
                          <label>Şehir</label>
                          <Form.Select fluid placeholder='Şehir Seç' options={cities} search />				                  
                        </Form.Field>
                        <Button color='black'  icon='delete' content="Çıkış"  onClick={(e) => setModalRegisterStatus(false)}/>  
                        <Button                          
                          content="Kayıt Ol"
                          labelPosition='right'
                          icon='sign-in alternate'   
                          positive
                          onClick={(e) => fncRegister()}
                        />
                    </Form>    
              </Modal.Content>
            </Modal.Content> 
  </Modal>
             <Modal
             style={{   height: 'auto',
              top: 'auto',
              left: 'auto',
              bottom: 'auto',
              right: 'auto',}}
              open={modalLoginStatus}              
              centered
              size='small'
            >
            <Modal.Header className='center'>Giriş Yap</Modal.Header>
            <Modal.Content>
              <Form>                
                <Form.Group widths='equal' >
                    <Form.Input value={userMail} onChange={(e,d) => setUserMail( d.value )} icon='mail' iconPosition='left' fluid placeholder='Email' />
                  </Form.Group>
                  <Form.Group widths='equal' >
                    <Form.Input value={userPass}  onChange={(e,d) => setUserPass(d.value)} type='password' icon='key' iconPosition='left' fluid placeholder='Şifre' />
                  </Form.Group >
                  <Button 
                  content="Çıkış"
                  color='black' 
                  onClick={(e) => setModalLoginStatus(false)}
                  icon='delete'
                  />
                  <Button 
                  content="Giriş Yap"
                  labelPosition='right'
                  icon='sign-in alternate'   
                  positive
                  onClick={(e) => login()}
                  />
              </Form>     
            </Modal.Content>
     </Modal>



  
  </>
  )}
