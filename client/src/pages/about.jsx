import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const About = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('유저 정보를 불러오지 못했습니다');

                const data = await res.json();
                setUser(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUser();
    }, []);

    const goToEdit = () => {
        navigate('/about-details'); // 수정 페이지로 이동
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">About (My Page)</h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {!user && !error && <div>Loading...</div>}

            {user && (
                <>
                    <ul className="list-group mb-3">
                        <li className="list-group-item"><strong>Username:</strong> {user.username}</li>
                        <li className="list-group-item"><strong>Email:</strong> {user.email}</li>
                        <li className="list-group-item"><strong>Role:</strong> {user.role}</li>
                        <li className="list-group-item"><strong>Education:</strong> {user.education || '-'}</li>
                        <li className="list-group-item"><strong>Contact:</strong> {user.contact || '-'}</li>
                    </ul>

                    <button className="btn btn-outline-primary" onClick={goToEdit}>
                        update
                    </button>
                </>
            )}
        </div>
    );
};

export default About;
