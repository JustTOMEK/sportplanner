import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Register = ({ onRegister }) => {
    const [newUserName, setNewUserName] = useState("");
    const [newUserPassword, setNewUserPassword] = useState("");
    const navigate = useNavigate();
    const handleRegisterUser = (e) => {
        e.preventDefault();
        const newUser = { name: newUserName, password: newUserPassword };
        axios.post("http://localhost:8080/api/auth/register", newUser)
            .then(response => {
                alert('User added successfully!');
                onRegister(response.data);
                navigate('/home');
            })
            .catch(error => {
                if (error.response && error.response.status === 409) {
                    alert("User with this name exists");
                } else {
                    alert("Error adding user");
                    console.error("Error adding user:", error);
                }
            });
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-xs flex flex-col items-center">
                <h2 className="text-3xl text-white mb-2">Register</h2>
                <form onSubmit={handleRegisterUser} className="w-full flex flex-col">
                    <input
                        className="myinput mb-3"
                        autoFocus
                        required
                        type="text"
                        placeholder="Username"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                    />
                    <input
                        className="myinput mb-3"
                        required
                        type="password"
                        placeholder="Password"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="loginbutton loginbutton-submit"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
