import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {NextUIProvider} from '@nextui-org/react'
import { Provider, useDispatch } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store';
import { loadUser } from './slices/userSlice.js'
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_51PuwfWCL3Rc138wzFAh3a8RCJJuNpEDWmKK5pXIBx5CgYSreOa5WxtUJw2Q5Fv7MlyA1ulNhnjv0f97XMpP3UUUr00xDR0mglP'); // Replace with your Stripe publishable key

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
<Elements stripe={stripePromise}>
<App />
</Elements>
    </NextUIProvider>
    </PersistGate>
    </Provider>
  ,
)
