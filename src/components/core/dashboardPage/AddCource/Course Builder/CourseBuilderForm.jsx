import React, { useState } from 'react'
import {useForm} from 'react-hook-form'
import IconBtn from '../../../../common/IconBtn';
import { IoIosAddCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { IoIosArrowForward } from "react-icons/io";
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';
import { createSection,updateSection } from '../../../../../services/operations/courseDetailsAPI';
import NestedView from './NestedView';

const CourseBuilderForm = () => {

  const {register,handleSubmit,setValue,formState:{errors}}=useForm();
  const [editSectionName, setEditSectionName] = useState(null)
  const {course}=useSelector((state)=>state.course)
  const dispatch=useDispatch();
  const[loading,setLoading]=useState(false)
  const {token}=useSelector((state)=>state.auth)


  const cancelEdit=()=>{
    setEditSectionName(null)
    setValue('sectionName','');
  }
  const goBack=()=>{
    dispatch(setStep(1))
    dispatch(setEditCourse(true));
  }
  const gotoNext=()=>{
    if(course.courseContent.length===0){
      toast.error("Please add atleast 1 Section")
      return;
    }
    console.log("Course Content",course.courseContent)
    if(course.courseContent.some((section)=>section.subSections.length===0)){
       toast.error("Please add atleast 1 Lecture in each Section")
      return;
    }
    dispatch(setStep(3));
  }
  const onSubmitForm=async(data)=>{
    setLoading(true)
    let result;
    if(editSectionName){
      result=await updateSection({
        newSectionName:data.sectionName,
        sectionId:editSectionName,
        courseId:course._id
      },token)
    }
    else{
      result=await createSection({
        sectionName:data.sectionName,
        courseId:course._id, 
      },token)
    }
    // update values
    if(result){
      dispatch(setCourse(result));
      setEditSectionName(null)
      setValue('sectionName',"");
    } 
    setLoading(false)
  }
  const handleChangeEditSectionName=(sectionId,sectionName)=>{
    if(editSectionName===sectionId){
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue('sectionName',sectionName)
  }
  return (
    <div className='space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6'>
      <p className='text-2xl font-semibold text-richblack-5'>Course Builder</p>
      <form
      className='space-y-4'
      onSubmit={handleSubmit(onSubmitForm)}
      >
        <div className='flex flex-col space-y-2'>
          <label htmlFor='sectionName' className='text-sm text-richblack-5'>Section Name <sup className='text-pink-200'>*</sup></label>
          <input
            id='sectionName'
            placeholder='Add Section Name'
            {...register('sectionName',{required:true})}
            className='form-style mt-2 text-white focus:outline-none bg-[#2c333f]  text-base leading-6 rounded-lg p-3 shadow-[0_0_0_#0000,0_0_0_#0000,0_1px_0_0_hsla(0,0%,100%,0.5)] w-full
'
          />
          {
            errors.sectionName&&(
              <span className='ml-2 text-xs tracking-wide text-pink-200'>Section Name is Requires</span>
            )
          }
        </div>
        <div className='flex items-end gap-x-4'>
          <IconBtn
            type='submit'
            text={editSectionName?"Edit Section Name":"Create Section"}
            outline={true}

          >
            <IoIosAddCircleOutline className='text-yellow-200' />
          </IconBtn>
          {
            editSectionName&&(
              <button type='button' onClick={cancelEdit} className='text-sm text-richblack-300 underline'>
                Cancel edit
              </button>
            )
          }
        </div>
      </form>
     {
      course.courseContent.length>0&&(
         <NestedView handleChangeEditSectionName={handleChangeEditSectionName}/>
      )
     }
     {/* Next Previous Button */}
     <div className='flex justify-end gap-x-3'>
      <button onClick={goBack}
        className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}>
        Back
      </button>
      <IconBtn text={'Next'} onclick={gotoNext}><IoIosArrowForward /></IconBtn>

     </div>
    </div>
  )
}

export default CourseBuilderForm