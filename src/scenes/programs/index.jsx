import React, { useState,useEffect } from 'react'; 
import { Box, Typography,TextField,Button, useTheme } from "@mui/material"; 
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import SecurityIcon from '@mui/icons-material/Security';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { tokens } from "../../theme";
import { mockDataInvoices,userId, token } from "../../data/mockData";
import Header from "../../components/Header";
import { useNavigate } from 'react-router-dom';

const Programs = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // JSON.parse(localStorage.getItem("USER_KEY")).userId
  const navigate = useNavigate();

  const [programs, setPrograms] = useState([]);
  const deleteUser = (id) => () => {
    console.log(`Delete user with ID: ${id}`);
  };
  
  const toggleAdmin = (id) => () => {
    console.log(`Toggle admin for user with ID: ${id}`);
  };
  
  const duplicate = (id) => () => {
    console.log(`Duplicate user with ID: ${id}`);
  };

  const [program, setProgram] = useState({
    id: null,
    code: "",
    name: "",
    educationFieldCode: "",
    educationFieldName: "",
    trainingDirectionCode: "",
    trainingDirectionName: "",
    programGroup: "",
    iscedLevel: 0,
    nqfLevel: 0,
    sqfLevel: 0,
    studyDurationYears: 0,
    credits: 0,
    createdById: userId,
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setProgram(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCreateProgram = async () => {
    try {
      const response = await fetch(`http://localhost:8081/program`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(program),
      });

      if (!response.ok) {
        throw new Error("Failed to create program");
      }

      // Clear the form and fetch updated data
      setProgram({
        id: null,
        code: "",
        name: "",
        educationFieldCode: "",
        educationFieldName: "",
        trainingDirectionCode: "",
        trainingDirectionName: "",
        programGroup: "",
        iscedLevel: 0,
        nqfLevel: 0,
        sqfLevel: 0,
        studyDurationYears: 0,
        credits: 0,
        createdById: userId,
      });

      // Fetch updated list of programs
      fetchPrograms();
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch(`http://localhost:8081/program`, {
        headers: {
          // Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch programs");
      }

      const data = await response.json();
      setPrograms(data);
    } catch (error) {
      console.error(error.message);
    }
  };
  //console.log(programs[0]['createdBy'].firstname)
  useEffect(() => {
    fetchPrograms();
    
  }, [userId]);

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Title",
      flex: 2,
      cellClassName: "name-column--cell",
      renderCell: (params) => {
     
      const handleClick = () => {
        navigate(`/program/${params.row.id}`);
      };
      
      return (
        <div>
        <span 
          onClick={handleClick} 
          style={{ 
            color: 'blue', 
            textDecoration: 'underline', 
            cursor: 'pointer' 
          }}
        >
          {params?.value}
        </span></div>
      );
    },
  },
    {
      field: "createdBy",
      headerName: "Made By",
      flex: 1,
      valueGetter: (params) => {
        return params?.firstname+" "+ params?.lastname;
      },
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
          icon={<DeleteIcon />}
          label="Delete Program"
          onClick={deleteUser(params.id)}
        />,
        <GridActionsCellItem
          icon={<SecurityIcon />}
          label="Download PDF"
          onClick={toggleAdmin(params.id)}
          showInMenu
        />,
        <GridActionsCellItem
        icon={<FileCopyIcon />}
        label="Edit Program"
        onClick={duplicate(params.id)}
        showInMenu
      />,
        <GridActionsCellItem
          icon={<FileCopyIcon />}
          label="Duplicate Program"
          onClick={duplicate(params.id)}
          showInMenu
        />,
        <GridActionsCellItem
        icon={<FileCopyIcon />}
        label="Compare Ed. Program"
        onClick={duplicate(params.id)}
        showInMenu
      />,
      ],
    },
  ];

  return (
    <Box m="20px">
      <Header title="Educational Program" subtitle="List of Educational Programs" />
      <TextField
        name="name"
        label="Program Name"
        variant="outlined"
        fullWidth
        value={program.name}
        onChange={handleChange}
        sx={{ mb: 2 }} 
      />
      <TextField
        name="code"
        label="Program Code"
        variant="outlined"
        fullWidth
        value={program.code}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        name="educationFieldCode"
        label="Education Field Code"
        variant="outlined"
        fullWidth
        value={program.educationFieldCode}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        name="educationFieldName"
        label="Education Field Name"
        variant="outlined"
        fullWidth
        value={program.educationFieldName}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        name="trainingDirectionCode"
        label="Training Direction Code"
        variant="outlined"
        fullWidth
        value={program.trainingDirectionCode}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        name="trainingDirectionName"
        label="Training Direction Name"
        variant="outlined"
        fullWidth
        value={program.trainingDirectionName}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        name="programGroup"
        label="Program Group"
        variant="outlined"
        fullWidth
        value={program.programGroup}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        name="iscedLevel"
        label="ISCED Level"
        variant="outlined"
        type="number"
        fullWidth
        value={program.iscedLevel}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        name="nqfLevel"
        label="NQF Level"
        variant="outlined"
        type="number"
        fullWidth
        value={program.nqfLevel}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        name="sqfLevel"
        label="SQF Level"
        variant="outlined"
        type="number"
        fullWidth
        value={program.sqfLevel}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        name="studyDurationYears"
        label="Study Duration (Years)"
        variant="outlined"
        type="number"
        fullWidth
        value={program.studyDurationYears}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        name="credits"
        label="Credits"
        variant="outlined"
        type="number"
        fullWidth
        value={program.credits}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        name="createdById"
        label="Created By ID"
        variant="outlined"
        type="number"
        fullWidth
        value={program.createdById}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      {/* Create Button */}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleCreateProgram}
        sx={{ mb: 2 }} 
      >
        Create Program
      </Button>
      <Box
        m="0 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
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
      >
        <DataGrid rows={programs} columns={columns} />
      </Box>
    </Box>
  );
};

export default Programs;
