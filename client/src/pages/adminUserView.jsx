/*
  FileName: adminUserView.jsx
  Name: Chunghyun Lee
  Student number: 301000913
  Course: COMP229-401
  Date: 2025/07/14
*/

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AdminUserView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user data.");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUser();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete user");

      setMessage("User deleted successfully.");
      setTimeout(() => {
        navigate("/admin");
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>User Details</h2>

      {message && <div className="alert alert-success">{message}</div>}

      <ul className="list-group mb-3">
        <li className="list-group-item"><strong>Username:</strong> {user.username}</li>
        <li className="list-group-item"><strong>Email:</strong> {user.email}</li>
        <li className="list-group-item"><strong>Role:</strong> {user.role}</li>
        <li className="list-group-item"><strong>Education:</strong> {user.education || '-'}</li>
        <li className="list-group-item"><strong>Contact:</strong> {user.contact || '-'}</li>
      </ul>

      <button className="btn btn-danger me-2" onClick={handleDelete}>
        Delete
      </button>
      <button className="btn btn-secondary" onClick={handleBack}>
        Back
      </button>
    </div>
  );
};

export default AdminUserView;
