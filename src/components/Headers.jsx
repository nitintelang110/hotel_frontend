import React from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

export const Headers = () => {
const {carts} = useSelector((state)=>state.allCart);


    return (
        <>
            <Navbar style={{ width: "100%",height: "60px", background: "#000066", color: "white", }}>
                <Container className="col-md-12 px-5">
                <NavLink to="/" className="text-decoration-none text-light ">
                    <h4 className='text-light'>Hotel Billing System</h4>
                    </NavLink>
                    
              <h5 className='text-light'>Hotel Name</h5>

                  {/*  <NavLink to="/cart" className="text-decoration-none text-light mx-2">
                    <div id='ex4'>
                        <span className='p1 fa-stack fa-2x has-badge' data-count={carts.length}>
                            <i class="bi bi-cart"></i>
                        </span>
                    </div>
                    </NavLink>*/}
<div className='d-flex flex-column'>
    <div>Mr. Admin Admin</div>
    <NavLink to="/cart" className="text-white mx-5">            
    <i class="bi bi-power"></i>
    </NavLink>
</div>
                    
                   
                </Container>
            </Navbar>
        </>
    )
}

