import React from 'react'
import { useSelector } from 'react-redux'
import IconBtn from '../../common/IconBtn'

const RenderTotalAmount = () => {
  const {total,cart}=useSelector((state)=>state.cart)
  const handleBuycourse=()=>{
    const courses=cart.map((course)=>course._id)
    console.log("BOught courses",courses)
    // TODO: API integrate
  }
  return (
    <div>
        <p>Total:</p>
        <p>Rs {total}</p>
        <IconBtn
        text='Buy Now'
        onclick={handleBuycourse}
        customClasses={'w-full justify-center'}
        />
    </div>
  )
}

export default RenderTotalAmount