import { createSlice } from "@reduxjs/toolkit";
const initialState={
    signupData:null,
    loading:false,
   token: localStorage.getItem('token') || null,
}

const authSlice=createSlice({
    name:'auth',
    initialState:initialState,
    reducers:{
        setSignupData(state,value){
            state.signupData=value.payload
        },
        setToken(state,value){
            state.token=value.payload
        },
        setLoading(state,value){
            state.loading=value.payload
        }
    },
})
export const{setToken,setSignupData,setLoading}=authSlice.actions
export default authSlice.reducer