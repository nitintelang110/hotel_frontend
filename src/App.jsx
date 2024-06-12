

import Aos from "aos";
import "aos/dist/aos.css"
import './App.css'
import {Routes,Route} from "react-router-dom"
import toast, { Toaster } from 'react-hot-toast';
import Sucess from './components/Sucess';
import Cancel from './components/Cancel';
//import Headers from './components/Headers';
import Home from './components/Home';
import CartDetails from './components/CartDetails';
import { useEffect } from "react";
//import {Navbar} from "./components/Navbar";
import {Items} from "./components/Items";
import {Userlogin} from "./components/Userlogin";


function App() {
 

  useEffect(()=>{
    Aos.init()
  }, [])
  
  return (
    <>
      
  
   
      <Routes>
        
          <Route  path='/' element={<Userlogin/>}/>
        
          <Route  path='/home' element={<Home />}>
          <Route path='/home/cart' element={<CartDetails />} />
          <Route path='/home/items' element={<Items/>} />
          <Route  path='/home/sucess' element={<Sucess />}/>
          <Route path='/home/cancel' element={<Cancel />} />
          </Route>
        
      </Routes>
     <Toaster />
    </>
  )
}

export default App

