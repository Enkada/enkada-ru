import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from '../node_modules/react-router-dom/dist/index'

import axios from 'axios'
axios.defaults.baseURL = 'http://enkada-api.ru/api';
//axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
