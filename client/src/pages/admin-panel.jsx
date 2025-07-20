import { useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const AdminPanel = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/'); // Redirect non-admins
    }
  }, [user, navigate]);

  const adminCards = [
    {
      title: 'Create Movie',
      text: 'Add a new movie to the database.',
      link: '/movie-details',
      btnLabel: 'Create',
      color: 'primary'
    },
    {
      title: 'Manage Movies',
      text: 'Edit or delete existing movies.',
      link: '/movies',
      btnLabel: 'Manage',
      color: 'warning'
    },
    {
      title: 'User Management',
      text: 'View and manage all registered users.',
      link: '/admin-panel/users',
      btnLabel: 'Manage Users',
      color: 'dark',
      disabled: false
    }
  ];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Control Panel</h2>

      <div className="row">
        {adminCards.map((card, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{card.title}</h5>
                <p className="card-text flex-grow-1">{card.text}</p>
                <Link
                  to={card.link}
                  className={`btn btn-${card.color} mt-auto ${card.disabled ? 'disabled' : ''}`}
                >
                  {card.btnLabel}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
