import { useEffect, useState } from 'react';

const AdminUsers = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch users');

        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError('Error fetching users');
      }
    };

    fetchUsers();
  }, [user]);

  const updateRole = async (userId, newRole) => {
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) throw new Error('Failed to update role');

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error(err);
      alert('Error updating role');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to delete user');

      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error(err);
      alert('Error deleting user');
    }
  };

  if (!user || user.role !== 'admin') {
    return <div className="container mt-4">Access Denied</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">User Management</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {users.length === 0 ? (
        <p className="text-center">No users found</p>
      ) : (
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  {u.role === 'user' ? (
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => updateRole(u._id, 'admin')}
                    >
                      Promote to Admin
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => updateRole(u._id, 'user')}
                    >
                      Demote to User
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteUser(u._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;
