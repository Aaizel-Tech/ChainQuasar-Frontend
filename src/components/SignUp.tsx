import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SignUpProps {
    onSignUp: (userData: any) => void;
}

const SignUpPage: React.FC<SignUpProps> = ({ onSignUp }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        country: '',
        countryCode: '',
        mobileNumber: ''
    });
    
    const [error, setError] = useState<string | null>(null); 
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match!');
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_UASS_BASE_URL}/user/signUp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (response.ok) {
                onSignUp(result);
                navigate('/login');
            } else {
                setError(result.message || 'Something went wrong, please try again!');
            }
        } catch (error) {
            setError('An error occurred during the sign-up process. Please try again later.');
        }
    };
    return (
        <div style={styles.container}>
            {/* Popup error message */}
            {error && (
                <div style={styles.errorPopup}>
                    <span>{error}</span>
                </div>
            )}
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.header}>Sign Up</h2>
                {Object.keys(formData).map((key) => (
                    <div key={key} style={styles.inputGroup}>
                        <label htmlFor={key} style={styles.label}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </label>
                        <input
                            type={key.includes('password') ? 'password' : 'text'}
                            id={key}
                            name={key}
                            value={(formData as any)[key]}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                ))}
                <button type="submit" style={styles.button}>Sign Up</button>
            </form>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#6366f1', 
        flexDirection: 'column',
        paddingTop: '10px',
    },
    form: {
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#fff', 
        boxShadow: '0 4px 6px rgba(2, 2, 2, 0.1)',
        maxWidth: '400px',
        width: '100%',
    },
    header: {
        textAlign: 'center',
        color: '#333', 
        marginBottom: '20px',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        color: '#333',
    },
    input: {
        width: '100%',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#6366f1', 
        color: '#fff', 
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        width: '100%',
        marginTop: '10px',
    },
    errorPopup: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: '10px',
        backgroundColor: 'red',
        color: 'white',
        textAlign: 'center',
        fontSize: '16px',
        zIndex: 1000, 
        transition: 'top 0.3s ease-in-out',
    },
};

export default SignUpPage;
