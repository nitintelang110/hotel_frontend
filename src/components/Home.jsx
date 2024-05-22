import React, { useState,useEffect } from 'react'
import "./style.css"
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { addToCart } from '../redux/features/cartSlice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import CartDetails from './CartDetails';
import axios from 'axios';
import moment from 'moment'


const Home = () => {
 
    const [booked, setBooked] = useState('BOOK');
    const [opened, setOpened] = useState('OPEN');
  const [counterStatus, setCounterStatus] = useState([]);
  const [menuItem, setMenuItem] = useState();
  const [menuCartItem, setMenuCartItem] = useState(false);
  const [searchName,setSearchName] = useState(''); 
  const [searchCategory, setSearchCategory] = useState('');
  const [menuCart,setMenuCart] = useState([])
  const [counterId,setCounterId] = useState()
  const [menuCartPlease, setMenuCartPlease] = useState();
  const [orderDetails,setOrderDetails]  = useState([]);
 
  console.log(orderDetails)

    const dispatch = useDispatch();
    
  const timer = moment().format('LTS');
    
    // add to cart 
    const send = (e)=>{
       dispatch(addToCart(e))
       toast.success("Item added In Your Cart")
    }


      useEffect(()=>{

    axios.get("http://localhost:8000/api/counter/get/counter").then(result => {
    
       
    if (result.data.Status) {

      setCounterStatus((result.data.Result))
    }else{
      alert(result.data.Error)
    }

    }).catch(err => console.log(err))
        

    axios.get("http://localhost:8000/api/item/get/item").then(result => {
    
    if (result.data.Status) {

      setMenuItem((result.data.Result))
    }else{
      alert(result.data.Error)
    }

  }).catch(err => console.log(err))      
        

    axios.get("http://localhost:8000/api/counter/orderDetails/counter/"+menuCartPlease).then(result => {
      
    if (result.data.Status) {

      setOrderDetails((result.data.Result))
    }else{
      alert(result.data.Error)
    }

    }).catch(err => console.log(err))
        
        
},[menuCartPlease])


    
    const handleSubmit = (e, id) => {
     
        const data ={status:booked, book_time:timer}
    e.preventDefault();
    axios.put("http://localhost:8000/api/counter/book/counter/"+id, data)
      .then(result => {
        if (result) {
         Swal.fire({ position: "middle", icon: "success", title: "Booked!", timer: 1800, showConfirmButton: false });
      }
      location.reload()
    })
    .catch(err=>{console.log(err)})
  }
   
    
    const handleSubmit2 = (e, id) => {
        const data ={status:opened,book_time:timer}
    e.preventDefault();
    axios.put("http://localhost:8000/api/counter/book/counter/"+id, data)
      .then(result => {
        if (result) {
         Swal.fire({ position: "middle", icon: "success", title: "Available To Book!", timer: 1800, showConfirmButton: false });
        } 
        location.reload()
    })
    .catch(err=>{console.log(err)})
    
    }
  
   
  const handleSubmit3 = (e) => {

    const data = {
      menuCart
    }
      setMenuCartItem(!menuCartItem)
      send(orderDetails)
    e.preventDefault();
    axios.post("http://localhost:8000/api/counter/addOrderMenu/counter", data)
      .then(result => {
        if (result) {
          toast.success("Item added In Your Cart");
        } else {
          console.log(Error)
        } 
        location.reload()
    })
    .catch(err=>{console.log(err)})
    
    }
  
  const handleSubmit4 = (e) => {
    const data = {
       ok:"ok"
     }
    e.preventDefault();
    axios.post("http://localhost:8000/api/counter/moveCompleteOrderMenu/counter",data)
      .then(result => {
        if (result) {
          toast.success("Item added In Your Cart");
        } else {
          console.log(Error)
        } 
        location.reload()
    })
    .catch(err=>{console.log(err)})
    
    }
  

  
   
  const handleDelete = (id) => {
     
    axios.delete("http://localhost:8000/api/counter/delete/counter/"+id).then(result => {
      if (result.data.Status) {
     
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
              location.reload()
          }
        });

      
      
      } else {
        alert(result.data.Error)
      }
    }
    )
    
    
  }
  
  const menuItemModal = (id) => {
    setCounterId(id)
    setMenuCartItem(!menuCartItem)
     document.body.style.overflowY = 'hidden';
  }



  const handleCheckboxChange = (item,price) => {
    
    menuCart.push({counterId:counterId,item:item,price:price,check:1})

  };
     
  const handleSubmits = (e,id) => {
    handleSubmit2(e, id)
    handleSubmit4
  }
 
    return (
      <>
        {menuCartItem && 
          <div className="modal_container">
       
          <div className=" d-flex flex-column shadow" id="modal" data-aos="zoom-in">
          <div className='text-right h5 ' onClick={()=>setMenuCartItem(!menuCartItem)}><i class="bi bi-x-circle"></i></div>
        
              <div>
                
    {menuItem.filter((data)=> searchName === ""? data : data.item.includes(`${searchName.toUpperCase()}`)).filter((data)=> searchCategory === ""? data : data.category === `${searchCategory}`).map((c,id)=>{
  return(<>
    
    <div  className="d-flex w-25 " >
 
      <label   className='border border-dark rounded p-1 ' >
      
        <input
          type="checkBox"
          checked={menuCart.check_status == 1?checked:''}
          onChange={()=>handleCheckboxChange(c.item,c.price)}
          value={c.item} className=' mt-1 '
          key={id}
        //  onClick={()=>send(orderDetails)}
        />
        &nbsp;{c.item}
      </label>
</div>
</>
)
})}
                {/* <table className=' w-75 mx-2 mt-3'>
              <thead>
                <tr id="tbl_head_row">
                </tr>
              </thead>
              <tbody>
{menuItem.filter((data)=> searchName === ""? data : data.item.includes(`${searchName.toUpperCase()}`)).filter((data)=> searchCategory === ""? data : data.category === `${searchCategory}`).map((c,id)=>{
  return(<>
<tr key={id}>
  <td className="border-1" >
  {c.item}
      </td>
</tr>
</>
)
})}
              </tbody>
                      </table>   */ } 
                

              </div>
        <button type="submit" className="btn btn-info rounded-0 mt-4" onClick={handleSubmit3}>SUBMIT</button>
      </div>
  </div>
      
      }
        
        <div className='d-flex flex-row col-md-11 iteam_section mb-5 bg-light '>
            <section className=' mt-4 col-md-7'>
                <h4 className='px-4 mb-4 col-md-12' style={{ fontWeight: 400}}>Counter Tables</h4>
                <div className='row mt-2 mx-3 d-flex justify-content-around align-items-center'>
                    {
                        counterStatus.map((element, index) => {
                            return (
                                <>
                                    {element.counter_status == 'BOOK' ? 
                                  
                                 <Card style={{ width: "13rem",height: "15rem", border: "none",backgroundColor:"pink" }} className='hove mb-4'  >
                                    

                                        <div className="card_body" key={index}>
                                            <div className="upper_data d-flex justify-content-between align-items-center">
                                                <h4 className='mt-3' >{element.counter_name}</h4>
                                               
                                                <span className='bg-danger mt-2' onClick={()=>setMenuCartPlease(element.counter_no)}>{element.counter_no }</span>
                                            </div>
                                         
                                      <div className="extra"></div>
                                      

                                              <h5 className='text-center pt-2'>BOOKED</h5>
                                            <div className="lower_data d-flex flex-column  align-items-center justify-content-center   ">
                                          

                                                <Button style={{ width: "100px",fontWeight: '700', border: "none",backgroundColor:'brown',borderRadius:'100%'}} variant='outline-light'
                                                    className='mt-3 mb-4 text-light'
                                                    onClick={(e)=>handleSubmits(e,element.id)}
                                                    >REOPEN</Button>
                                                    <div style={{ width: "140px", border: "none",fontWeight:"700" }} variant='outline-light'
                                                    className='ml-5 text-dark'>{element.book_time}</div>
                                                  
                                                
                                            </div>

                                            <div className="extra"></div>

                                            <div className="last_data d-flex justify-content-between align-items-center ">
                                          

                                        <Button style={{ width: "350px", border: "none", fontWeight: "700" }} 
                                         
                                                    className='mt-2 text-dark'
                                          onClick={()=>menuItemModal(element.id)}
                                          id='add_item2'
                                                >Add Item To Bill</Button>
                                             

                                            </div>
                                        </div>
                                        </Card>
                                        
                                        :


                                          <Card style={{ width: "13rem",height: "15rem", border: "none",backgroundColor:"#b0ebb4" }} className='hove mb-4'>
                                      {/* <Card.Img variant='top' className='cd' src={element.imgdata}/>*/}

                                        <div className="card_body" key={index}>
                                      
                                       <div className="upper_data d-flex justify-content-between align-items-center">
                                                <h4 className='mt-3'>{element.counter_name}</h4>
                                                {/*<span>{element.rating}&nbsp;★</span> */}  
                                        <span className='mt-2'>{element.counter_no}</span>
                                        <span className='mt-2 bg-info' onClick={()=>handleDelete(element.id)}><i class="bi bi-three-dots-vertical"></i></span>
                                      </div>
                                      
                                      
                                            <div className="extra mb-2"></div>

                                            <div className="lower_data d-flex flex-column  align-items-center justify-content-center   ">
                                               {/* <h5>{element.address}</h5> 
                                                <span>₹ {element.price}</span>*/} 
                                                <Button style={{ width: "100px",fontWeight: '700', border: "none",backgroundColor:'green',borderRadius:'100%'}} variant='outline-light'
                                                    className='mt-5 mb-4 text-light'
                                                    onClick={(e)=>handleSubmit(e,element.id)}
                                        >OPEN</Button>
                                                    { /*<img src={element.delimg} className='laimg mb-4' alt="" style={{ width: "80px", height: "25px", border: "none" }} /> */}
                                                
                                            </div>
                                              <div style={{ width: "140px", border: "none",fontWeight:"700" }} variant='outline-light'
                                                    className='ml-5 text-dark'>{element.book_time}</div>
                                            <div className="extra"></div>

                                            <div className="last_data d-flex justify-content-between align-items-center ">
                                    

                                                <Button style={{ width: "100%", border: "none" }} 
                                                    className='mt-2 text-dark '
                                                    onClick={(e)=>handleSubmit(e,element.id)} id='add_item'
                                                >Ready To Book</Button>
                                             

                                            </div>
                                        </div>
                                        </Card>


                                        


                                          }
                                </>
                            )
                        })
                    }

                </div>
            </section>

                <section className='mt-4 col-md-5 '>
                  
                    <CartDetails orderDetails={orderDetails}/>
                    
            </section>
        </div>
        </>
        
    )
}

export default Home