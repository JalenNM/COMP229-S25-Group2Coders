import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        education: '',      // 추가
        contact: ''         // 추가
    });

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Registration failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.username);

            setMessage('Registration successful!');
            setTimeout(() => {
                setMessage('');
                navigate('/');
            }, 3000);

        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center">Register</h1>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type='text'
                        id='username'
                        name='username'
                        value={form.username}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        value={form.email}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type='password'
                        id='password'
                        name='password'
                        value={form.password}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                {/* 학력 추가 */}
                <div className="form-group">
                    <label htmlFor="education">Education / Qualification</label>
                    <input
                        type='text'
                        id='education'
                        name='education'
                        value={form.education}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                {/* 연락처 추가 */}
                <div className="form-group">
                    <label htmlFor="contact">Contact</label>
                    <input
                        type='text'
                        id='contact'
                        name='contact'
                        value={form.contact}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    );
}

export default Register;
