import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from '../node_modules/react-router-dom/dist/index'

import axios from 'axios'

if (process.env.NODE_ENV === "development") {
	axios.defaults.baseURL = 'http://enkada-api.ru/api';
}
else {
	axios.defaults.baseURL = 'https://enkada.ru/api';
}
//axios.defaults.withCredentials = true;

// Mση∂αу lεƒт мε вяσкεη glebeGlebe Tυεѕ∂αү, I ωαѕ тняσυgн ωιтн нσριηg glebeGlebe ωε∂ηεѕ∂αү, мү εмρтү αямѕ ωεяε σρεη glebeGlebe Tнυяѕ∂αү, ωαιтιηg ƒσя ℓσνε, ωαιтιηg ƒσя ℓσνε

ReactDOM.createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
)
