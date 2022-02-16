import React, { ReactEventHandler, useEffect, useState } from 'react';
import {  NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Input, Modal, Image, Header, Button, Form, Menu, Icon, Label, ModalHeader, ModalActions, Table, SemanticCOLORS, ModalDescription } from 'semantic-ui-react';
import { cities } from '../Datas';
import { ToastContainer, toast } from 'react-toastify';
import { logout, userAndAdminLogin, userRegister } from '../Services';
import { IUser, UserResult } from '../models/IUser';
import { control, encryptData } from '../Util';
import { useDispatch, useSelector } from 'react-redux';
import { StateType } from '../ReduxStore';
import { ResultFoods } from '../models/IFood';
import { IFoodAction, ReduxFoods } from '../reducers/FoodReducer';
import { FoodType } from '../types/FoodType';




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
     if ( name === "Onay Sistemi" ) {
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
      setActiveItem("Onay Sistemi")
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

// food basket
const [modalBasket, setModalBasket] = useState(false)
const foodReducer:ReduxFoods[] = useSelector((state: StateType) => state.FoodReducer);
const basket = foodReducer.length

const oldData = localStorage.getItem("basket")
let arr:ReduxFoods[] = []

//control add and delete food basket
const [cntrl, setCntrl] = useState(false)
useEffect(() => {

},[cntrl])
const fncError  = () => {
  toast.warning("Minimum sepet adedine ulaştınız!")
}
const dispatch = useDispatch()

//delete food function
const fncDeleteFood = (id:number) => {
    const food:ReduxFoods={
      gid:id,
      cid:0,
      glycemicindex:0,
      image:"",
      name:"",
      number:0,      
    }
    const item:IFoodAction = {
      type: FoodType.PRODUCT_DELETE,
      payload: food
    }    
    dispatch(item)
    toast.info("Ürün sepetinizden kaldırıldı")   
    
}


//color glysemıc
const glycemicColor = (index:number) : SemanticCOLORS => {
  var color:SemanticCOLORS ="red"
  if (index > 0 && index < 56) {
    color = "green"
  }else if( index > 55 && index < 71 ){
    color= "orange"
  }else if (index > 70 ){
    color="red"
  }
  return color;
} 

useEffect(() => {
  if(oldData){
    arr = JSON.parse(oldData)
    arr!.forEach(item =>{
      foodReducer.push(item)
    })
  }  
}, [loginStatus])

let newArr:ReduxFoods[] = []
useEffect(() => {
  if(foodReducer.length === 0)
  {
    localStorage.removeItem("basket")
  }else{
  foodReducer!.forEach(item => {    
    arr.push(item)
    const newString = JSON.stringify(arr)
    localStorage.setItem("basket",newString)
  })  
}
}, [fncDeleteFood])



const [sumIndex, setsumIndex] = useState(0)
//summit index 
let sumIndex2 = 0
useEffect(() => {    
    foodReducer!.forEach(item =>  {
    sumIndex2 += item.glycemicindex! * item.number!      
    })    
    setsumIndex(sumIndex2)
}, [cntrl,foodReducer])

  return ( 
  <>
  <ToastContainer/>
  <Menu secondary
        stackable
        color='yellow'
        size='large' 
        style={{}}
                 
                  >
          <Menu.Item>
            <img alt="logo" src='/glycemic.jpg' />
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
              <>
              <Menu.Item
              name='Onay Sistemi'
              active={activeItem === 'Onay Sistemi'}
              onClick={ (e, data) => handleItemClick(data.name!) }
              />              
              </>
            }
            <Menu.Menu position='right'>

            { !user && 
            <>
              <Menu.Item                           
                onClick={ (e, data) => setModalBasket(true)}>                                  
                  <Icon name='shopping basket' />Sepetim 
                  <Label color='red' floating>
                    {basket} </Label>             
              </Menu.Item>
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
             <Menu.Item                           
              onClick={ (e, data) => setModalBasket(true)}>                                  
                <Icon name='shopping basket' />Sepetim 
                <Label color='red' floating>
                  {basket} </Label>             
             </Menu.Item>
            
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

      
      <Modal
          size="small"
          style={{   height: 'auto',
          top: 'auto',
          left: 'auto',
          bottom: 'auto',
          right: 'auto',}}
          open={modalBasket}
          onClose={()=> setModalBasket(false)}>
            
            <ModalHeader>Sepetim</ModalHeader>
            {basket === 0 &&            
             <Modal.Content>Sepetinizde gıda bulunmamaktadır</Modal.Content> 
            }
            {basket !== 0 &&             
            <Modal.Content>
            {foodReducer.map((item, index) =>
            <Table key={index} size='small'>
              <Table.Header>
                <Table.Row textAlign='center'>
                  <Table.HeaderCell>{item.name}</Table.HeaderCell>                  
                  <Table.HeaderCell>Glycemic İndex</Table.HeaderCell>
                  <Table.HeaderCell>Adet</Table.HeaderCell>
                  <Table.HeaderCell>Delete</Table.HeaderCell>                  
                </Table.Row>
              </Table.Header>
            
              <Table.Body>
                 
                <Table.Row key ={index}>
                  <Table.Cell textAlign='center' verticalAlign='middle'>
                    <Image src={item.image} size='mini' centered />
                  </Table.Cell>                  
                  <Table.Cell  textAlign='center' verticalAlign='middle'>
                    <Label size='small' circular color={glycemicColor(item.glycemicindex!)}>
                        {item.glycemicindex}
                    </Label>   
                  </Table.Cell>                    
                  <Table.Cell textAlign='center' verticalAlign='middle'>
                    <Button  size='mini' icon onClick={(e) => {item.number !== 1 ? (item.number = item.number!-1): fncError() ;cntrl ? setCntrl(false):setCntrl(true)}} ><Icon name='minus'/></Button>        
                    <Label basic size='small' >{item.number}</Label>
                    <Button  size='mini'icon onClick={(e) => {(item.number! = item.number!+1);cntrl ? setCntrl(false):setCntrl(true)}} ><Icon name='plus'/></Button>
                  </Table.Cell> 
                  <Table.Cell textAlign='center' verticalAlign='middle'>
                    <Button color='red' size='small' icon onClick={(e) =>{ fncDeleteFood(item.gid!);cntrl ? setCntrl(false):setCntrl(true)}}> <Icon name='trash alternate outline'/>Sil</Button>
                  </Table.Cell>
                </Table.Row>
                
              </Table.Body> 
              
            </Table>
            )}
            </Modal.Content>            
            }
            
           
            
            

            <ModalActions>
              <div className='col-md-4'></div>
              <div className='col-md-4' >
            <Label size='large' color='red' horizontal>
            Toplam Glycemic İndex:  {sumIndex}
            </Label></div>            
              <Button icon='exit' color='green' onClick={() => setModalBasket(false) }>
                    Çık
              </Button>
              
            </ModalActions>
            

           
      </Modal>
     




  </>
  )}
  