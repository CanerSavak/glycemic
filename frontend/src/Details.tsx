import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Card, Divider, Grid, Header, Icon, Item, Label, Search, Segment } from 'semantic-ui-react'
import SiteMenu from './components/SiteMenu'
import { categories } from './Datas'
import { IFoods, ISingleFood, ResultFoods } from './models/IFood'

import { foodDetails } from './Services'

export default function Details() {

    const [food, setFood] = useState<ResultFoods>()
    const date = new Date(food?.createdDate!);

    const { url } = useParams()
    useEffect(() => {
        foodDetails(url!).then(res => {
            const dt:ISingleFood = res.data;
            setFood(dt.result!)
        }).catch(err => {
            toast.dismiss();
            toast.error("" + err)
        })
    }, [])
    const square = { width: 120, height: 120 }
    
    return (
        <>           
            <SiteMenu />
            <Segment raised>
                <Grid columns={2} stackable textAlign='center'>   
                    <Grid.Row verticalAlign='middle'>
                        <Grid.Column>
                        {food?.image !== "" &&
                            <Item.Image
                                floated='right'
                                size='large'
                                src={food?.image}
                            />
                        }
                         {food?.image === "" &&
                            <Item.Image
                                floated='right'
                                size='tiny'
                                src='./foods.png'
                            />
                        }   
                        </Grid.Column>
                        <Grid.Column>
                        <Header textAlign='center' as='h1' inverted color='green' size='huge'>{food?.name}</Header>
                        <Segment color='red' block secondary  >Glisemik İndeks: {food?.glycemicindex!}</Segment>
                        <Segment color='red' block secondary>Oluşturulan Kişi: {food?.createdBy === null ? 'user@mail.com' : food?.createdBy}</Segment>
                        <Segment color='red' block secondary>Oluşturulma Tarihi: {date.toLocaleDateString()}</Segment>
                        
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
          </Segment>

        </>
    )
}
