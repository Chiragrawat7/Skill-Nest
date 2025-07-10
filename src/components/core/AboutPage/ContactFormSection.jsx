import React from 'react'
import ContactUsForm from '../ContactPage/ContactUsForm'

const ContactFormSection = () => {
  return (
    <div className='flex justify-center items-center flex-col'>
        <h2 className='text-left  text-4xl font-semibold'>Get in Touch</h2>
        <p className='text-center text-richblack-300 mt-3'>We'd love to here for you, Please fill out this form.</p>
        <div className='mt-3'>
            <ContactUsForm/>
        </div>
    </div>
  )
}

export default ContactFormSection