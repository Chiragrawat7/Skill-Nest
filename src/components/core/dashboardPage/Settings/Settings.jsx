import React from 'react'
import ChanegeProfilePicture from './ChanegeProfilePicture'
import EditProfile from './EditProfile'
import UpdatePassword from './UpdatePassword'
import DeleteAccount from './DeleteAccount'
const Settings = () => {
  return (
    <div>
      <h2 className='mb-14 text-3xl font-medium text-richblack-5'>Edit Profile</h2>
      <ChanegeProfilePicture/>
      <EditProfile/>
      <UpdatePassword/>
      <DeleteAccount/>
    </div>
  )
}

export default Settings