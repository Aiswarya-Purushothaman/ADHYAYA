import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css'
import App from "./App"
import { Provider } from 'react-redux';
import store from './utils/redux/store'
import { OnlineUsersProvider } from './helpers/chatContext';

ReactDOM.createRoot(document.getElementById('root')!)
  .render(

    // <React.StrictMode>

      <Provider store={store}>
        <BrowserRouter>
        <OnlineUsersProvider>
          <App/>
          </OnlineUsersProvider>
          <ToastContainer />
        </BrowserRouter>
      </Provider>
      
  //  </React.StrictMode>
  );

