import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // ✅ 메시지 상태 추가
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password,
                }),
            });

            if (!response.ok) {
                throw new Error('login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.username);
            //setUser({ 'username': data.user.username });
            navigate('/');
            // success login message
            setMessage('login successful!');
            setTimeout(() => {
                setMessage('');
                navigate('/');
            }, 3000); // 3seconds later redirect

        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center">Login</h1>

            {/* success login message */}
            {message && <div className="alert alert-success">{message}</div>}

            {/* error message */}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
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

                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
}

export default Login;
