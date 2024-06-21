import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Components/Register';
import Login from './Components/Login';
import HomePage from './Pages/HomePage';
import WelcomePage from './Pages/WelcomePage';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    const handleLogin = (user) => {
        setUser(user);
        setIsLoggedIn(true);
    };

    const handleRegister = (user) => {
        setUser(user);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setUser(null);
        setIsLoggedIn(false);
        alert("User logged out");
    };

    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/welcome" />} />
                    <Route path="/welcome" element={<WelcomePage />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/register" element={<Register onRegister={handleRegister} />} />
                    <Route path="/home" element={isLoggedIn ? <HomePage user={user} onLogout={handleLogout} /> : <Navigate to="/welcome" />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
