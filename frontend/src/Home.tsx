import React, { useEffect, useState } from 'react';
import { allFoodsList } from './Services';
import { ToastContainer, toast } from 'react-toastify';
import { IFoods, ResultFoods } from './models/IFood';
import {  Dropdown, DropdownProps,  Header,  Input,  Pagination,  } from 'semantic-ui-react';
import ProItem from './components/FoodItem';
import { categories } from './Datas';
import SiteMenu from './components/SiteMenu';


export default function Home()  {

    //data array
    const [foodsArr, setFoodsArr] = useState<ResultFoods[]>([]);
    const [searchArr, setSearchArr] = useState<ResultFoods[]>([]);

    //pages
    const [pageCount, setPageCount] = useState(0);
    const [postsperpage, setPostsPerPage] = useState(10)
    const [currentPage, setCurrentPage] = useState<number>(1);    

    //select categories
    const [selectCategories, setSelectCategories] = useState(0);
    const [wordSearch, setWordSearch] = useState("")

    //current post  
    const indexOfLastPost = currentPage * postsperpage;
    const indexOfFirstPost = indexOfLastPost- postsperpage;
    const currentpost = foodsArr.slice(indexOfFirstPost,indexOfLastPost);

    //pagenation function
    const fncPagenation = ( count:ResultFoods[] ) =>{
        if(Math.round(count.length%postsperpage) === 0){
          setPageCount(count.length /postsperpage)            
        }else{           
          setPageCount(Math.ceil(count.length/postsperpage))              
        }   
    }    

    useEffect(() => {
    
     toast.loading("Yükleniyor")   
     allFoodsList().then( res =>{
         const dt:IFoods = res.data;         
         setFoodsArr(dt.result!)
         setSearchArr(dt.result!)         
         fncPagenation(dt.result!)
        toast.dismiss();
     }).catch ( err => {  
        toast.dismiss(); 
        toast.error( ""+err )
     })

    }, []);    
    
    
    
    //search
    const search = (q:string) => {
      setCurrentPage(1)
      setWordSearch(q)     
      if( q === ""){
        var newArr: ResultFoods[] = searchArr
        if ( selectCategories !== 0 ) {
          newArr = newArr.filter( item => item.cid === selectCategories )
        }
        setFoodsArr(newArr)       
        fncPagenation(newArr)
      }
      else{ 
        q = q.toLowerCase()              
        var newArr =searchArr.filter( item => item.name?.toLowerCase().includes(q) || (""+item.glycemicindex).includes(q) )
          if(selectCategories !== 0){
            newArr = newArr.filter( item => item.cid === selectCategories)
          }
          setFoodsArr(newArr)          
          fncPagenation(newArr)
      }
    }
   
    // select page
    const handlePaginationChange = (e: any, { activePage }: any) => setCurrentPage(activePage)
    
    //select categories
    const catOnChange = (str:string) =>{      
      const numCat = parseInt(str)
      setCurrentPage(1)
      setSelectCategories(numCat)
      var newArr: ResultFoods [] = searchArr
    if(numCat !== 0){
      newArr = newArr.filter( item => item.cid === numCat )
    }
    if(wordSearch !== ""){    
     newArr = newArr.filter( item => item.name?.toLowerCase().includes(wordSearch) || (""+item.glycemicindex).includes(wordSearch))      
    }
    setFoodsArr(newArr) 
    fncPagenation(newArr)
    }   
      


  return (
  <> 
      <ToastContainer/>
        <SiteMenu/>  
           <Header textAlign='center' as='h1' inverted color='green' size='huge' block>Food List </Header>                 
           <Input value={wordSearch}  onChange={(e) => search(e.target.value)} fluid style={{ marginBottom: 10, }}
            action={
            <Dropdown button basic floating options={categories} 
            onChange={(e,data:DropdownProps) =>  catOnChange(""+data.value)}
            placeholder="Kategori Seç" />
             }
            icon='search'
            iconPosition='left'
            placeholder='Search...'/>    
           { 
            currentpost.map((itm, index) =>
              <ProItem key={index} item={itm}/>)            
           }               
        
            <Pagination              
              ActivePage={currentPage}                  
              pointing
              secondary
              totalPages={pageCount}              
              onPageChange={handlePaginationChange}
            /> 
  </>
  );
  
  
}
