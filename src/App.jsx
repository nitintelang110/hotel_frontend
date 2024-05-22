

import Aos from "aos";
import "aos/dist/aos.css"
import './App.css'
import {Routes,Route} from "react-router-dom"
import toast, { Toaster } from 'react-hot-toast';
import Sucess from './components/Sucess';
import Cancel from './components/Cancel';
import Headers from './components/Headers';
import Home from './components/Home';
import CartDetails from './components/CartDetails';
import { useEffect } from "react";
import {Navbar} from "./components/Navbar";
import {Items} from "./components/Items";

function App() {
 

  useEffect(()=>{
    Aos.init()
  }, [])
  
  return (
    <>
      
      <Headers />
   
      <Routes>
         
         <Route  path='/' element={<Navbar/>}>
          <Route  path='/' element={<Home />}/>
          <Route path='/cart' element={<CartDetails />} />
          <Route path='/items' element={<Items/>} />
          <Route  path='/sucess' element={<Sucess />}/>
          <Route path='/cancel' element={<Cancel />} />
        </Route>
        
     </Routes>
     <Toaster />
    </>
  )
}

export default App

