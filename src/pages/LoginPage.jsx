import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

export default function LoginPage() {
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();
	
    const {setIsEditor} = useContext(UserContext);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post('/login.php', { password }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }});
			const { token, error } = response.data;

			if (token) {
				console.log('token set', response.data);
				localStorage.setItem('token', token);
				setIsEditor(true);
				navigate('/');
			} else {
				setError(error);
			}
		} catch (error) {
			console.error(error);
			setError('An error occurred');
		}
	};

	return (
		<div className="section">
            <div className="section__header">Login</div>
            <div className="section__content login-form">
				<input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
				<button onClick={handleSubmit} type="submit">Enter</button>
				<div>{error && <p>{error}</p>}</div>
            </div>
        </div>
	);
};
