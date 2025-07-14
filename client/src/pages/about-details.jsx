/*
  FileName: about-details.jsx
  Name: Chunghyun Lee
  Student number: 301000913
  Course: COMP229-401
  Date: 2025/07/14
*/

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AboutDetail = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ education: "", contact: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();
        setUser(data);
        setForm({ education: data.education || "", contact: data.contact || "" });
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update user information.");
      navigate("/about"); // Redirect to About page after update
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>Edit Profile</h2>
      <div className="alert alert-warning" role="alert">Modifications are only acceptable for Education and Contact.</div>
      <form onSubmit={handleSubmit}>
        {/* only read*/}
        <div className="mb-3">
          <label>Username</label>
          <input type="text" className="form-control" value={user.username} readOnly />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" value={user.email} readOnly />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <input type="text" className="form-control" value={user.role} readOnly />
        </div>

        {/* Editable fields */}
        <div className="mb-3">
          <label>Education</label>
          <input
            type="text"
            name="education"
            value={form.education}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label>Contact address</label>
          <input
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    </div>
  );
};

export default AboutDetail;
