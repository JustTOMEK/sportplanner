import React from "react";

function HomePage({ onLogout }) {
    return (
        <div>
            <h1>Welcome to the HomePage!</h1>
            <button onClick={onLogout}>Logout</button>
        </div>
    );
}

export default HomePage;
