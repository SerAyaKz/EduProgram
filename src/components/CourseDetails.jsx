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
import { useTranslation } from 'react-i18next';

const CourseDetails = ({ courses, programId, onRefresh }) => {
  const { t, i18n } = useTranslation();
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

  const dbUser = JSON.parse(localStorage.getItem('dbUser'));

  const fetchAvailableCourses = async () => {
    try {
      const response = await fetch(`http://localhost:8081/course/user/${dbUser.id}`);
      if (!response.ok) throw new Error("Failed to fetch available courses");
      const data = await response.json();
      setAvailableCourses(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
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
      alert(t('course.pleaseSelectCourse', { defaultValue: 'Please select a course' }));
      return;
    }
    
    currentCourseProgram.id ? await updateCourseProgram(currentCourseProgram) : await createCourseProgram(currentCourseProgram);
    resetForm();
    await onRefresh();
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

  // The backend's CourseProgramDto expects a nested `course` object
  // (matching CourseDto), not a flat `courseId`, so translate the form's
  // internal shape into that before sending.
  const toCourseProgramDto = (courseProgram) => {
    const { courseId, ...rest } = courseProgram;
    return {
      ...rest,
      programId,
      course: { id: courseId },
    };
  };

  const createCourseProgram = async (courseProgram) => {
    try {
      const response = await fetch(`http://localhost:8081/courseProgram`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toCourseProgramDto(courseProgram)),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create course program");
      }
    } catch (error) {
      console.error("Error creating course program:", error);
      alert(t('course.errorPrefix', { error: error.message, defaultValue: `Error: ${error.message}` }));
    }
  };

  const updateCourseProgram = async (courseProgram) => {
    try {
      const response = await fetch(`http://localhost:8081/courseProgram/${courseProgram.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toCourseProgramDto(courseProgram)),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update course program");
      }
    } catch (error) {
      console.error("Error updating course program:", error);
      alert(t('course.errorPrefix', { error: error.message, defaultValue: `Error: ${error.message}` }));
    }
  };

  const deleteCourseProgram = async (id) => {
    if (window.confirm(t('course.deleteCourseConfirmation', { defaultValue: 'Are you sure you want to delete this course?' }))) {
      try {
        const response = await fetch(`http://localhost:8081/courseProgram/${id}`, { method: 'DELETE' });
        
        if (!response.ok) {
          throw new Error("Failed to delete course program");
        }
        
        await onRefresh();
      } catch (error) {
        console.error("Error deleting course program:", error);
        alert(t('course.errorPrefix', { error: error.message, defaultValue: `Error: ${error.message}` }));
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
      
      alert(t('course.outcomesGeneratedSuccess', { defaultValue: 'Learning outcomes generated successfully!' }));
    } catch (error) {
      console.error("Error generating learning outcomes:", error);
      alert(t('course.errorPrefix', { error: error.message, defaultValue: `Error: ${error.message}` }));
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
      
      await onRefresh();
      alert(t('course.coursesGeneratedSuccess', { defaultValue: 'Courses generated successfully!' }));
    } catch (error) {
      console.error("Error generating courses:", error);
      alert(t('course.errorPrefix', { error: error.message, defaultValue: `Error: ${error.message}` }));
    }
  };

  const editCourseProgram = (courseProgram) => {
    const course = availableCourses.find(c => c.id === courseProgram.course?.id) || courseProgram.course;
    setSelectedCourse(course);
    setCurrentCourseProgram({
      id: courseProgram.id,
      year: courseProgram.year,
      term: courseProgram.term,
      creditCount: courseProgram.creditCount,
      programId,
      courseId: courseProgram.course?.id
    });
  };

  return (
    <Box>
      
      
      <Box elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" mb={2}>
          {currentCourseProgram.id
            ? t('course.updateCourse', { defaultValue: 'Update Course' })
            : t('course.addNewCourse', { defaultValue: 'Add New Course' })}
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={showAdvanced ? 6 : 12}>
              <Autocomplete
                id="course-select"
                options={availableCourses}
                getOptionLabel={(option) =>
  `${option.code} - ${
    i18n.language === "ru"
      ? option.nameRu
      : i18n.language === "kk"
        ? option.nameKz
        : option.nameEn
  }`
}
                value={selectedCourse}
                onChange={handleCourseChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    fullWidth
                    label={t('course.selectCourse', { defaultValue: 'Select Course' })}
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
                    label={t('course.year', { defaultValue: 'Year' })}
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
                    label={t('course.term', { defaultValue: 'Term' })}
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
                    label={t('course.creditCount', { defaultValue: 'Credit Count' })}
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
                  {currentCourseProgram.id
                    ? t('course.updateCourse', { defaultValue: 'Update Course' })
                    : t('course.addCourse', { defaultValue: 'Add Course' })}
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  {showAdvanced
                    ? t('course.hideAdvancedEdit', { defaultValue: 'Hide Advanced Edit' })
                    : t('course.showAdvancedEdit', { defaultValue: 'Show Advanced Edit' })}
                </Button>
                
                {currentCourseProgram.id && (
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={resetForm}
                  >
                    {t('course.cancel', { defaultValue: 'Cancel' })}
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
      
      <Box display="flex" justifyContent="space-around" alignItems="center" mb={2}>
        <Typography variant="h6">
          {t('course.courseList', { count: courses.length, defaultValue: `Course List (${courses.length})` })}
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AutorenewIcon />}
          onClick={generateCourses}
        >
          {t('course.generateCourses', { defaultValue: 'Generate Courses' })}
        </Button>
      </Box>
      
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{t('course.code', { defaultValue: 'Code' })}</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{t('course.name', { defaultValue: 'Name' })}</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{t('course.year', { defaultValue: 'Year' })}</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{t('course.term', { defaultValue: 'Term' })}</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{t('course.credits', { defaultValue: 'Credits' })}</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{t('course.actions', { defaultValue: 'Actions' })}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {courses.length > 0 ? (
            courses.map((courseProgram) => {
              // The API returns the course data nested directly on each
              // course-program record, so use it as-is rather than looking
              // it up in availableCourses (that list is only for the
              // "select a course to add" autocomplete above).
              const course = courseProgram.course;

              // Resolve the display name based on the active app language,
              // same fallback pattern used elsewhere (Job/Standard/Outcome).
              const courseName = course
                ? (i18n.language === 'ru'
                    ? course.nameRu
                    : i18n.language === 'kk'
                      ? course.nameKz
                      : course.nameEn)
                : null;

              return (
                <TableRow key={courseProgram.id} hover>
                  <TableCell>
                    <Chip label={course?.code || t('course.notAvailable', { defaultValue: 'N/A' })} size="small" color="white" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <TruncatedText text={courseName || t('course.notAvailable', { defaultValue: 'N/A' })} maxLength={80} />
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
                        {t('course.generateOutcomes', { defaultValue: 'Generate Outcomes' })}
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
                  {t('course.noCoursesAvailable', { defaultValue: 'No courses added yet. Add a course or generate courses.' })}
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