import { combineReducers, createStore } from "redux"
import { FoodReducer } from "./reducers/FoodReducer";

export type StateType = ReturnType<typeof combine>;

const combine = combineReducers({
    FoodReducer,
    
})

export const store = createStore(combine)