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
    <Grid.Column  mobile={8} tablet={8} computer={4} >
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
                <Label as='a' color={ props.item.enabled === true ? 'blue'  : 'red' } ribbon>
                    { props.item.enabled === true ? "Yayında"  : "İnceleniyor"}
                </Label>
                <Card.Header> { props.item.name } </Card.Header>
            </>
        }

        { !props.status && <Card.Header> { props.item.name } </Card.Header> }
        <Label size='big' circular  style={{ marginTop: 10, }} color={ glycemicColor(props.item.glycemicindex!) }> { props.item.glycemicindex! } </Label>
        <Card.Description>
        <Card.Meta>{ props.item.createdBy === null ? 'user@mail.com' :  props.item.createdBy }</Card.Meta>
        <Card.Meta>{ date.toLocaleDateString() }</Card.Meta>
        <Card.Meta>{ categories[props.item.cid!].text }</Card.Meta>

        </Card.Description>
        </Card.Content>
        <Card.Content extra>
        <div className='ui two buttons'>
        
            { props.isAdmin && 
                <>
                    <Button  basic color='green' onClick={()=> fncPush() } >
                    <Icon name='info'/>Yayınla
                    </Button>
                    
                    <Button basic color='red' onClick={()=> deleteItem() }>
                    <Icon name='delete'/>Sil
                    </Button>
                </>
            }

        </div>
        </Card.Content>
    </Card>
    </Grid.Column>
  );
}