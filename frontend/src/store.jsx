import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice.js';
import busReducer from './slices/busSlice.js';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import { combineReducers } from 'redux';

// Persist configuration for user slice
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user'], // Only persist the 'user' state
};

// Combine reducers
const rootReducer = combineReducers({
    user: userReducer,
    bus: busReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
const store = configureStore({
    reducer: persistedReducer, // Use the persisted reducer
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable serializable checks for redux-persist
        }),
});

// Create persistor to manage the persisted store
export const persistor = persistStore(store);

export default store;
