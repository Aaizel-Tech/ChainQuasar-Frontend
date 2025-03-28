import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    onLogin: (userData: any) => void;
}

const LoginPage: React.FC<LoginProps> = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_UASS_BASE_URL}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (response.ok) {
                onLogin(result); 
                navigate('/');
            } else {
                setError(result.message || 'Invalid credentials');
            }
        } catch (error) {
            console.log(error)
            setError('An error occurred. Please try again.');
        }
    };
    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.header}>Login</h2>
                {error && <p style={styles.error}>{error}</p>}
                {Object.keys(formData).map((key) => (
                    <div key={key} style={styles.inputGroup}>
                        <label htmlFor={key} style={styles.label}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </label>
                        <input
                            type={key === 'password' ? 'password' : 'text'}
                            id={key}
                            name={key}
                            value={(formData as any)[key]}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>
                ))}
                <button type="submit" style={styles.button}>Login</button>
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
    },
    form: {
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#fff', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
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
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: '15px',
    },
};

export default LoginPage;
