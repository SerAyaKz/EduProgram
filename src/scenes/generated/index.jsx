import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Button,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Breadcrumbs,
  Link,
  Paper,
  Fade
} from "@mui/material";
import { tokens } from "../../theme";
import { useParams, useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import WorkIcon from '@mui/icons-material/Work';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import JobDetails from '../../components/JobDetails';
import StandardDetails from '../../components/StandardDetails';
import OutcomeDetails from '../../components/OutcomeDetails';
import CourseDetails from '../../components/CourseDetails';

const Generated = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { program_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [programData, setProgramData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const sections = [
    { id: "job", title: "Jobs", icon: <WorkIcon />, component: <JobDetails programId={program_id} /> },
    { id: "standard", title: "Standards", icon: <LibraryBooksIcon />, component: <StandardDetails programId={program_id}/> },
    { id: "outcome", title: "Learning Outcomes", icon: <SchoolIcon />, component: <OutcomeDetails programId={program_id}/> },
    { id: "courses", title: "Courses", icon: <AssignmentIcon />, component: <CourseDetails programId={program_id} /> },
  ];

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8081/programs/${program_id}`);
        if (!response.ok) throw new Error("Failed to fetch program details");
        const data = await response.json();
        setProgramData(data);
      } catch (error) {
        console.error("Error fetching program details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgramDetails();
  }, [program_id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading program data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "1400px", mx: "auto", px: 3, py: 2 }}>
      {/* Breadcrumbs Navigation */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: colors.primary[400] }}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link 
            color="inherit" 
            sx={{ display: 'flex', alignItems: 'center' }}
            onClick={() => navigate('/')}
            underline="hover"
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Dashboard
          </Link>
          <Link
            color="inherit"
            sx={{ display: 'flex', alignItems: 'center' }}
            onClick={() => navigate('/programs')}
            underline="hover"
          >
            Programs
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            {programData?.nameEn || "Program Details"}
          </Typography>
        </Breadcrumbs>
        
        <Typography variant="h4" sx={{ mt: 2, fontWeight: 600 }}>
          {programData?.nameEn || "Program Details"}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {programData?.description || "Manage program components and generate curriculum"}
        </Typography>
      </Paper>

      {/* Tabs Navigation */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: colors.primary[400],
            color: colors.blueAccent[500] ,

          }}
        >
          {sections.map((section, index) => (
            <Tab 
              key={section.id}
              label={section.title}
              icon={section.icon}
              iconPosition="start"
              sx={{ 
                minHeight: 64,
                textTransform: 'none',
                fontSize: '1rem',
                "&.Mui-selected": { 
      color: colors.blueAccent[500], 
    }
              }}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Content Sections */}
      {sections.map((section, index) => (
        <Fade in={activeTab === index} key={section.id} timeout={300}>
          <Box 
            sx={{ 
              display: activeTab === index ? 'block' : 'none',
              bgcolor: colors.primary[400],
              borderRadius: 2,
              overflow: 'hidden'
            }}
          >
            {section.component}
          </Box>
        </Fade>
      ))}
    </Box>
  );
};

export default Generated;