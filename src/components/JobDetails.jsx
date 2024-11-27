import React, { useState, useEffect } from 'react'; 
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, Typography } from '@mui/material';

const JobDetails = ({ programId }) => {
  const [jobs, setJobs] = useState([]); 
  const [currentJob, setCurrentJob] = useState({ id: null, name: '', description: '', job_skill: '' }); 

  const fetchJobs = async () => {
    try {
      const response = await fetch(`http://localhost:8081/programs/job/${programId}`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const data = await response.json();
      setJobs(data); // Assuming data is an array of jobs
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [programId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentJob({ ...currentJob, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    currentJob.id ? await updateJob(currentJob) : await createJob(currentJob);
    setCurrentJob({ id: null, name: '', description: '' });
    fetchJobs();
  };

  const createJob = async (job) => {
    try {
      await fetch(`http://localhost:8081/job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...job, program_id: programId }),
      });
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  const updateJob = async (job) => {
    try {
      await fetch(`http://localhost:8081/job/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...job, program_id: programId }), 
      });
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  const deleteJob = async (id) => {
    try {
      await fetch(`http://localhost:8081/job/${id}`, { method: 'DELETE' });
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };
  const handleGenerateSkills = async (id) => {
    try {
      await fetch(`http://localhost:8081/programs/job/collect_skills/${id}`, { method: 'POST' });
      fetchJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };
  const handleEdit = (job) => {
    setCurrentJob(job); 
  };

  const handleGenerate = async () => {
    try {
      await fetch(`http://localhost:8081/programs/job/${programId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  return (
    <Box m="20px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', marginBottom: '20px' }}>
        <TextField 
          label="Job Name" 
          name="name"
          value={currentJob.name} 
          onChange={handleInputChange} 
          required
          style={{ marginRight: '10px' }} 
        />
         <TextField 
          label="Description" 
          name="description"
          value={currentJob.description} 
          onChange={handleInputChange} 
          required
          style={{ marginRight: '10px' }} 
        /> 
        <TextField 
          label="job_skill" 
          name="job_skill"
          value={currentJob.job_skill} 
          onChange={handleInputChange} 
          required
          style={{ marginRight: '10px' }} 
        /> 
        <Button type="submit" variant="contained">
          {currentJob.id ? 'Update Job' : 'Add Job'}
        </Button>
       
      </form>
      <Button type="submit" variant="contained" onClick={() => handleGenerate()}>
          Generate Job
        </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Skills</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.id}</TableCell>
                <TableCell>{job.name}</TableCell>
                <TableCell>{job.description}</TableCell>
                <TableCell>{job.job_skill}</TableCell>
                <TableCell>
                <Button onClick={() => handleGenerateSkills(job.id)} variant="outlined" color="secondary" style={{ marginRight: '10px' }}>
                    Generate Skills
                  </Button>
                  <Button onClick={() => handleEdit(job)} variant="outlined" color="secondary" style={{ marginRight: '10px' }}>
                    Edit
                  </Button>
                  <Button onClick={() => deleteJob(job.id)} variant="outlined" color="secondary" style={{ marginRight: '10px' }}>
                    Delete
                  </Button>
                 
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default JobDetails;
