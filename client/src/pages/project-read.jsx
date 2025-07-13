import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProjectRead = () => {
    const [project, setProject] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`/api/projects/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch project');
                }
                const data = await response.json();
                setProject(data);
            } catch (error) {
                console.error('Error:', error.message);
            }
        };
        fetchProject();
    }, [id]);

    if (!project) return <p className="text-center mt-5">Loading...</p>;

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Project Details</h1>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{project.name}</h5>
                    <p className="card-text"><strong>Description:</strong> {project.description}</p>
                    <p className="card-text"><strong>Created By:</strong> {project.createdBy?.username || 'Unknown'}</p>
                    <p className="card-text"><strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
                    <p className="card-text"><strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}</p>
                    <button className="btn btn-secondary" onClick={() => navigate('/projects')}>Back to List</button>
                </div>
            </div>
        </div>
    );
};

export default ProjectRead;
