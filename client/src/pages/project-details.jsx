/*
  FileName: project-details.jsx
  Name: Chunghyun Lee
  Student number: 301000913
  Course: COMP229-401
  Date: 2025/07/14
*/

import { useState, useEffect } from 'react';
import { useNavigate, useParams} from 'react-router-dom';

const ProjectDetails = () => {
    const [project, setProject] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: ''
    });

    const { id } = useParams();
    const apiUrl = '/api';
    const navigate = useNavigate();

    useEffect(() => {
        if(id){
            const fetchProject  = async () => {
                const token =  localStorage.getItem('token');

                if(!token){
                    navigate('/login');
                    return;
                }

                try {
                    const response = await fetch(`${apiUrl}/projects/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok){
                        throw new Error('Failed to fetch project');
                    }

                    const data = await response.json();
                    setProject({
                        name: data.name,
                        description: data.description,
                        startDate: data.startDate.split('T')[0],
                        endDate: data.endDate.split('T')[0]
                    });

                } catch (error) {
                    console.error('Error fetching project', error);
                }
            }

            fetchProject();
        }
    }, [id, apiUrl]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setProject(prevState => ({...prevState, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token =  localStorage.getItem('token');

        if(!token){
            navigate('/login');
            return;
        }

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${apiUrl}/projects/${id}` : `${apiUrl}/projects`;

        try {
            const response  = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(project)
            });

            // Check if the user is authorized to create or update the project
        if (!response.ok) {
            const errorData = await response.json();

            if (response.status === 403) {
                alert(errorData.message || 'You are not authorized');
                return;
            }

            throw new Error(errorData.message || 'Failed to save project');
        }

            navigate('/projects');
        } catch (error) {
            console.error('Error saving project', error);
        }
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center">{id ? 'Update Project' : ' Create Project'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text"
                        id="name"
                        name="name"
                        value={project.name} 
                        className="form-control"
                        onChange={handleChange}
                        required
                        />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <input type="text"
                        id="description"
                        name="description"
                        value={project.description} 
                        className="form-control"
                        onChange={handleChange}
                        required
                        />
                </div>
                <div className="form-group">
                    <label htmlFor="startDate">Start Date</label>
                    <input type="date"
                        id="startDate"
                        name="startDate"
                        value={project.startDate} 
                        className="form-control"
                        onChange={handleChange}
                        required
                        />
                </div>
                <div className="form-group">
                    <label htmlFor="endDate">End Date</label>
                    <input type="date"
                        id="endDate"
                        name="endDate"
                        value={project.endDate} 
                        className="form-control"
                        onChange={handleChange}
                        required
                        />
                </div>
                
                <button type="submit" className="btn btn-primary">{id? 'Update': 'Create'}</button>
                <button 
                    type="button"
                    className="btn btn-secondary" 
                    style={{ marginLeft: '10px' }} 
                    onClick={() => navigate('/projects')}>
                    Back to List
                </button>
                
            </form>
        </div>
    )

};

export default ProjectDetails;