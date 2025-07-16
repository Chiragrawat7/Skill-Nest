import React from 'react'
import { useSelector } from 'react-redux'
import RenderCartcourses from './RenderCartcourses'
import RenderTotalAmount from './RenderTotalAmount'

const index = () => {

    const {total,totalItems}=useSelector((state)=>state.cart)
    
  return (
    <div>
        <h2>Your Cart</h2>
        <p>{totalItems} courses in Cart</p>
        {
            total>0?(
                <div>
                    <RenderCartcourses/>
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