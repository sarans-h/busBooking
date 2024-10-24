import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    user: {},
    loading: false,
    isUpdated: false,
    isAuthenticated: false,
    error: null,
    users: [],
    userDetails: {}
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        //rgister actions
        registerRequest: (state) => {
            state.loading = true;
            state.isAuthenticated = false;
        },
        registerSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
            state.error = null;
        },
        registerFail: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload;
        },
        // Login actions
        loginRequest: (state) => {
            state.loading = true;
            state.isAuthenticated = false;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
            state.error = null;
        },
        loginFail: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload;
            state.user = null;
        },

        // Load user action
        loadUserRequest: (state) => {
            state.loading = true;
        },
        loadUserSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        loadUserFail: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.error = action.payload;
        },

        // Logout actions
        logoutSuccess: (state) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
        },
        logoutFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // Reset errors
        clearErrors: (state) => {
            state.error = null;
        }
    }
});

// Action creators
export const {
    registerSuccess,
    registerFail,
    registerRequest,
    loginRequest,
    loginSuccess,
    loginFail,
    loadUserRequest,
    loadUserSuccess,
    loadUserFail,
    logoutSuccess,
    logoutFail,
    clearErrors
} = userSlice.actions;



export const checkAndLoadUser = createAsyncThunk('user/checkAndLoadUser', async (_, { dispatch, getState }) => {
    const state = getState();
    const { isAuthenticated, user } = state.user;

    // Only attempt to load the user if not authenticated and no user data is present
    if (!isAuthenticated && !user) {
        try {
            dispatch(loadUserRequest());
            const { data } = await axios.get('/api/v1/auth/me'); // API call to get user info
            dispatch(loadUserSuccess(data.user));
        } catch (error) {
            dispatch(loadUserFail(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            ));
        }
    }
});





// Thunk to login user



export const loginUser = ({ email, password }) => async (dispatch) => {
    try {
        dispatch(loginRequest());
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };
        const { data } = await axios.post('/api/v1/auth/login', { email, password }, config);
        dispatch(loginSuccess(data.user));
    } catch (error) {
        dispatch(loginFail(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        ));
    }
};

// Thunk to load user
export const loadUser = () => async (dispatch) => {
    try {
        dispatch(loadUserRequest());
        const { data } = await axios.get('/api/v1/auth/me'); // Assuming this endpoint fetches user info if authenticated
        dispatch(loadUserSuccess(data.user));
    } catch (error) {
        dispatch(loadUserFail(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        ));
    }
};

// Thunk to logout user
export const logoutUser = () => async (dispatch) => {
    try {
        await axios.get('/api/v1/auth/logout'); // Assuming this logs the user out and clears the cookie
        dispatch(logoutSuccess());
    } catch (error) {
        dispatch(logoutFail(
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message
        ));
    }
};

export const registerUser=(userData)=>async (dispatch)=>{
    try{
        dispatch(registerRequest());
        const config={
            headers:{
                'Content-Type':'multipart/form-data',
            }

        }
        const {data}=await axios.post('/api/v1/auth/register',userData,config);
        dispatch(registerSuccess(data.user));
    }
    catch(error){
        dispatch(registerFail(error.response && error.response.data.message 
            ? error.response.data.message 
            : error.message));
    }

}

export default userSlice.reducer;
