import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel,
  Grid,
  Paper,
  Typography,
  Autocomplete,
  IconButton,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import AddIcon from '@mui/icons-material/Add';
import TruncatedText from './TruncatedText';

const CourseDetails = ({ programId }) => {
  const [programCourses, setProgramCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [currentCourseProgram, setCurrentCourseProgram] = useState({
    id: null,
    year: 1,
    term: 1,
    creditCount: 3,
    programId,
    courseId: ''
  });
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchProgramCourses = async () => {
    try {
      const response = await fetch(`http://localhost:8081/programs/courseProgram/${programId}`);
      if (!response.ok) throw new Error("Failed to fetch program courses");
      const data = await response.json();
      setProgramCourses(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchAvailableCourses = async () => {
    try {
      const response = await fetch(`http://localhost:8081/course`);
      if (!response.ok) throw new Error("Failed to fetch available courses");
      const data = await response.json();
      setAvailableCourses(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchProgramCourses();
    fetchAvailableCourses();
  }, [programId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentCourseProgram({ ...currentCourseProgram, [name]: value });
  };

  const handleCourseChange = (event, value) => {
    if (value) {
      setSelectedCourse(value);
      setCurrentCourseProgram({ ...currentCourseProgram, courseId: value.id });
    } else {
      setSelectedCourse(null);
      setCurrentCourseProgram({ ...currentCourseProgram, courseId: '' });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!currentCourseProgram.courseId) {
      alert("Please select a course");
      return;
    }
    
    currentCourseProgram.id ? await updateCourseProgram(currentCourseProgram) : await createCourseProgram(currentCourseProgram);
    resetForm();
    fetchProgramCourses();
  };

  const resetForm = () => {
    setCurrentCourseProgram({
      id: null,
      year: 1,
      term: 1,
      creditCount: 3,
      programId,
      courseId: ''
    });
    setSelectedCourse(null);
  };

  const createCourseProgram = async (courseProgram) => {
    try {
      const response = await fetch(`http://localhost:8081/courseProgram`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...courseProgram, programId }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create course program");
      }
    } catch (error) {
      console.error("Error creating course program:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const updateCourseProgram = async (courseProgram) => {
    try {
      const response = await fetch(`http://localhost:8081/courseProgram/${courseProgram.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...courseProgram, programId }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update course program");
      }
    } catch (error) {
      console.error("Error updating course program:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const deleteCourseProgram = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        const response = await fetch(`http://localhost:8081/courseProgram/${id}`, { method: 'DELETE' });
        
        if (!response.ok) {
          throw new Error("Failed to delete course program");
        }
        
        fetchProgramCourses();
      } catch (error) {
        console.error("Error deleting course program:", error);
        alert(`Error: ${error.message}`);
      }
    }
  };

  const generateLearningOutcomes = async (courseProgramId) => {
    try {
      const response = await fetch(`http://localhost:8081/courseProgram/${courseProgramId}/generateOutcomes`, { 
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate learning outcomes");
      }
      
      alert("Learning outcomes generated successfully!");
    } catch (error) {
      console.error("Error generating learning outcomes:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const generateCourses = async () => {
    try {
      const response = await fetch(`http://localhost:8081/courseProgram/generate/${programId}`, { 
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error("Failed to generate courses");
      }
      
      fetchProgramCourses();
      alert("Courses generated successfully!");
    } catch (error) {
      console.error("Error generating courses:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const editCourseProgram = (courseProgram) => {
    const course = availableCourses.find(c => c.id === courseProgram.courseId);
    setSelectedCourse(course);
    setCurrentCourseProgram({
      id: courseProgram.id,
      year: courseProgram.year,
      term: courseProgram.term,
      creditCount: courseProgram.creditCount,
      programId,
      courseId: courseProgram.courseId
    });
  };

  return (
    <Box>
      
      
      <Box elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" mb={2}>
          {currentCourseProgram.id ? 'Update Course' : 'Add New Course'}
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={showAdvanced ? 6 : 12}>
              <Autocomplete
                id="course-select"
                options={availableCourses}
                getOptionLabel={(option) => `${option.code} - ${option.nameEn}`}
                value={selectedCourse}
                onChange={handleCourseChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    fullWidth
                    label="Select Course"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            
            {showAdvanced && (
              <>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Year"
                    name="year"
                    type="number"
                    value={currentCourseProgram.year}
                    onChange={handleInputChange}
                    InputProps={{ inputProps: { min: 1, max: 4 } }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Term"
                    name="term"
                    type="number"
                    value={currentCourseProgram.term}
                    onChange={handleInputChange}
                    InputProps={{ inputProps: { min: 1, max: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Credit Count"
                    name="creditCount"
                    type="number"
                    value={currentCourseProgram.creditCount}
                    onChange={handleInputChange}
                    InputProps={{ inputProps: { min: 1, max: 10 } }}
                  />
                </Grid>
              </>
            )}
            
            <Grid item xs={12}>
              <Box display="flex" gap={2}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  color={currentCourseProgram.id ? "secondary" : "primary"}
                >
                  {currentCourseProgram.id ? 'Update Course' : 'Add Course'}
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced ? "Hide Advanced Edit" : "Show Advanced Edit"}
                </Button>
                
                {currentCourseProgram.id && (
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
      
      <Box display="flex" justifyContent="space-around" alignItems="center" mb={2}>
        <Typography variant="h6">
          Course List ({programCourses.length})
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AutorenewIcon />}
          onClick={generateCourses}
        >
          Generate Courses
        </Button>
      </Box>
      
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Code</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name (English)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Year</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Term</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Credits</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {programCourses.length > 0 ? (
            programCourses.map((courseProgram) => {
              // Find the matching course from availableCourses
              const course = availableCourses.find(c => c.id === courseProgram.courseId);

              return (
                <TableRow key={courseProgram.id} hover>
                  <TableCell>
                    <Chip label={course?.code || "N/A"} size="small" color="white" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <TruncatedText text={course?.nameEn || "N/A"} maxLength={80} />
                  </TableCell>
                  <TableCell>{courseProgram.year}</TableCell>
                  <TableCell>{courseProgram.term}</TableCell>
                  <TableCell>{courseProgram.creditCount}</TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton 
                        size="small" 
                        color="secondary"
                        onClick={() => editCourseProgram(courseProgram)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => deleteCourseProgram(courseProgram.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="white"
                        onClick={() => generateLearningOutcomes(courseProgram.id)}
                      >
                        Generate Outcomes
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  No courses added yet. Add a course or generate courses.
                </Typography>
              </TableCell>
            </TableRow>
          )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CourseDetails;