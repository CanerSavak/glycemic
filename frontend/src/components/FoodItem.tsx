import { useNavigate } from 'react-router-dom';
import {  Table, Image, Label, SemanticCOLORS, Button, Icon } from 'semantic-ui-react';
import { ResultFoods } from '../models/IFood';


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
    
  return <> 
   
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
                  <Button basic color='red'>
                  <Icon name='food'/>Ekle
                  </Button>
                </div>
            </Table.Cell>
          </Table.Row>      
        </Table.Body>
      </Table>   
 
  </>
}
