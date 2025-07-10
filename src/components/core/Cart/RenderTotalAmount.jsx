import React from 'react'
import { useSelector } from 'react-redux'
import IconBtn from '../../common/IconBtn'

const RenderTotalAmount = () => {
  const {total,cart}=useSelector((state)=>state.cart)
  const handleBuyCource=()=>{
    const Cources=cart.map((Cource)=>Cource._id)
    console.log("BOught Cources",Cources)
    // TODO: API integrate
  }
  return (
    <div>
        <p>Total:</p>
        <p>Rs {total}</p>
        <IconBtn
        text='Buy Now'
        onclick={handleBuyCource}
        customClasses={'w-full justify-center'}
        />
    </div>
  )
}

export default RenderTotalAmount