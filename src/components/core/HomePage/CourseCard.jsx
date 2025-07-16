import React from 'react'

const courseCard = ({cardData,currentCard,setcurrentCard}) => {
  function clickHandler(cardData){
    setcurrentCard(cardData.heading)
  }
  return (
    <div className={` flex flex-col gap-3 w-[350px] relative translate-y-[50%] px-3 py-2 ${currentCard===cardData.heading?'bg-white text-black shadow-[12px_12px_0px] shadow-[#FFD60A]':'bg-richblack-700 text-richblue-5'}`}
    onClick={()=>clickHandler(cardData)}
    >

      <div className='font-bold mt-2'>{cardData.heading}</div>
      <div className={`text-sm mb-5  ${currentCard===cardData.heading?'text-richblack-600':'text-richblack-100'}`}>{cardData.description}</div>
      <div className='flex justify-between text-richblack-200 mx-1'>
        <div className=' font-bold'>{cardData.level}</div>
        <div>{cardData.lessionNumber}</div>
      </div>

    </div>
  )
}

export default courseCard
