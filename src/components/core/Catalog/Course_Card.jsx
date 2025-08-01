import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RatingStars from '../../common/RatingStars'
import GetAvgRating from '../../../utils/avgRating'
const Course_Card = ({course,height}) => {

  const [avgReviewCount, setAvgReviewCount] = useState(0)
  
  useEffect(()=>{
    const count=GetAvgRating(course?.ratingAndReviews)
    setAvgReviewCount(count)
  },[course]);
  
  
  return (
    <div className=' mb-4 hover:scale-[1.03] transition-all duration-200 z-50 '>
      <Link to={`/courses/${course._id}`}>
        <div>
          <div className='rounded-lg'>
            <img
              src={course?.thumbNail}
              alt='Course Thumbnail'
              className={`${height} min-h-[300px] w-full rounded-xl object-contain`}
            />
          </div>
          <div className="flex flex-col gap-2 px-1 py-3">
            <p className="text-xl text-richblack-5">{course?.courseName}</p>
            <p className="text-sm text-richblack-50">{course?.instructor?.firstName}{` ${course?.instructor?.lastName}`}</p>
            <div  className="flex items-center gap-2">
              <span className="text-yellow-5" >{avgReviewCount || 0}</span>
              <RatingStars Review_Count={avgReviewCount}/>
              <span className="text-richblack-400">{course?.ratingAndReviews?.length} Ratings</span>
            </div>
            <p className="text-xl text-richblack-5">{course?.price}</p>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Course_Card