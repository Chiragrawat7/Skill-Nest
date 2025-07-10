import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {ReactStars} from "react-rating-stars-component";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { removeFromCart } from '../../../slices/cartSlice';

const RenderCartCources = () => {
    const {cart}=useSelector((state)=>state.cart);
  const dispatch=useDispatch();
  return (
    <div>
        {
            cart.map((cource,index)=>(
              <div
              key={index}
              >
                <div>
                  <img src={cource?.thumbnail}/>
                  <div>
                    <p>{cource?.courceName}</p>
                    <p>{cource?.category?.name}</p>
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
                      <span>{cource?.ratinAndReviews?.length} Ratingz</span>
                    </div>
                  </div>
                  <div>
                    <button
                    onClick={()=>{dispatch(removeFromCart(cource._id))}}
                    ><MdDelete /> <span>Remove</span></button>
                    <p>Rs {cource?.price}</p>
                  </div>
                </div>
              </div>
            ))

        }
    </div>
  )
}

export default RenderCartCources