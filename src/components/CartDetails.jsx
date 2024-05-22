import React, { useEffect, useState } from 'react'
import "./cartstyle.css"
import { useDispatch, useSelector } from 'react-redux';
import { addToCart,removeToCart ,removeSingleIteams,emptycartIteam} from '../redux/features/cartSlice';
import toast from 'react-hot-toast';
//import {loadStripe} from '@stripe/stripe-js';
//import { loadStripe } from '@stripe/stripe-js';


const CartDetails = ({orderDetails,sendToParent}) => {

    const {carts} = useSelector((state)=>state.allCart);
    
  
   


    const [totalprice,setPrice] = useState(0);
    const [totalquantity,setTotalQuantity] = useState(0);

    const dispatch = useDispatch();

    // add to cart
    const handleIncrement = ()=>{
        //dispatch(addToCart(e))
        setTotalQuantity(totalquantity+1)
        sendToParent(totalquantity)
    }

    // remove to cart
    const handleDecrement = (e)=>{
        dispatch(removeToCart(e));
        toast.success("Item Remove From Your Cart")
    }

    // remove single item 
    const handleSingleDecrement = (e)=>{
        dispatch(removeSingleIteams(e))
    }

    // empty cart
    const emptycart = ()=>{
        dispatch(emptycartIteam())
        toast.success("Your Cart is Empty")

    }

    // count total price
    const total = ()=>{
        let totalprice = 0
        orderDetails.map((ele,ind)=>{
            totalprice = ele.price * ele.qty + totalprice
        });
        setPrice(totalprice)
    }  

    
    // count total quantity
    const countquantity = ()=>{
        let totalquantity = 0
        orderDetails.map((ele,ind)=>{
            totalquantity = ele.qty + totalquantity
        });
        setTotalQuantity(totalquantity)
    }  
    
    useEffect(()=>{
        total()
    },[total])

    useEffect(()=>{
        countquantity()
    },[countquantity]);

    // payment integration
    /*const makePayment = async()=>{
        const stripe = await loadStripe("ENTER YOUR PUBLISHABLE KEY");

        const body = {
            products:carts
        }
        const headers = {
            "Content-Type":"application/json"
        }
        const response = await fetch("http://localhost:7000/api/create-checkout-session",{
            method:"POST",
            headers:headers,
            body:JSON.stringify(body)
        });

        const session = await response.json();

        const result = stripe.redirectToCheckout({
            sessionId:session.id
        });
        
        if(result.error){
            console.log(result.error);
        }
    }
*/

    return (
        <>
            <div className='row justify-content-center mt-2'>
                <div className='col-md-11 mt-5 mb-5 cardsdetails'>
                    <div className="card">
                        <div className="card-header p-3" id='card-head'>
                            
                            <div className='card-header-flex'>
                                <h5 className='text-white m-0'>Counter Cart Calculation{orderDetails.length >0 ? `(${orderDetails.length})`:""}</h5>
                                {
                                    orderDetails.length > 0 ? <button className='btn btn-danger mt-0 btn-sm'
                                    onClick={emptycart}
                                    ><i className='fa fa-trash-alt mr-2'></i><span>EmptyCart</span></button>
                                        : ""
                                }
                            </div>

                        </div>
                        <div className="card-body p-0">
                                {
                                    orderDetails.length === 0 ? <table className='table cart-table mb-0'>
                                        <tbody>
                                            <tr>
                                                <td colSpan={6}>
                                                    <div className='cart-empty'>
                                                        <i className='fa fa-shopping-cart'></i>
                                                        <p>Your Cart Is Empty</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table> :
                                    <table className='table cart-table mb-0 table-responsive-sm'>
                                        <thead className='col-md-12'>
                                            <tr>
                                                <th>Sn</th>
                                              {/*<th>Product</th>*/}
                                                <th className='col-md-4'>Item</th>
                                                <th className='col-md-1'>Price</th>
                                                <th  className='col-md-2'>Qty</th>
                                                <th className='text-left col-md-2'> <span id="amount" className='amount'>Total</span></th>
                                                 <th className='mx-4'>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                orderDetails.map((data,index)=>{
                                                    return (
                                                        <>
                                                            <tr>
                                                                <td>
                                                                  {index + 1}
                                                                </td>

                                                               {/* <td><div className='product-img'><img src={data.imgdata} alt="" /></div></td>*/} 

                                                                <td>{data.item}</td>
                                                                <td>{data.price}</td>


                                                                <td>
                                                                    <div className="prdct-qty-container">
                                                                        <button className='prdct-qty-btn' type='button' 
                                                                        onClick={data.qty <=1 ?()=>handleDecrement(data.id) :()=>handleSingleDecrement(data)}
                                                                        >
                                                                            <i className='fa fa-minus'></i>
                                                                        </button>
                                                                        <input type="text" className='qty-input-box' value={data.qty} disabled name="" id="" />
                                                                        <button className='prdct-qty-btn' type='button' onClick={()=>handleIncrement()}>
                                                                            <i className='fa fa-plus'></i>
                                                                        </button>
                                                                    </div>
                                                                </td>

                                                                <td className='text-left'>₹ {data.qty * data.price}</td>

                                                                <td >
                                                                    <button className='prdct-delete'
                                                                    onClick={()=>handleDecrement(data.id)}
                                                                    ><i className='fa fa-trash-alt'></i></button>
                                                                </td>

                                                            </tr>
                                                        </>
                                                    )
                                                })
                                            }
                                        </tbody>

                                      
                                        
                                          <tfoot  className=' col-md-12 '>
                                            <tr className='' id='footer' >

                                                <th></th>
                                              
                                                <th className=''>Item In Cart <span className=''>:&nbsp;&nbsp;</span><span className='text-danger'>{totalquantity}</span></th>
                                                
                                                <th></th>

                                                <th className=''>Total Price<span className=''>:</span><span className='text-danger'>&nbsp;&nbsp; ₹ {totalprice}</span></th>

                                                <th className=''><button className='btn-sm btn-success' onClick={/*makePayment*/''} type='button'>Checkout</button></th>

                                                <th className='text-left '><button className='btn-sm btn-success' onClick={''} type='button'>Print</button></th>
                                                
                                                
                                            </tr>
                                        </tfoot>
                                    </table>
                                
                                
                                }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CartDetails


