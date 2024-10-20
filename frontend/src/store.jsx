import { configureStore } from '@reduxjs/toolkit';
import  userReducer  from './slices/userSlice.js';
import  busReducer  from './slices/busSlice.js';

const store = configureStore({
    reducer: {
        user:userReducer,
        bus: busReducer
    },
});

export default store;