import React, { useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from "react-icons/fa";


function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const navigate = useNavigate();


    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError(''); // Reset any previous login errors

        try {
            const requestBody = {
                username: username,
                password: password,
            };

            const response = await axios.post("http://localhost:8080/api/auth/authenticate", requestBody);
            if (response.status === 200) {
                if (response.data)
                {
                    onLogin(response.data); // Update App state if authentication is successful
                    navigate('/home'); // Navigate to HomePage
                }
            } else {
                throw new Error('Authentication failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.response && error.response.status === 404) {
                setLoginError("User not found");
            } else {
                setLoginError('An error occurred during login');
            }
            alert(loginError);
        }
    }


    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-xs flex flex-col items-center">
                <h2 className="text-3xl text-white mb-2">Welcome to Project Planner</h2>
                <form onSubmit={handleLoginSubmit} className="w-full flex flex-col mb-4">
                    <input
                        className="myinput mb-2"
                        autoFocus
                        required
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <FaUser className="icon_user"/>
                    <input
                        className="myinput mb-2"
                        required
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <FaLock className="icon_lock"/>
                    <button
                        type="submit"
                        className="loginbutton loginbutton-submit"
                    >
                        Login
                    </button>

                </form>
            </div>
        </div>
    );
}

export default Login;
