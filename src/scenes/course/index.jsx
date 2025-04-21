import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  useTheme, 
  Snackbar, 
  Alert, 
  FormControlLabel, 
  Checkbox,
  Typography,
  Divider,
  Paper,
  Grid,
  ButtonGroup
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import AddIcon from '@mui/icons-material/Add';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:8081';

const initialCourseState = {
  id: null,
  code: "",
  nameKz: "",
  nameRu: "",
  nameEn: "",
  briefInfoKz: "",
  briefInfoRu: "",
  briefInfoEn: "",
  isSelective: false,
};

const Courses = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  // State Management
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(initialCourseState);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isEditing, setIsEditing] = useState(false);

  const dbUser = JSON.parse(localStorage.getItem('dbUser'));
  // API Calls
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/course/user/${dbUser.id}`);
      if (!response.ok) throw new Error("Failed to fetch courses");
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      showNotification("Error fetching courses: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (courseDataWithUser) => {
    const { userIds, ...courseData } = courseDataWithUser;

    try {
      const response = await fetch(`${API_URL}/course/user/${dbUser.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(courseData),
      });
      
      if (!response.ok) throw new Error("Failed to create course");
      showNotification("Course created successfully", "success");
      return true;
    } catch (error) {
      showNotification("Error creating course: " + error.message, "error");
      return false;
    }
  };

  const handleUpdateCourse = async (courseData) => {
    try {
      const response = await fetch(`${API_URL}/course/${courseData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) throw new Error("Failed to update course");
      showNotification("Course updated successfully", "success");
      return true;
    } catch (error) {
      showNotification("Error updating course: " + error.message, "error");
      return false;
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      const response = await fetch(`${API_URL}/course/user/${dbUser.id}`, { method: "DELETE" ,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(id)});

      if (!response.ok) throw new Error("Failed to delete course");
      setCourses((prevRows) => prevRows.filter((row) => row.id !== id));
      showNotification("Course deleted successfully", "success");
    } catch (error) {
      showNotification("Error deleting course: " + error.message, "error");
    }
  };

  const generateDescriptions = async () => {
    if (!course.nameEn) {
      showNotification("Please provide a course name in English first", "warning");
      return;
    }

    // In a real app, you might call an AI service or translation API here
    try {
      setLoading(true);
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, generate some placeholder content
      setCourse(prev => ({
        ...prev,
        briefInfoEn: prev.briefInfoEn || `This course covers key concepts in ${prev.nameEn}, preparing students for advanced studies in related fields.`,
        briefInfoRu: prev.briefInfoRu || `Этот курс охватывает ключевые концепции ${prev.nameEn}, готовя студентов к углубленному изучению смежных областей.`,
        briefInfoKz: prev.briefInfoKz || `Бұл курс ${prev.nameEn} негізгі тұжырымдамаларын қамтиды, студенттерді байланысты салаларда озық зерттеулерге дайындайды.`
      }));
      
      showNotification("Descriptions generated successfully", "success");
    } catch (error) {
      showNotification("Error generating descriptions", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setCourse(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEdit = (courseData) => {
    setCourse(courseData);
    setIsEditing(true);
    setShowAdvanced(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDuplicate = (courseData) => {
    const duplicatedCourse = {
      ...courseData,
      id: null,
      code: `${courseData.code}`,
      nameEn: `${courseData.nameEn}`,
      nameKz: `${courseData.nameKz}`,
      nameRu: `${courseData.nameRu}`,
      briefInfoEn: `${courseData.briefInfoEn}`,
      briefInfoKz: `${courseData.briefInfoKz}`,
      briefInfoRu: `${courseData.briefInfoRu}`

    };
    setCourse(duplicatedCourse);
    setIsEditing(false);
    setShowAdvanced(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    let success;
    if (course.id) {
      success = await handleUpdateCourse(course);
    } else {
      success = await handleCreateCourse(course);
    }
    
    if (success) {
      resetForm();
      fetchCourses();
    }
    
    setLoading(false);
  };

  const resetForm = () => {
    setCourse(initialCourseState);
    setIsEditing(false);
  };
  
  const switchToCreateMode = () => {
    // Preserve entered data but remove ID to switch to create mode
    setCourse(prev => ({
      ...prev,
      id: null
    }));
    setIsEditing(false);
    showNotification("Switched to create mode - submit to create as new course", "info");
  };

  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Effects
  useEffect(() => {
    fetchCourses();
  }, []);

  // DataGrid Configuration
  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "code", headerName: "Code", flex: 1 },
    { field: "nameEn", headerName: "Name (EN)", flex: 2 },
    { field: "nameKz", headerName: "Name (KZ)", flex: 1.5, hide: !showAdvanced },
    { field: "nameRu", headerName: "Name (RU)", flex: 1.5, hide: !showAdvanced },
    { field: "isSelective", headerName: "Selective", width: 100, type: "boolean" },
    {
      field: 'actions',
      headerName: "Actions",
      width: 150,
      type: 'actions',
      getActions: (params) => [
        <GridActionsCellItem 
          icon={<EditIcon />} 
          label="Edit" 
          onClick={() => handleEdit(params.row)} 
          color="white"
        />,
        <GridActionsCellItem 
          icon={<DeleteIcon />} 
          label="Delete" 
          onClick={() => handleDeleteCourse(params.id)}
          color="error"
        />,
        <GridActionsCellItem 
          icon={<FileCopyIcon />} 
          label="Duplicate" 
          onClick={() => handleDuplicate(params.row)}
          color="secondary"
        />,
      ],
    },
  ];

  return (
    <Box m="20px">
      <Header title="Courses" subtitle="Manage Course Offerings" />

        <Typography variant="h6" mb={2}>
          {isEditing ? "Edit Course" : "Create New Course"}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                name="code"
                label="Course Code"
                fullWidth
                required
                value={course.code}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="nameEn"
                label="Course Name (EN)"
                fullWidth
                required
                value={course.nameEn}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={course.isSelective}
                    onChange={(e) =>
                      setCourse({ ...course, isSelective: e.target.checked })
                    }
                    name="isSelective"
                  />
                }
                label="Elective Course"
              />
            </Grid>
          </Grid>

          <Box mt={2} mb={2}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setShowAdvanced(!showAdvanced)}
              endIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              sx={{ mr: 2 }}
            >
              {showAdvanced ? "Hide Advanced Fields" : "Show Advanced Fields"}
            </Button>
          </Box>

          {showAdvanced && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  name="nameKz"
                  label="Course Name (KZ)"
                  fullWidth
                  value={course.nameKz}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="nameRu"
                  label="Course Name (RU)"
                  fullWidth
                  value={course.nameRu}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" mt={2} mb={1}>
                  Course Description
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="briefInfoEn"
                  label="Brief Info (EN)"
                  fullWidth
                  multiline
                  rows={3}
                  value={course.briefInfoEn}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  name="briefInfoKz"
                  label="Brief Info (KZ)"
                  fullWidth
                  multiline
                  rows={3}
                  value={course.briefInfoKz}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  name="briefInfoRu"
                  label="Brief Info (RU)"
                  fullWidth
                  multiline
                  rows={3}
                  value={course.briefInfoRu}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={generateDescriptions}
                  startIcon={<AutoFixHighIcon />}
                  disabled={loading || !course.nameEn}
                >
                  Auto-Generate Descriptions
                </Button>
              </Grid>
            </Grid>
          )}

          <Box mt={3} display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              startIcon={<AddIcon />}
              disabled={loading || !course.code || !course.nameEn}
            >
              {isEditing ? "Update Course" : "Create Course"}
            </Button>

            {isEditing && (
              <Box display="flex" gap={2}>
                <Button
                  onClick={switchToCreateMode}
                  startIcon={<RestartAltIcon />}
                  color="success"
                  variant="outlined"
                >
                  Create as New
                </Button>
                <Button
                  onClick={resetForm}
                  startIcon={<CancelIcon />}
                  color="inherit"
                  variant="outlined"
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>
        </form>

      <Divider sx={{ mb: 4 }} />

      <Typography variant="h6" mb={2}>
        Course List
      </Typography>
      <Box height="60vh">
        <DataGrid
          rows={courses}
          columns={columns}
          loading={loading}
          disableSelectionOnClick
          autoHeight
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: "id", sort: "desc" }] },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
        />
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Courses;