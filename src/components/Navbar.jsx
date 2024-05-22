import React,{useState} from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css'
import { Outlet } from 'react-router-dom';
import { Clock } from './Clock';
import axios from 'axios';

export const Navbar = () => {

   const [drop,setDrop] = useState(false)
   const [addNewCounter, setAddNewCounter] = useState(false);
   const [counterName,setCounterName] = useState('');
   const [counterNo,setCounterNo] = useState(0)
   const Navigate = useNavigate();

   const handleDropDown = () =>{
    setDrop(!drop)   
 }

 const handleNewCounter = () =>{
   setDrop(!drop)
   setAddNewCounter(!addNewCounter)
   document.body.style.overflowY = 'hidden';
}

const handleSubmit = async (e) =>{
   e.preventDefault()

   const formData = {
      name:counterName,
      number:counterNo,
      status:"OPEN",
      book_time:"00:00:00"
   }

   try {
      await axios.post('http://localhost:8000/api/counter/add/counter', formData).then((Status) => {
       if (Status) {
         Swal.fire({ position: "center", icon: "success", title: "Submit Successfully!", timer: 1800, showConfirmButton: false });
         Navigate("/");
         setAddNewCounter(addNewCounter);
         setCounterName('');
         setCounterNo();
         location.reload()
       }
     })
     
   } catch (error) {
     console.error('Error while sending data:', error);
   }

}
  return (
   <>
 {addNewCounter && 
        <div className={styles.modal_container}>
       
          <div className=" d-flex flex-column shadow" id={styles.modal} data-aos="zoom-in">
               <div className='text-right h5 ' onClick={()=>setAddNewCounter(!addNewCounter)}><i class="bi bi-x-circle"></i></div>
         <div className=''>Counter Name</div>
         <input type="text" className="form-control"  name='counterName' value={counterName} onChange={(e)=>setCounterName(e.target.value)} required />
        <div className='mt-3'>Counter No</div>
        <input type='number' className="form-control" name='counterNo' value={counterNo} onChange={(e)=>setCounterNo(e.target.value)} required />
      
        <button type="submit" className="btn btn-info rounded-0 mt-4" onClick={handleSubmit}>SUBMIT</button>
      </div>
  </div>

        }
        

   <div className={styles.container}>

   <ul className={styles.listcontainer}>
              
    <li>
        <NavLink to="/" className='text-decoration-none  text-dark px-0 align-middle '>HOME</NavLink>  
     </li>
     <li>
        <NavLink to="/items" className='text-decoration-none  text-dark px-0 align-middle'>Menu Item</NavLink>  
     </li>

     <li>
     <NavLink onMouseEnter={()=>handleDropDown()} className='text-decoration-none  text-dark px-0 align-middle'>Counter</NavLink> 
     {drop &&  <div className={styles.drop_list_container} onMouseLeave={()=>handleDropDown()} >
      <li onClick={handleNewCounter} >Add New Counter</li>
      </div>}
     </li>


     <li>
        <NavLink to="/" className='text-decoration-none  text-dark px-0 align-middle'>Report</NavLink>  
     </li>


     <li>
        <NavLink to="/" className='text-decoration-none  text-dark px-0 align-middle'>Hotel Profile</NavLink>  
     </li>


     <li>
        <NavLink to="/" className='text-decoration-none  text-dark px-0 align-middle'>Contact Us</NavLink>  
     </li>
 </ul>
 
 <div>{<Clock/>}</div>
</div>

<Outlet/>


   </>
    
  )
}


