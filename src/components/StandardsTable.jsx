import React, { useState, useEffect } from 'react'; 
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, Typography } from '@mui/material';

const StandardsTable = ({ programId }) => {
  const [standards, setStandards] = useState([]); 
  const [currentStandard, setCurrentStandard] = useState({ id: null, name: '' }); 

  const fetchStandards = async () => {
    try {
      const response = await fetch(`http://localhost:8081/programs/standard/${programId}`, {
        headers: {
          // Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch standards");
      }

      const data = await response.json();
      setStandards(data); // Assuming data is an array of standards
      
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchStandards();
  }, [programId]);

  // Handle form input change
  const handleInputChange = (event) => {
    setCurrentStandard({ ...currentStandard, name: event.target.value });
  };

  // Create or update a standard
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (currentStandard.id) {
      // Update standard
      await updateStandard(currentStandard);
    } else {
      // Create new standard
      await createStandard(currentStandard);
    }
    
    setCurrentStandard({ id: null, name: '' }); // Reset form
    fetchStandards(); // Refresh the standards list
  };

  const createStandard = async (standard) => {
    try {
      await fetch(`http://localhost:8081/standard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: standard.name, program_id: programId }),
      });
    } catch (error) {
      console.error("Error creating standard:", error);
    }
  };

  const updateStandard = async (standard) => {
    try {
        await fetch(`http://localhost:8081/standard/${standard.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: standard.name, program_id: programId }), 
        });
    } catch (error) {
        console.error("Error updating standard:", error);
    }
};

  const deleteStandard = async (id) => {
    try {
      await fetch(`http://localhost:8081/standard/${id}`, {
        method: 'DELETE',
      });
      fetchStandards(); // Refresh the standards list after deletion
    } catch (error) {
      console.error("Error deleting standard:", error);
    }
  };

  const handleEdit = (standard) => {
    setCurrentStandard(standard); // Populate the form for editing
  };

  return (
    <Box m="20px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', marginBottom: '20px' }}>
        <TextField 
          label="Standard Name" 
          value={currentStandard.name} 
          onChange={handleInputChange} 
          required
          style={{ marginRight: '10px' }} 
        />
        <Button type="submit" variant="contained">
          {currentStandard.id ? 'Update Standard' : 'Add Standard'}
        </Button>
      </form>
      
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {standards.map((standard) => (
              <TableRow key={standard.id}>
                <TableCell>{standard.id}</TableCell>
                <TableCell>{standard.name}</TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(standard)} variant="outlined" color="secondary" style={{ marginRight: '10px' }}>
                    Edit
                  </Button>
                  <Button onClick={() => deleteStandard(standard.id)} variant="outlined" color="secondary">
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

export default StandardsTable;
