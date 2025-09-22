import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';

const VideoDetailsSidebar = ({setReviewModal}) => {
    const [activeStatus, setActiveStatus] = useState("")
    const [videoBarActive, setVideoBarActive] = useState("");
    const location=useLocation();
    const navigate=useNavigate();
    const {sectionId,subSectionId}=useParams();
    const{
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures
    }=useSelector((state)=>state.viewCourseSlice);

    useEffect(()=>{
        ;(()=>{
            if(!courseSectionData.length)
                return;
            const currentSectionIndex=courseSectionData.findIndex(
                (data)=>data._id===sectionId
            )
            const currentSubSectionIndex=courseSectionData?.[currentSectionIndex]?.subSections.findIndex(
                (data)=>data._id===subSectionId
            )
            const activeSubSectionId=courseSectionData[currentSectionIndex]?.subSections[currentSubSectionIndex]?._id;
            setActiveStatus(courseSectionData?.[currentSectionIndex]?._id);
            // set current subSection here
            setVideoBarActive(activeSubSectionId)
        })()
    },[courseSectionData,courseEntireData,location.pathname])
    
  return (
    <div>
        {/* for buttons and headings */}
        <div>
            {/* for buttons */}
            <div>
                <div
                onClick={()=>navigate('/dashboard/enrolled-courses')}
                >
                    Back
                </div>
                <div>
                    <IconBtn
                    text='Add Review'
                    onclick={()=>setReviewModal(true)}
                    />
                </div>
            </div>
            {/* for headings or title */}
            <div>
                <p>{courseEntireData?.courseName}</p>
                <p>{completedLectures.length} / {totalNoOfLectures}</p>
            </div>
        </div>
        {/* for sections and subSections */}
        <div>
            {
                courseSectionData.map((section,index)=>(
                    <div
                    key={section._id}
                        onClick={()=>setActiveStatus(section?._id)}
                    >
                        {/* Section */}
                        <div>
                            <div>
                                {section?.sectionName}
                            </div>

                            {/* Arrow Icon */}

                        </div>

                        {/* subSections */}
                        <div>
                            {
                                activeStatus===section?._id && (
                                    <div>
                                        {section.subSections.map((topic,index)=>(
                                            <div
                                                onClick={()=>{
                                                    navigate(`/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`)
                                                    setVideoBarActive(topic._id);
                                                }}
                                                key={topic._id}
                                                className={`${videoBarActive===topic._id?"bg-yellow-200 text-richblack-200":"bg-richblack-900 text-white"} flex gap-5 p-5`}
                                            >
                                                <input
                                                type='checkbox'
                                                checked={completedLectures.includes(topic._id)}
                                                onChange={()=>{}}
                                                />
                                                <span>{topic.title}</span>

                                            </div>
                                        ))}
                                    </div>
                                )
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

export default VideoDetailsSidebar