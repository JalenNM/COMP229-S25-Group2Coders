import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectsList = () =>  {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects', {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }

                const data = await response.json();
                setProjects(data);

            } catch (error) {
                console.error(`Error fetching projects: ${error.message}`);
            }
        };
        fetchProjects();
    }, []);

    const handleDelete = async (projectId) => {
        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            console.error('No token found, redirecting to login');
            return;
        }

        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete project');
            }

            setProjects(prevProjects => prevProjects.filter(project => project._id !== projectId));

        } catch (error) {
            console.error(`Error deleting project: ${error.message}`);
        }
    };

    return (
        <div className="container mt4">
            <h1 className="text-center">Projects</h1>
            <button className="btn btn-primary mb-3" onClick={() => navigate('/project-details')}>Create New Project</button>

            {projects.length > 0 ? (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <tr key={project._id}>
                                <td>{project.name}</td>
                                <td>{project.description}</td>
                                <td>{new Date(project.startDate).toLocaleDateString()}</td>
                                <td>{new Date(project.endDate).toLocaleDateString()}</td>
                                <td>{project.createdBy?.username || project.createdBy?.email || 'Unknown'}</td>

                                <td>
                                    <button className="btn btn-info me-2" onClick={() => navigate(`/project-read/${project._id}`)}>Read</button>
                                    <button className="btn btn-secondary me-2" onClick={() => navigate(`/project-details/${project._id}`)}>Update</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(project._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className='text-center'>No projects available</p>
            )}
        </div>
    );
};

export default ProjectsList;
