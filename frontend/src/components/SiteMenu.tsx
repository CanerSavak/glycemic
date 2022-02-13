import React, { ReactEventHandler, useEffect, useState } from 'react';
import {  NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Input, Modal, Image, Header, Button, Form, Menu, Icon, Label } from 'semantic-ui-react';
import { cities } from '../Datas';
import { ToastContainer, toast } from 'react-toastify';
import { logout, userAndAdminLogin, userRegister } from '../Services';
import { IUser, UserResult } from '../models/IUser';
import { control, encryptData } from '../Util';




export default function NavMenu() {
  
  // modal delete state
  const [modalRegisterStatus, setModalRegisterStatus] = useState(false);
  const [modalLoginStatus, setModalLoginStatus] = useState(false);

  //active page control
  const [activeItem, setActiveItem] = useState("Anasayfa")

  const loc = useLocation()
   // useNavigate and active page setting
   const navigate = useNavigate()  
   const handleItemClick = (name:string) => {
     setActiveItem(name)
 
     if ( name === "Anasayfa" ) {
       navigate("/")
     }
 
     if ( name === "Gıda Ekle" ) {
       if ( control() === null ) {
         setModalLoginStatus(true);
       }else {
         navigate("/foodsAdd")
       }
     }
     if ( name === "Eklediklerim" ) {
       if ( control() === null ) {
         setModalLoginStatus(true);
       }else {
         navigate("/foodsList")
       }
     }
     if ( name === "Bekleyenler" ) {
      if ( control() === null ) {
        setModalLoginStatus(true);
      }else {
        navigate("/waitFoodsList")
      }
    }
 
   }

  // url control and menu active
  
  const urlActive = () => {
    if ( loc.pathname === "/" ) {
      setActiveItem("Anasayfa")
    }
    if ( loc.pathname === "/foodsAdd" ) {
      setActiveItem("Gıda Ekle")
    }
    if ( loc.pathname === "/foodsList" ) {
      setActiveItem("Eklediklerim")
    }
    if ( loc.pathname === "/waitFoodsList" ) {
      setActiveItem("Bekleyenler")
    }
  }


  //  regex for user input control 
  let regemail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  let regphone = /^[0]?[5]\d{9}$/;
  const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

  // login and register states
  const [userName, setUserName] = useState("");
  const [userSurname, setUserSurname] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userMail, setUserMail] = useState("");
  const [userPass, setUserPass] = useState("");
  const [cityId, setCityId] = useState("");

  //login user object   
  const [user, setUser] = useState<UserResult|null>() 

   //register function
   const fncRegister = (e: React.FormEvent) => {
     e.isDefaultPrevented()
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
      toast.loading("Yükleniyor.")
    userRegister( userName, userSurname, parseInt(cityId), userPhone, userMail, userPass )
    .then(res => {
      const usr:IUser = res.data
      toast.dismiss();
      if ( usr.status ) {
        // kayıt başarılı
        toast.success("Kayıt işlemi başarılı oldu, Lütfen giriş yapınız")
        setModalRegisterStatus(false)
        setModalLoginStatus(true)
      }else {
        toast.error( usr.message )
      }
    }).catch(err => {
      toast.dismiss();
      toast.error( "Kayıt işlemi sırasında bir hata oluştu!" )
    })
  } 
}

  // login status
  const [isAdmin, setIsAdmin] = useState(false)
  const [loginStatus, setLoginStatus] = useState(false)
  useEffect(() => {
    urlActive()
    const usr = control()
    if (usr !== null) {
      setUser(usr)
      usr.roles!.forEach(item => {
        if ( item.name === "ROLE_admin" ) {
          setIsAdmin(true)
        }
      });
    }
  }, [loginStatus])

  //login fnc
  const login = (e:React.FormEvent) => {
    if (userMail == '') {
      toast.warning('Lütfen email alanını doldurunuz!');
    }else if (regemail.test(userMail) === false){
      toast.warning('Lütfen geçerli bir email giriniz!')        
    }else if (userPass == ''){
      toast.warning('Lütfen şifre alanını doldurunuz!');    
    }else{
    e.isDefaultPrevented()
    toast.loading("Yükleniyor.")
    userAndAdminLogin(userMail, userPass).then( res => {
      const usr: IUser = res.data
      if ( usr.status! ) {
        const userResult = usr.result!
        const key = process.env.REACT_APP_SALT
        const cryptString = encryptData(userResult, key!) 
        const userAuthString = encryptData(res.config.headers, key!)
        localStorage.setItem("auth",userAuthString)       
        localStorage.setItem( "user", cryptString )
        setLoginStatus( usr.status! )
        setModalLoginStatus(false)
        
      }
      toast.dismiss();
    }).catch( err => {
      toast.dismiss();
      toast.error( "Bu yetkilerde bir kullanıcı yok!" )
    })
  }
  }

   // logout
   const [isLogOut, setIsLogOut] = useState(false)
   // log out fnc
   const fncLogOut = () => {
    toast.loading("Yükleniyor.")
    logout().then( res => {
      localStorage.removeItem("user")
      setIsLogOut(false)
      setUser(null)
      setLoginStatus(false)
      setIsAdmin(false)
      toast.dismiss();
      window.location.href = "/"
  }).catch(err => {
    toast.dismiss();
    toast.error( "Çıkış işlemi sırasında bir hata oluştu!" )
  })
}

 
 

  return ( 
  <>
  <ToastContainer/>
  <Menu secondary
        stackable
        color='red'
        size='large' 
                 
                  >
          <Menu.Item>
            <img alt="logo" src='/logo.png' />
          </Menu.Item>
            <Menu.Item
            name='Anasayfa'
            active={activeItem === 'Anasayfa'}
            onClick={ (e, data) => handleItemClick(data.name!) }
            />
            <Menu.Item
            name='Gıda Ekle'
            active={activeItem === 'Gıda Ekle'}
            onClick={ (e, data) => handleItemClick(data.name!) }
            />
            <Menu.Item
            name='Eklediklerim'
            active={activeItem === 'Eklediklerim'}
            onClick={ (e, data) => handleItemClick(data.name!) }
            />
             { isAdmin === true && 
              <Menu.Item
              name='Bekleyenler'
              active={activeItem === 'Bekleyenler'}
              onClick={ (e, data) => handleItemClick(data.name!) }
              />
            }
            <Menu.Menu position='right'>

            { !user && 
            <>
              <Menu.Item
                  name='Giriş Yap'
                  icon='sign-in   '
                  active={activeItem === 'Giriş Yap'}
                  onClick={ (e, data) => setModalLoginStatus(true) }
              />
              <Menu.Item
                  name='Kayıt Ol'
                  icon='signup ' 
                  active={activeItem === 'Kayıt Ol'}
                  onClick={ (e, data) => setModalRegisterStatus(true) }
              />
            </>}

            { user && 
            <>
            
             <Menu.Item>
              <Label color='red' >
                <Icon name='user outline' /> { user.name } { user.surname }
              </Label>
             </Menu.Item>

              <Menu.Item
                  icon='sign-out'
                  name='Çıkış Yap'
                  active={activeItem === 'Çıkış Yap'}
                  onClick={ (e, data) => setIsLogOut(true) }
              />
            </>}

            </Menu.Menu>
        </Menu>  
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
                         
                          <Form.Input label='İsim' icon='user' value={userName} iconPosition='left'  style={{ width:380 , }} placeholder='İsim' onChange={(e) => setUserName(e.target.value)} />
                        </Form.Field>
                        <Form.Field >
                          <label>Soy İsim</label>
                          <Form.Input icon='user' value={userSurname} iconPosition='left'    placeholder='Soy İsim' onChange={(e) => setUserSurname(e.target.value)}/>
                        </Form.Field>
                        <Form.Field >
                          <label>Email</label>
                          <Form.Input value={userMail} icon='mail' iconPosition='left'   placeholder='Email' onChange={(e) => setUserMail(e.target.value)} />
                        </Form.Field>
                        <Form.Field >
                          <label>Şifre</label>
                          <Form.Input icon='key' value={userPass} iconPosition='left'    placeholder='Şifre' onChange={(e) => setUserPass(e.target.value)}/>
                        </Form.Field>
                        <Form.Field >
                          <label>Telefon</label>
                          <Form.Input icon='mobile' value={userPhone} iconPosition='left'   placeholder='Telefon' onChange={(e) => setUserPhone(e.target.value)} />
                        </Form.Field>
                        <Form.Field >
                          <label>Şehir</label>
                          <Form.Select fluid value={cityId} placeholder='Şehir Seç' options={cities} search
                           />				                  
                        </Form.Field>
                        <Button color='black'  icon='delete' content="Çıkış"  onClick={(e) => setModalRegisterStatus(false)}/>  
                        <Button                          
                          content="Kayıt Ol"
                          labelPosition='right'
                          icon='sign-in alternate'   
                          positive
                          onClick={(e) => fncRegister(e)}
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
              <Form >                
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
                  type='submit'
                  content="Giriş Yap"
                  labelPosition='right'
                  icon='sign-in alternate'   
                  positive
                  onClick={(e) => login(e)}
                  />
              </Form>     
            </Modal.Content>
     </Modal>

     <Modal
          size='mini'
          style={{   height: 'auto',
          top: 'auto',
          left: 'auto',
          bottom: 'auto',
          right: 'auto',}}
          open={isLogOut}
          onClose={() => setIsLogOut(false) }
        >
        <Modal.Header>Çıkış İşlemi</Modal.Header>
        <Modal.Content>
          <p>Çıkmak istediğinizden emin misniz?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button icon='delete' negative onClick={() => setIsLogOut(false) }>
            İptal
          </Button>
          <Button icon='sign-out' positive onClick={() => fncLogOut() }>
            Çıkış Yap
          </Button>
        </Modal.Actions>
      </Modal>

  
  </>
  )}
  