import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { Grid, Header, Segment, Transition } from 'semantic-ui-react'
import FoodControlItem from './components/FoodControlItem'
import SiteMenu from './components/SiteMenu'
import { IFoods, ResultFoods } from './models/IFood'
import { adminWaitFoodList, userFoodList } from './Services'
import { authControl, control } from './Util'

export default function AdminWaitFoodList() {

  const navigate = useNavigate()
  const [foodsArr, setFoodsArr] = useState<ResultFoods[]>([]);
  var isAdmin = false
    
  // animation
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const usr = control()
    if (usr !== null) {
      usr.roles!.forEach(item => {
        if ( item.name === "ROLE_admin" ) {
          isAdmin = true
        }
      });
    }
    
    if( authControl() === null || isAdmin === false ) {
      localStorage.removeItem("user")
      localStorage.removeItem("aut")
      navigate("/")
    }
    setTimeout(() => {
      setVisible(true)
    }, 500);

    // user food list service
    toast.loading("Yükleniyor.")
    adminWaitFoodList().then( res => {
        const dt:IFoods = res.data;
        setFoodsArr( dt.result! )
        toast.dismiss(); 
    }).catch(err => {
        toast.dismiss();
        toast.error( "Ürün listeleme işlemi sırasında bir hata oluştu!" )
    })

  }, [])

  

  return (
    <>
        <ToastContainer />
        <SiteMenu />
        <Header textAlign='center' as='h1' inverted color='green' size='huge' block>
        Onay bekleyen gıdalar
        </Header>
        <Transition visible={visible} animation='slide down' duration={750}>
        <Segment inverted   textAlign='center' color='red'  >
            Kullanıcaların eklemiş olduğu gıdalara onay işlemlerini yapınız!
        </Segment>
        </Transition>

        <Grid >
            { foodsArr.map((item, index) => 
                <FoodControlItem  key={index} item={item} status={true} isAdmin={true} /> 
            )}
        </Grid>
    </>
  )
}