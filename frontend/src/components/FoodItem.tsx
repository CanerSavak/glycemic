import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import {  Table, Image, Label, SemanticCOLORS, Button, Icon } from 'semantic-ui-react';
import { ResultFoods } from '../models/IFood';
import { IFoodAction, ReduxFoods } from '../reducers/FoodReducer';
import { StateType } from '../ReduxStore';
import { FoodType } from '../types/FoodType';


interface foodModel {
    item: ResultFoods    
}

export default function ProItem( props:foodModel) {

    const navigate =useNavigate()

    const date = new Date(props.item.createdDate!);

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
    
    const fncGotoDetail = (url:string) =>{       
        window.open("/details/"+url,"_blank")
    }
    const dispatch = useDispatch()
    //double food control
    let doubleCountrol:boolean = false 

    const foodReducer:ReduxFoods[] = useSelector((state: StateType) => state.FoodReducer);       

    const foodAdd = (itemFood:ReduxFoods) => {  
      foodReducer!.forEach(item =>  {
          if(item.gid === itemFood.gid){            
              doubleCountrol  = true              
          }
        })     
      
      if(doubleCountrol === true){
          toast.info("Eklemeye çalıştığınız ürün zaten sepetinizde mevcut")    
          
      }else{
          const food:ReduxFoods={       
          gid:           itemFood.gid,
          cid:           itemFood.cid,
          name:          itemFood.name,
          glycemicindex: itemFood.glycemicindex,
          image:         itemFood.image,
          number:        1        
        }
        const item:IFoodAction = {
          type: FoodType.PRODUCT_ADD,
          payload: food
        }      
        dispatch(item)
        toast.success("Ürün başarıyla sepete eklendi")        
        }        
        
    } 
  
    
  
    
  return <> 
      <ToastContainer/>
      <Table padded textAlign='center' mobile={16} tablet={8} computer={4} sort="asc" >
        <Table.Header >
          <Table.Row textAlign='center'>
            <Table.HeaderCell textAlign='left'>{props.item.name}</Table.HeaderCell>        
            <Table.HeaderCell>Glycemic</Table.HeaderCell>
            <Table.HeaderCell>Kaynak</Table.HeaderCell>
            <Table.HeaderCell>Yüklenme Tarihi</Table.HeaderCell>
            <Table.HeaderCell>Yükleyen Kullanıcı</Table.HeaderCell>
            <Table.HeaderCell>İşlem</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body >
          <Table.Row >
            <Table.Cell >
              {props.item.image !== "" && 
                <Image src={props.item.image} size='small' centered />
              }
              {props.item.image === "" && 
               <Image src="./foods.png" size='small' centered />          
              }
            </Table.Cell>        
            <Table.Cell singleLine  verticalAlign='middle' >
              <Label size='huge' circular color={glycemicColor(props.item.glycemicindex!)}>

              {props.item.glycemicindex}
                </Label>        
                  
            </Table.Cell>
            <Table.Cell verticalAlign='middle'><a href={props.item.source}> {props.item.source} </a> </Table.Cell>     
            <Table.Cell verticalAlign='middle'>                    
              {date.toLocaleDateString()}                  
            </Table.Cell>
            <Table.Cell verticalAlign='middle'>{props.item.createdBy}</Table.Cell>
            <Table.Cell verticalAlign='middle'>
                <div className='ui two buttons'>
                  <Button basic color='green' onClick={()=>  fncGotoDetail(props.item.url!) } >
                  <Icon name='info'/>Detay
                  </Button>
                  <Button basic color='red' onClick={()=>  foodAdd(props.item!)}>
                  <Icon name='food'/>Ekle
                  </Button>
                </div>
            </Table.Cell>
          </Table.Row>      
        </Table.Body>
      </Table>   
 
  </>
}
