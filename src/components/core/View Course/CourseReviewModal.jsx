import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import ReactStars from "react-rating-stars-component";
import IconBtn from '../../common/IconBtn';
import { createRating } from '../../../services/operations/courseDetailsApi';
const CourseReviewModal = ({setReviewModal}) => {
    const {user}=useSelector((state)=>state.profile)
    const {token}=useSelector((state)=>state.auth)
    const {courseEntireData}=useSelector((state)=>state.viewCourseSlice)
    const onSubmit=async(data)=>{
        await createRating(
            {
                courseId:courseEntireData._id,
                rating:data.courseRating,
                review:data.courseExperience
            },
            token
        )
    }
    const {
        register,
        handleSubmit,
        setValue,
        formState:{errors},
    }=useForm();
    useEffect(()=>{
        setValue("courseExperience","")
        setValue("courseRating",0);
    },[])
    const ratingChange=(newRating)=>{
        setValue("courseRating",newRating)
    }
  return (
    <div>
        <div>
            {/* Modal Header */}
            <div>
                <p>Add Review</p>
                <button
                    onClick={()=>setReviewModal(false)}
                >Close</button>
            </div>
            {/* Modal Body */}
            <div>
                <div>
                    <img
                        src={user?.image}
                        alt='User Image'
                        className='aspect-square w-[50px] rounded-full object-cover'
                    />
                    <div>
                        <p>{user.firstName} {user?.secondName}</p>
                        <p>Posting Publically</p>
                    </div>
                </div>
                <form
                onSubmit={handleSubmit(onSubmit)}
                className='flex mt-6 flex-col items-center'
                >
                    <ReactStars
                        count={5}
                        onChange={ratingChange}
                        size={24}
                        activeColor="#ffd700"
                    />
                    <div>
                        <label>
                            Add Your Experience *
                        </label>
                        <textarea
                        id='courseExperience'
                        plcaholder="Add Your Experience Here"
                        className='form-style w-full'
                        {...register("courseExperience",{required:true})}
                        />
                        {
                            errors.courseExperience&&(
                                <span>Please Add Your Experience</span>
                            )
                        }
                    </div>

                    <div>
                        {/* cancel and save button */}
                        <button
                            onClick={()=>setReviewModal(false)}
                        >Cancel</button>
                        <IconBtn
                        text="Save"
                        />
                    </div>

                </form>
            </div>
        </div>
    </div>
  )
}

export default CourseReviewModal