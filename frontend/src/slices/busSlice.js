import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState={
    buses: [],
    bus: {},
    loading: false,
    error: null,
    busescount: 0,
    success: false,
}
const busSlice = createSlice({
    name:'bus',
    initialState,
    reducers:{
        newBusRequest:(state)=>{
            state.loading = true;
        },
        newBusSuccess:(state,action)=>{
            state.loading = false;
            state.success = true;
            // state.bus=action.payload;
        },
        newBusFail:(state,action)=>{
            state.loading = false;
            state.error = action.payload;

        },
        newBusReset:(state,action)=>{
            state.success=false;
            state.error=null;
        },
        getAllBusRequest:(state)=>{
            state.loading = true;
            state.buses=[]
            state.busescount=0;
        },
        getAllBusSuccess:(state,action)=>{
            state.loading = false;
            state.buses = action.payload.buses;
            console.log(action.payload);
            state.busescount=action.payload.totalBuses


        },
        getAllBusFail:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
        getBusRequest:(state)=>{
            state.loading = true;
            state.bus={};
        },
        getBusSuccess:(state,action)=>{
            state.loading = false;
            state.bus=action.payload;
        },
        getBusFail:(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        },
        clearErrors: (state) => {
            state.error = null;
        },


    }

})
export const {newBusRequest, 
    newBusSuccess,
    newBusFail,
    newBusReset,
    getAllBusRequest,
    getAllBusSuccess,
    getAllBusFail,
    getBusRequest,
    getBusSuccess,
    getBusFail,
    clearErrors }=busSlice.actions;

export const createBus=(busData)=>async(dispatch)=>{
    try {
        dispatch(newBusRequest());
        // console.log(busData);
        
        const config = { headers: { "Content-Type": "multipart/form-data" } }
        const {data} = await axios.post('https://busbooking-4ykq.onrender.com/api/v1/bus/add', busData,config);
        dispatch(newBusSuccess(data.bus));

    }
    catch (error){
        dispatch(newBusFail(error.response.data.message));
    }
}
export const allBuses =  ({ keyword = "", currentPage = 1, from = "", to = "", journeyDate = "" } = {}) => async (dispatch) => {
    try {
        dispatch(getAllBusRequest());

        // Build the query string dynamically to include from, to, and journeyDate if provided
        let query = `https://busbooking-4ykq.onrender.com/api/v1/bus/buses?keyword=${keyword}&page=${currentPage}`;
        if (from) query += `&from=${from}`;
        if (to) query += `&to=${to}`;
        if (journeyDate) query += `&date=${journeyDate}`;

        // Make the request with the built query string
        const { data } = await axios.get(query);

        // Dispatch the success action with retrieved buses
        dispatch(getAllBusSuccess(data));
    } catch (error) {
        console.log(error.stack);
        dispatch(
            getAllBusFail(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            )
        );
    }
};

export const getBus = (busId) => async (dispatch) => {
    // console.log("getBus called with busId: ", busId);  // Add this log
    try {
      dispatch(getBusRequest());
      const { data } = await axios.get(`https://busbooking-4ykq.onrender.com/api/v1/bus/getSingle/${busId}`);
    //   console.log(data);
      
      dispatch(getBusSuccess(data.bus));
    } catch (error) {
      dispatch(getBusFail(error.response && error.response.data.message ? error.response.data.message : error.message));
    }
  };


export default busSlice.reducer;
