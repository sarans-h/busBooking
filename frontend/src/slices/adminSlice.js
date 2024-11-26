import axios from "axios";

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState={
    allUser:[],
    loading:false,
    error:null,
    totalRevenue:0
}
const adminSlice=createSlice({
    name:"admin",
    initialState,
    reducers:{
        getAllUserRequest:(state,action)=>{
            state.loading = true;
        },
        getAllUserSuccess:(state,action)=>{
            state.loading = false;
            state.allUser = action.payload;
            state.error = null;
        },
        getAllUserFailure:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
            state.allUser = [];
        },
        getTotalRevenueRequest:(state,action)=>{
            state.loading = true;
        },
        getTotalRevenueSuccess:(state,action)=>{
            state.loading = false;
            state.totalRevenue = action.payload;
        },
        getTotalRevenueFailure:(state,action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        clearErrors:(state,action)=>{
            state.error = null;
        }
    }
});
export const {
    getAllUserRequest,
    getAllUserSuccess,
    getAllUserFailure,
    getTotalRevenueRequest,
    getTotalRevenueSuccess,
    getTotalRevenueFailure,
    clearErrors
}=adminSlice.actions;

export const getUsers=()=>async(dispatch)=>{
    try{
        dispatch(getAllUserRequest());
        const response=await axios.get("https://busbooking-4ykq.onrender.com/api/v1/admin/allusers");
        dispatch(getAllUserSuccess(response.data.users));
    }
    catch(error){
        dispatch(getAllUserFailure(error.response && error.response.data.message
            ? error.response.data.message
            : error.message));
    }
}


export const revenue=()=>async(dispatch)=>{
    try{
        dispatch(getTotalRevenueRequest());
        const response=await axios.get("https://busbooking-4ykq.onrender.com/api/v1/admin/totalrevenue");
        console.log(response);
        dispatch(getTotalRevenueSuccess(response.data.totalRevenue));
    }
    catch(error){
        dispatch(getTotalRevenueFailure(error.response && error.response.data.message
            ? error.response.data.message
            :error.message
        ));
    }
}
export default adminSlice.reducer
