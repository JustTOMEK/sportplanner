import { useNavigate } from 'react-router-dom';


function WelcomePage() {

    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const handleLoginClick = () => {
        navigate('/login');
    }


    return (
        <div>
            <h1>Welcome to the website</h1>
            <button onClick={handleLoginClick}>Click here to login</button>
            <button onClick={handleRegisterClick}>Click here to register</button>
        </div>
    )
}

export default WelcomePage;