import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
} from '@mui/material';

const SectionDetails = ({ section, onUpdate, onDelete, onCreate, programId }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    sectionTitle: section ? section.sectionTitle : '',
    sectionPrompt: section ? section.sectionPrompt : '',
    sectionContent: section ? section.sectionContent : '',
    numbering: section ? section.numbering : '',
    programId: Number(programId),
    
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle update
  const handleUpdate = (e) => {
    e.preventDefault();
    onUpdate(section.id, formData); // Assuming onUpdate is a function passed as prop
    setIsEditing(false);
  };

  // Handle delete
  const handleDelete = () => {
    onDelete(section.id); // Assuming onDelete is a function passed as prop
  };

  // Handle create
  const handleCreate = (e) => {
    e.preventDefault();
    onCreate(formData); // Assuming onCreate is a function passed as prop
    setIsCreating(false);
    setFormData({ sectionTitle: '', sectionPrompt: '', sectionContent: '' }); // Reset form data
  };

  return (
    <Box>
      {section ? (
        <>
          <Typography variant="h5">{section.sectionTitle}</Typography>
          {showPrompt && (
            <Typography variant="body1" paragraph>
              {section.sectionPrompt}
            </Typography>
          )}
          <Typography variant="body2" paragraph>
            {section.sectionContent}
          </Typography>

          <Button variant="outlined" color="secondary" onClick={() => setShowPrompt((prev) => !prev)}>
            {showPrompt ? 'Hide Prompt' : 'Show Prompt'}
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleDelete} style={{ marginLeft: '10px' }}>
            Delete Section
          </Button>
          <Button variant="contained" onClick={() => setIsEditing(true)} style={{ marginLeft: '10px' }}>
            Edit Section
          </Button>
          <Button variant="contained" onClick={() => setIsCreating(true)} style={{ marginLeft: '10px' }}>
            Create Section
          </Button>

          {isEditing && (
            <Box mt={2}>
              <form onSubmit={handleUpdate}>
                <TextField 
                  name="sectionTitle" 
                  label="Title" 
                  value={formData.sectionTitle} 
                  onChange={handleInputChange} 
                  fullWidth 
                  required
                  style={{ marginBottom: '10px' }} 
                />
                <TextField 
                  name="sectionPrompt" 
                  label="Prompt" 
                  value={formData.sectionPrompt} 
                  onChange={handleInputChange} 
                  fullWidth 
                  multiline 
                  rows={2} 
                  style={{ marginBottom: '10px' }} 
                />
                <TextField 
                  name="sectionContent" 
                  label="Content" 
                  value={formData.sectionContent} 
                  onChange={handleInputChange} 
                  fullWidth 
                  multiline 
                  rows={4} 
                  required
                  style={{ marginBottom: '10px' }} 
                />
                <TextField 
                  name="numbering" 
                  label="Numbering" 
                  value={formData.numbering} 
                  onChange={handleInputChange} 
                  fullWidth 
                  multiline 
                  rows={4} 
                  required
                  style={{ marginBottom: '10px' }} 
                />
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => setIsEditing(false)} style={{ marginLeft: '10px' }}>
                  Cancel
                </Button>
              </form>
            </Box>
          )}

          {isCreating && (
            <Box mt={2}>
              <form onSubmit={handleCreate}>
                <TextField 
                  name="sectionTitle" 
                  label="Title" 
                  value={formData.sectionTitle} 
                  onChange={handleInputChange} 
                  fullWidth 
                  required
                  style={{ marginBottom: '10px' }} 
                />
                <TextField 
                  name="sectionPrompt" 
                  label="Prompt" 
                  value={formData.sectionPrompt} 
                  onChange={handleInputChange} 
                  fullWidth 
                  multiline 
                  rows={2} 
                  style={{ marginBottom: '10px' }} 
                />
                <TextField 
                  name="sectionContent" 
                  label="Content" 
                  value={formData.sectionContent} 
                  onChange={handleInputChange} 
                  fullWidth 
                  multiline 
                  rows={4} 
                  required
                  style={{ marginBottom: '10px' }} 
                />
                <TextField 
                  name="numbering" 
                  label="Numbering" 
                  value={formData.numbering} 
                  onChange={handleInputChange} 
                  fullWidth 
                  multiline 
                  rows={4} 
                  required
                  style={{ marginBottom: '10px' }} 
                />
                <Button type="submit" variant="contained" color="primary">
                  Create
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => setIsCreating(false)} style={{ marginLeft: '10px' }}>
                  Cancel
                </Button>
              </form>
            </Box>
          )}
        </>
      ) : (
        <Typography variant="h6">No section selected or available. Please create or select a section.</Typography>
      )}
    </Box>
  );
};

export default SectionDetails;