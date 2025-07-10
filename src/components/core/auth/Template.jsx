import React from 'react'
import HighlightText from '../HomePage/HighlightText'
import frameImg from '../../../assets/Images/frame.png'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
const Template = ({title,desc1,desc2,image,formType,setLogin}) => {
  return (
    <div className='flex justify-evenly w-10/12 mx-auto text-white mt-10'>
        <div className='flex flex-col gap-4 max-w-[450px]'>
            <h2 className='text-3xl font-bold'>{title}</h2>
           <div>
           <p className='font-medium text-[20px] text-richblack-300'>{desc1}</p>
           <HighlightText text={desc2}/>
           {
            formType==='Login'?<LoginForm/>:<SignupForm/>
           }

           </div>
        </div>
        <div className='relative max-w-[450px]'>
            <img src={image} className='z-20 relative'/>
            <img className='absolute top-3 -right-3 z-10' src={frameImg}/>
        </div>
    </div>
  )
}

export default Template