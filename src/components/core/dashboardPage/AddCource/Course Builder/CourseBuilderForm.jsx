import React, { useState } from 'react'
import {useForm} from 'react-hook-form'
import IconBtn from '../../../../common/IconBtn';
import { IoIosAddCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { IoIosArrowForward } from "react-icons/io";
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';
import { createSection, updateSection } from '../../../../../services/operations/courseDetailsApi';
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
    if(course.courseContent.some((section)=>section.subSection.length===0)){
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
    <div className='text-3xl'>
      <p>Course Builder</p>
      <form
      onSubmit={handleSubmit(onSubmitForm)}
      >
        <div>
          <label htmlFor='sectionName'>Section Name <sup>*</sup></label>
          <input
            id='sectionName'
            placeholder='Add Section Name'
            {...register('sectionName',{required:true})}
            className='w-full'
          />
          {
            errors.sectionName&&(
              <span>Section Name is Requires</span>
            )
          }
        </div>
        <div className='mt-10 flex justify-between'>
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
     <div className='flex justify-end gap-x-3'>
      <button onClick={goBack}
        className='rounded-md cursor-pointer flex items-center'>
        Back
      </button>
      <IconBtn text={'Next'} onclick={gotoNext}><IoIosArrowForward /></IconBtn>

     </div>
    </div>
  )
}

export default CourseBuilderForm