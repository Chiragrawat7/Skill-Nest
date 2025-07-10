import React from 'react'
import { useSelector } from 'react-redux'
import RenderCartCources from './RenderCartCources'
import RenderTotalAmount from './RenderTotalAmount'

const index = () => {

    const {total,totalItems}=useSelector((state)=>state.cart)
    
  return (
    <div>
        <h2>Your Cart</h2>
        <p>{totalItems} Cources in Cart</p>
        {
            total>0?(
                <div>
                    <RenderCartCources/>
                    <RenderTotalAmount/>
                </div>
            ):(
                <p>Your Cart is Empty</p>
            )
        }
    </div>
  )
}

export default index