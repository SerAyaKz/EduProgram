import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, useTheme, Grid, Snackbar, Alert } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import RecommendIcon from '@mui/icons-material/Recommend';

import { tokens } from "../../theme";
import { userId } from "../../data/mockData";
import Header from "../../components/Header";
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8081';

const initialProgramState = {
  id: null,
  codeName: "",
  academicDegree: "",
  eduGoalKz: "",
  eduGoalRu: "",
  eduGoalEn: "",
  directionCodeName: "",
  iscedLevel: 0,
  nqfLevel: 0,
  sqfLevel: 0,
  studyDurationYears: 0,
  creditsCount: 0,
  createdById: userId,
};

const Programs = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [program, setProgram] = useState(initialProgramState);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [isEditing, setIsEditing] = useState(false);

  // API calls using custom hooks
  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/program`);

      if (!response.ok) {
        throw new Error("Failed to fetch programs");
      }

      const data = await response.json();
      setPrograms(data);
    } catch (error) {
      showNotification(`Error fetching programs: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProgram = async (programData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/program`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(programData),
      });

      if (!response.ok) {
        throw new Error("Failed to create program");
      }

      await fetchPrograms();
      showNotification('Program successfully created', 'success');
      return true;
    } catch (error) {
      showNotification(`Error creating program: ${error.message}`, 'error');
      return false;
    }
  };

  const handleUpdateProgram = async (programData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/program/${programData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(programData),
      });

      if (!response.ok) {
        throw new Error("Failed to update program");
      }

      await fetchPrograms();
      showNotification('Program successfully updated', 'success');
      return true;
    } catch (error) {
      showNotification(`Error updating program: ${error.message}`, 'error');
      return false;
    }
  };

  const handleDeleteProgram = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/program/${id}`, { 
        method: "DELETE" 
      });

      if (!response.ok) {
        throw new Error("Failed to delete program");
      }

      setPrograms((prevRows) => prevRows.filter((row) => row.id !== id));
      showNotification('Program successfully deleted', 'success');
    } catch (error) {
      showNotification(`Error deleting program: ${error.message}`, 'error');
    }
  };

  // Event handlers
  const handleChange = (event) => {
    const { name, value } = event.target;
    let parsedValue = value;
    
    // Parse number fields
    if (['iscedLevel', 'nqfLevel', 'sqfLevel', 'studyDurationYears', 'creditsCount'].includes(name)) {
      parsedValue = value === '' ? 0 : Number(value);
    }
    
    setProgram(prevState => ({
      ...prevState,
      [name]: parsedValue
    }));
  };

  const handleEdit = (rowData) => {
    setProgram(rowData);
    setIsEditing(true);
    setShowAdvanced(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    let success;
    if (program.id) {
      success = await handleUpdateProgram(program);
    } else {
      success = await handleCreateProgram(program);
    }
    
    if (success) {
      resetForm();
    }
  };

  const resetForm = () => {
    setProgram(initialProgramState);
    setIsEditing(false);
    if (isEditing) {
      setShowAdvanced(false);
    }
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const duplicateProgram = async (id) => {
    try {
      const programToDuplicate = programs.find(p => p.id === id);
      if (!programToDuplicate) return;
      
      const duplicatedProgram = {
        ...programToDuplicate,
        id: null,
        codeName: `${programToDuplicate.codeName} (Copy)`,
        createdById: userId
      };
      
      await handleCreateProgram(duplicatedProgram);
    } catch (error) {
      showNotification(`Error duplicating program: ${error.message}`, 'error');
    }
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  // Effects
  useEffect(() => {
    fetchPrograms();
  }, []);

  // Data Grid columns
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "codeName",
      headerName: "Title",
      flex: 2,
      cellClassName: "name-column--cell",
      renderCell: (params) => (
        <Typography
          variant="body1"
          color="inherit"
          sx={{ 
            lineHeight: 'inherit',
            fontSize:'inherit',
            cursor: 'pointer',
            '&:hover': { 
              textDecoration: 'underline',
              color: colors.greenAccent[400] 
            }
          }}
          onClick={() => navigateTo(`/program/${params.row.id}`)}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "createdBy",
      headerName: "Made By",
      flex: 1,
      valueGetter: () => "You",
    },
    {
      field: "modifiedDate",
      headerName: "Last Modified",
      flex: 1,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: "Actions",
      flex: 1,
      getActions: (params) => [
        <GridActionsCellItem 
          icon={<EditIcon />} 
          label="Edit" 
          onClick={() => handleEdit(params.row)} 
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete Program"
          onClick={() => handleDeleteProgram(params.id)}
        />,
        <GridActionsCellItem
          icon={<SecurityIcon />}
          label="Download PDF"
          onClick={() => showNotification('PDF download started', 'info')}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<SettingsIcon />}
          label="Edit Program"
          onClick={() => navigateTo(`/program/${params.id}/edit`)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<FileCopyIcon />}
          label="Duplicate Program"
          onClick={() => duplicateProgram(params.id)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<CompareArrowsIcon />}
          label="Compare Ed. Program"
          onClick={() => navigateTo(`/program/compare/${params.id}`)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<EmojiObjectsIcon />}
          label="Goal Generation"
          onClick={() => navigateTo(`/program/${params.id}/goal-generation`)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<RecommendIcon />}
          label="Recommendation"
          onClick={() => navigateTo(`/recommendation/${params.id}`)}
          showInMenu
        />,
      ],
    },
  ];

  return (
    <Box m="20px">
      <Header title="Educational Program" subtitle="Manage educational programs" />
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {isEditing ? 'Edit Program' : 'Create New Program'}
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <TextField 
              name="codeName" 
              label="Program Code/Name" 
              required
              fullWidth 
              value={program.codeName} 
              onChange={handleChange} 
            />
          </Grid>

          {/* Conditionally Rendered Advanced Fields */}
          {showAdvanced && (
            <>
              <Grid item xs={12} md={6}>
                <TextField 
                  name="academicDegree" 
                  label="Academic Degree" 
                  fullWidth 
                  value={program.academicDegree} 
                  onChange={handleChange} 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField 
                  name="directionCodeName" 
                  label="Direction Code Name" 
                  fullWidth 
                  value={program.directionCodeName} 
                  onChange={handleChange} 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  name="eduGoalKz" 
                  label="Education Goal (KZ)" 
                  fullWidth 
                  multiline
                  rows={2}
                  value={program.eduGoalKz} 
                  onChange={handleChange} 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  name="eduGoalRu" 
                  label="Education Goal (RU)" 
                  fullWidth 
                  multiline
                  rows={2}
                  value={program.eduGoalRu} 
                  onChange={handleChange} 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  name="eduGoalEn" 
                  label="Education Goal (EN)" 
                  fullWidth 
                  multiline
                  rows={2}
                  value={program.eduGoalEn} 
                  onChange={handleChange} 
                />
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <TextField 
                  name="iscedLevel" 
                  label="ISCED Level" 
                  type="number" 
                  InputProps={{ inputProps: { min: 0 } }}
                  fullWidth 
                  value={program.iscedLevel} 
                  onChange={handleChange} 
                />
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <TextField 
                  name="nqfLevel" 
                  label="NQF Level" 
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  fullWidth 
                  value={program.nqfLevel} 
                  onChange={handleChange} 
                />
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <TextField 
                  name="sqfLevel" 
                  label="SQF Level" 
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  fullWidth 
                  value={program.sqfLevel} 
                  onChange={handleChange} 
                />
              </Grid>
              <Grid item xs={6} sm={3} md={3}>
                <TextField 
                  name="studyDurationYears" 
                  label="Study Duration (Years)" 
                  type="number"
                  InputProps={{ inputProps: { min: 0, step: 0.5 } }}
                  fullWidth 
                  value={program.studyDurationYears} 
                  onChange={handleChange} 
                />
              </Grid>
              <Grid item xs={6} sm={3} md={3}>
                <TextField 
                  name="creditsCount" 
                  label="Credits Count" 
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  fullWidth 
                  value={program.creditsCount} 
                  onChange={handleChange} 
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                type="submit"
              >
                {isEditing ? 'Update Program' : 'Create Program'}
              </Button>
              
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? "Hide Advanced Fields" : "Show Advanced Fields"}
              </Button>

              {isEditing && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={resetForm}
                >
                  Cancel Edit
                </Button>
              )}
              
              {showAdvanced && (
                <Button 
                  variant="outlined" 
                  color="info"
                  onClick={() => showNotification('Goal generation feature will be implemented soon', 'info')}
                >
                  Generate Goal
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ height: '75vh', width: '100%' }}>
        <DataGrid 
          rows={programs} 
          columns={columns}
          loading={loading}
          disableSelectionOnClick
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: "none" },
            "& .name-column--cell": { color: colors.greenAccent[300] },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
          }}
        />
      </Box>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Programs;