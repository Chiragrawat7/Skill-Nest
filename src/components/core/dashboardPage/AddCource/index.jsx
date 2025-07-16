import React from 'react'
import RenderSteps from './RenderSteps'

const index = () => {
  return (
    <>
    <div className='text-white'>
        <div>
            <h2>Add course</h2>
            <div>
                <RenderSteps/>
            </div>
            <div>
                <p>Code Upload Tips</p>
                <ul>
                    <li>Set the Course Price option or make it free.</li>
                    <li>Standard size for the course thumbnail is 1024x576.</li>
                    <li>Course Builder is where you create and organize a course.</li>
                    <li>Add Topics in the Course Builder section to create lessons, quizzes, and assignments.</li>
                    <li>Information from the Additional Data section shows up on the course single page.</li>
                    <li>Make Announcements to notify any important.</li>
                    <li>Notes to all enrolled students at once.</li>
                </ul>
            </div>
        </div>
    </div>
    </>
  )
}

export default index