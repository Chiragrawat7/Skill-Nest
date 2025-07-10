import React from 'react'
import loginImg from '../assets/Images/login.webp'
import Template from '../components/core/auth/Template'
const Login = () => {
  return (
    <Template
    title="Welcome Back"
    desc1="Build skills for today, tomorrow, and beyond."
    desc2="Education to future-proof your career."
    image={loginImg}
    formType="Login"
    // setLogin={setLogin}
    />
  )
}

export default Login