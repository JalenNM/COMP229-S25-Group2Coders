import React from 'react';

const About = ({ user }) => {
  if (!user) {
    return <div className="container mt-5 text-center">You need to be logged in to view this page.</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">My Profile</h2>

      <table className="table table-bordered table-striped w-75 mx-auto shadow">
        <tbody>
          <tr>
            <th style={{ width: '30%' }}>Username</th>
            <td>{user.username}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{user.email}</td>
          </tr>
          <tr>
            <th>Role</th>
            <td>
              <span className={`badge ${user.role === 'admin' ? 'bg-success' : 'bg-secondary'}`}>
                {user.role}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default About;
