import React, { useEffect,useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import RenderSteps from '../AddCource/RenderSteps'
import { getFullDetailsOfCourse } from '../../../../services/operations/courseDetailsAPI';
import { setCourse, setEditCourse } from '../../../../slices/courseSlice';
const index = () => {
    const dispatch=useDispatch();
    const {courseId}=useParams()
    const {course}=useSelector((state)=>state.course)
    const {token}=useSelector((state)=>state.auth)
    const [loading, setLoading] = useState(false)

  useEffect(()=>{
    const populateCourseDetails=async()=>{
      setLoading(true);
      const result=await getFullDetailsOfCourse(courseId,token)
      if(result){
        dispatch(setEditCourse(true));
        dispatch(setCourse(result?.courseDetails))
      }
      setLoading(false);
    }
    populateCourseDetails();
  },[])
    if(loading){
      return <div>Loading...</div>
    }
    
    
    
  return (
    <div className='text-white'>
      <h2>Edit Course</h2>
      <div>
        {
          course?(<RenderSteps/>):(<p>Course Not  Found</p>)
        }
      </div>
    </div>
  )
}

export default index
