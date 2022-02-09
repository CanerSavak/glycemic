import React, { useEffect, useState } from 'react';
import { allFoodsList } from './Services';
import { ToastContainer, toast } from 'react-toastify';
import { IFoods, ResultFoods } from './models/IFood';
import NavMenu from './components/NavMenu';
import { Dropdown, Grid, GridColumn, Header, Input } from 'semantic-ui-react';
import ProItem from './components/FoodItem';

export default function Home() {


  const options = [
    { key: 'y', text: 'Yiyecek', value: 'yiyecek' },
    { key: 'i', text: 'İçecek', value: 'icecek' },
    { key: 'm', text: 'Meyve&Sebze', value: 'other' },
  ]


    const [foodsArr, setFoodsArr] = useState<ResultFoods[]>([]);
    const [searchArr, setSearchArr] = useState<ResultFoods[]>([]);

    //pages
    const [pageCount, setPageCount] = useState(5);

    useEffect(() => {
    
     toast.loading("Yükleniyor")   
     allFoodsList().then( res =>{
         const dt:IFoods = res.data;
         setFoodsArr(dt.result!)
         setSearchArr(dt.result!)
        toast.dismiss();
     }).catch ( err => {  
        toast.dismiss(); 
        toast.error( ""+err )
     })

    }, []);
    
    const search = (q:string) => {
      if( q === ""){
        setFoodsArr(searchArr)
      }
      else{
        q = q.toLowerCase()
        const newArr =searchArr.filter( item => item.name?.toLowerCase().includes(q) )
        setFoodsArr(newArr)
      }
    }
   


  return (
  <>
      
      <ToastContainer/>
      <NavMenu/>  
      <Header className="ui center aligned header" as='h4' inverted color='green' size='huge' >Food List </Header>                 
           <Input onChange={(e) => search(e.target.value)} fluid style={{ marginBottom: 10, }}
            action={
            <Dropdown button basic floating options={options} defaultValue='page' />
             }
            icon='search'
            iconPosition='left'
            placeholder='Search...'
            />
            
 
      { 
      foodsArr.map((itm, index) =>
        <ProItem key={index} item={itm}/>
      )
      }
      
      
  
  </>
  );
  
  
}
