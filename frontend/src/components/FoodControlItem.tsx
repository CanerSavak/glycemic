import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Grid, Icon, Image, Label, SemanticCOLORS } from 'semantic-ui-react';
import { categories } from '../Datas';
import { ISingleFood, ResultFoods } from '../models/IFood';
import { adminhFoodDelete, adminWaitPushFood } from '../Services';

interface itemType {
    item: ResultFoods,
    status?: boolean,
    isAdmin?: boolean,
}

export default function FoodsItem( props: itemType ) {

    const navigate = useNavigate()
    const date = new Date(props.item.createdDate!);

    const glycemicColor = ( index:number ): SemanticCOLORS => {
        var color:SemanticCOLORS = 'red'
        if ( index > 0 && index < 56 ) {
            color = 'green'
        }else if ( index > 55 && index < 71 ) {
            color = 'orange'
        }else if ( index > 70) {
            color = 'red'
        }
        return color;
    }

    

    // goto push
    const fncPush = () => {
        const itm = props.item
        itm.enabled = true
        adminWaitPushFood(itm).then( res => {
            const dt:ISingleFood = res.data
            if ( dt.status === true) {
                window.location.href = "/waitFoodsList"
            }
        }).catch(err => {

        })
    }

    const deleteItem = () => {
        const itm = props.item
        adminhFoodDelete( itm.gid! ).then(res => {
            const dt:ISingleFood= res.data
            if ( dt.status === true) {
                window.location.href = "/waitFoodsList"
            }
        }).catch( err => {

        } )
    }

  return (
    <Grid.Column  mobile={8} tablet={8} computer={8} >
    <Card fluid >
        <Card.Content>
        
        {  props.item.image !== "" && 
            <Image 
                floated='right'
                size='tiny'
                src={ props.item.image }
            />
        }

        {  props.item.image === "" && 
            <Image 
                floated='right'
                size='tiny'
                src='./foods.png'
            />
        }

        { props.status && 
            <>
                <Label style={{ marginBottom: 10, }} as='a' color={ props.item.enabled === true ? 'blue'  : 'red' } ribbon>
                    { props.item.enabled === true ? "Yayında"  : "İnceleniyor"}
                </Label>                
            </>
        }

         <Card.Header textAlign='center' style={{ marginBottom: 1, }}>{ props.item.name } </Card.Header>
        <Card.Meta textAlign='center'>
        <Label  size='big' circular color={ glycemicColor(props.item.glycemicindex!) }> { props.item.glycemicindex! } </Label>
        </Card.Meta> 
        <Card.Meta style={{ marginTop: 10, }}>Ekleyen Kullanıcı: { props.item.createdBy === null ? 'user@mail.com' :  props.item.createdBy }</Card.Meta>
        <Card.Meta>Eklendiği Tarih: { date.toLocaleDateString() }</Card.Meta>
        <Card.Meta>Eklenen Kategori: { categories[props.item.cid!].text }</Card.Meta>
        <Card.Meta style={{overflow:'hidden',}}>Kaynak: { props.item.source }</Card.Meta>

       
        </Card.Content>
        <Card.Content extra>
        <div className='ui two buttons'>
        
            { props.isAdmin && 
                <>
                    <Button basic color='green' onClick={()=> fncPush() } >
                    <Icon name='arrow circle right'/>   Onayla
                    </Button>
                    
                    <Button basic color='red' onClick={()=> deleteItem() }>
                    <Icon font-family name='delete'/>Sil
                    </Button>
                </>
            }

        </div>
        </Card.Content>
    </Card>
    </Grid.Column>
  );
}