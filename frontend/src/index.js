import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'

import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux';
import adminReducer, { loadAdmin } from './features/AdminSlice';


export const store = configureStore({
  reducer: {
    admin: adminReducer
  }
});
store.dispatch(loadAdmin(null));


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ChakraProvider>
      <Router>
        <App />
      </Router>
    </ChakraProvider>
  </Provider>
);