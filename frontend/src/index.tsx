import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import 'semantic-ui-css/semantic.min.css'
import {BrowserRouter as Router,Routes, Route} from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';

//import pages
import Home from './Home'
import FoodsAdd from './FoodsAdd';
import Details from './Details';
import AdminWaitFoodList from './AdminWaitFoodList';
import FoodsList from './FoodsList';


//redux
import { store } from './ReduxStore';
import { Provider } from 'react-redux';


//Router
const router =
<Provider store={store}>
<Router>
  <Routes>
    <Route path='/' element={<Home/>}/>
    <Route path='/foodsAdd' element={<FoodsAdd/>}/>  
    <Route path='/details/:url' element={ <Details/> } />
    <Route path='/foodsList' element={ <FoodsList/> } />
    <Route path='/waitFoodsList' element={ <AdminWaitFoodList/> } />   
  </Routes>
</Router>
</Provider>
ReactDOM.render(router ,
  document.getElementById('root')
);


reportWebVitals();
