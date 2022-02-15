
import { ResultFoods } from "../models/IFood";
import { FoodType } from "../types/FoodType";

export interface ReduxFoods {   
    gid?:           number;
    cid?:           number;
    name?:          string;
    glycemicindex?: number;
    image?:         string;
    number?:        number;
}
const FoodData:ReduxFoods[] = []
export interface IFoodAction{
    type: FoodType,
    payload: ReduxFoods,    
}
 
export function FoodReducer ( state: ReduxFoods[] = FoodData , action: IFoodAction){
    switch (action.type) {
        case FoodType.PRODUCT_LIST:
            return state
            
        case FoodType.PRODUCT_ADD:
            //state.push(action.payload) ile aynı
            return [ ...state,action.payload ]
            
            
        case FoodType.PRODUCT_DELETE:
            const index = state.findIndex( item => item.gid === action.payload.gid)
            state.splice(index, 1)
            return [...state]
            
        case FoodType.PRODUCT_UPDATE:
            const uindex = state.findIndex( item => item.gid === action.payload.gid)
            state[uindex] = action.payload
            return [...state]
        default:
            return state
    }
    
}