import React, { useState } from 'react';

const Profile = () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(storedUser || {});
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState(user.username || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  const handleProfileUpdate = async () => {
    try {
      const res = await fetch(`/api/users/${user._id}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password: password.trim() !== '' ? password : null,
        }),
      });
      
      if (!res.ok) throw new Error('Failed to update profile');

      // Update local user info (if username changed)
      const updatedUser = { ...user, username };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      setMessage('✅ Profile updated successfully!');
      setPassword('');
      setShowForm(false);
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Error updating profile');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4">My Profile</h2>

      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}

      <table className="table">
        <tbody>
          <tr>
            <th>Username</th>
            <td>{user.username}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{user.email}</td>
          </tr>
          <tr>
            <th>Role</th>
            <td>{user.role}</td>
          </tr>
        </tbody>
      </table>
      
      <button className="btn btn-outline-primary mb-3" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Update Profile'}
      </button>

      {showForm && (
        <div className="card card-body">
          <div className="mb-3">
            <label className="form-label">Update New Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Update New Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
            />
          </div>
          <button className="btn btn-success" onClick={handleProfileUpdate}>
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
