import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {getUserEnrolledCources} from '../../../services/operations/profileApi'
import {ProgressBar} from '@ramonak/react-progress-bar'

const EnrolledCources = () => {

    const {token}=useSelector((state)=>state.auth)
    const [enrolledCources,setEnrolledCources]=useState(null)

    const getEnrolledCources=async()=>{
        try {
            const response=await getUserEnrolledCources(token)
            console.log(response)
            setEnrolledCources(response)
        } catch (error) {
            console.log("unable to fetch enrolled cources")
        }
    }
    useEffect(()=>{
        getEnrolledCources();
    },[])
    
  return (
    <div>

        <h2>Enrolled Cources</h2>

        {
            !enrolledCources?(
                <div>Loading...</div>
            ):!enrolledCources.length?(
                <div>You Have not Enrolled in any cource yet</div>
            ):(
                <div>
                    <div>
                        <p>Cource Name</p>
                        <p>Durations</p>
                        <p>Progress</p>
                    </div>
                    {/* Cards */}
                    {
                        enrolledCources.map((cource,index)=>{
                            <div key={index}>
                                <div>
                                    <img src={cource.thumbnail}/>
                                    <div>
                                        <p>{cource.courceName}</p>
                                        <p>{cource.courceDescription}</p>
                                    </div>
                                </div>
                                <div>
                                    {cource.totalDuration}
                                </div>

                                <div>
                                    <p>Progress: {cource.progressPercentage||0}</p>
                                    <ProgressBar
                                    completed={cource.progressPercentage||0}
                                    height='8px'
                                    isLableVisible={false}
                                    />
                                </div>
                                

                            </div>
                        })
                    }
                </div>
            )
        }
        
    </div>
  )
}

export default EnrolledCources