import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'
import { Form, Header, Icon, InputOnChangeData, Segment, Image, Button, Transition } from 'semantic-ui-react'
import SiteMenu from './components/SiteMenu'
import { categories } from './Datas';
import { IFoods, ISingleFood } from './models/IFood';
import {  UserResult } from './models/IUser';
import { foodAdd } from './Services';
import { authControl, decryptData } from './Util';


export default function FoodsAdd() {

  //navigate
  const navigate = useNavigate()

  // form item states
  const [name, setName] = useState("")
  const [glycemicindex, setGlycemicindex] = useState("")
  const [source, setSource] = useState("")
  const [cid, setCid] = useState("")
  const [base64Image, setBase64Image] = useState("")

 

  const fncSend = () => {
      console.log('fncSend Call')
  }
  const [output, setOutPut] = useState("")
  // image to base64
  const imageOnChange = (e:any, d:InputOnChangeData) => {
        const file = e.target.files[0]
        const size:number = file.size / 1024 // kb
        if ( size > 10 ) { // 10 kb
            toast.error("Lütfen max 10 kb bir resim seçiniz!")
        }else {            
            const fle = e.target.files[0]
            const str:string = fle.res            
            getBase64(file).then( res => {
                 
            })
        } 
  }

  const getBase64 = ( file: any ) => {
    return new Promise(resolve => {
        let fileInfo;
        let baseURL:any = "";
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          baseURL = reader.result
          setBase64Image(baseURL)
          setOutPut(baseURL)
          resolve(baseURL);
        };
        
      });
  }

  const fncFoodAdd = () => {
    
    if (name == '') {
      toast.warning('Lütfen gıda ismi alanını doldurunuz!');
    } else if (glycemicindex =="") {
      toast.warning('Lütfen glysemic index alanını doldurunuz!');
    } else if (source == '') {
      toast.warning('Lütfen kaynak alanını doldurunuz!');
    }else if (cid == "") {
      toast.warning('Lütfen bir kategori giriniz!');
    } else if (base64Image == '') {
      toast.warning('Lütfen bir resim yükleyiniz!');
    }else {
      toast.loading("Yükleniyor.")
      foodAdd( parseInt(cid), name, parseInt(glycemicindex),  base64Image, source)
      .then(res => { 
        const food:ISingleFood = res.data
        toast.dismiss(); 
        if ( food.status ) {
          // ekleme başarılı
          toast.success("Ürün ekleme işlemi başarılı")          
        }else { 
          toast.error( food.message )
        }
       }).catch(err => {
        toast.dismiss();
        toast.error( "Ürün ekleme işlemi sırasında bir hata oluştu!" )
      })
    }    
  }
  const [visible, setVisible] = useState(false)  
  useEffect(() => {
    if(authControl() ===null){
        navigate("/")
        localStorage.removeItem("user")
        localStorage.removeItem("auth")
    }  
    setTimeout(() => {
      setVisible(true)
  }, 500)})



  return (
    <>
    <ToastContainer />
    <SiteMenu  />
    <Header textAlign='center' as='h1' inverted color='green' size='huge' block>
        Gıda Ekle
    </Header>
    <Transition visible={visible} animation='slide down' duration={750}>    
    <Segment inverted   textAlign='center' color='red' >
      Burada eklediğiniz gıdalar, admin onayına gidip denetimden geçtikten sonra yayına alınır!
    </Segment>
    </Transition>
    <div className='row' > 
            <Form>
          <div className='col-md-4'> 
            <Segment placeholder >
              { output !== ""  &&
                <Image src={output} size='small' centered  /> }
              {output === "" &&
                <Header icon>        
                <Icon name='image'></Icon>                      
                Lütfen resim seçiniz               
                </Header>   
                }               
               <Form.Input className='file' onChange={(e, d) => imageOnChange(e,d) } type='file'    />    
                      
            </Segment>
           
            </div> 
            <div className='col-md-8'> 
                <Form.Input fluid label='Gıda Adı' onChange={(e) => setName(e.target.value)} placeholder='Gıda Adı' />
                <Form.Input type='number' min='0' max='150' onChange={(e) => setGlycemicindex(e.target.value)} fluid label='Glisemik İndex' placeholder='Glisemik İndex' />
                <Form.Select  label='Kategori' value={cid} fluid placeholder='Kategori' options={categories} search onChange={(e,d) => setCid( ""+d.value )} />
                <Form.Input fluid label='Kaynak'  onChange={(e) => setSource(e.target.value)}
                placeholder='Kaynak' />
                <Button type='submit' onClick={(e) => fncFoodAdd()}>Ekle</Button>
            </div>
            </Form>
    </div> 
      
        
    
     

    </>
  )
}