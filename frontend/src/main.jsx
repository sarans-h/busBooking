import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {NextUIProvider} from '@nextui-org/react'
import { Provider, useDispatch } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';
import { loadUser } from './slices/userSlice.js'
const LoadUserEffect = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  return null; // This component doesn't render anything
};
createRoot(document.getElementById('root')).render(
  
    <Provider store={store}>
<PersistGate loading={null} persistor={persistor}>
    <NextUIProvider>
<LoadUserEffect/>
<App />
    </NextUIProvider>
    </PersistGate>
    </Provider>
  ,
)
