import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {ReactStars} from "react-rating-stars-component";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { removeFromCart } from '../../../slices/cartSlice';

const RenderCartcourses = () => {
    const {cart}=useSelector((state)=>state.cart);
  const dispatch=useDispatch();
  return (
    <div>
        {
            cart.map((course,index)=>(
              <div
              key={index}
              >
                <div>
                  <img src={course?.thumbnail}/>
                  <div>
                    <p>{course?.courseName}</p>
                    <p>{course?.category?.name}</p>
                    <div>
                      <span>4.8</span>
                      <ReactStars
                      count={5}
                      size={20}
                      edit={false}
                      activeColor='#ffd700'
                      emptyIcon={<FaStar />}
                      fullIcon={<FaStar />}
                      />
                      <span>{course?.ratinAndReviews?.length} Ratingz</span>
                    </div>
                  </div>
                  <div>
                    <button
                    onClick={()=>{dispatch(removeFromCart(course._id))}}
                    ><MdDelete /> <span>Remove</span></button>
                    <p>Rs {course?.price}</p>
                  </div>
                </div>
              </div>
            ))

        }
    </div>
  )
}

export default RenderCartcourses