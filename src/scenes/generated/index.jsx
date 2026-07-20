import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
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
import { useTranslation } from "react-i18next";

const Generated = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { program_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [programData, setProgramData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
//Language
  const { t,i18n  } = useTranslation();

// Fetching
const fetchProgramData = async () => {
  try {
    setLoading(true);

    const response = await fetch(
      `http://localhost:8081/program/data/${program_id}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch program details");
    }

    const data = await response.json();
    setProgramData(data);
  } catch (error) {
    console.error("Error fetching program details:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchProgramData();
}, [program_id]);


const sections = [
  {
    id: "job",
    title: t("generated.jobs"),
    icon: <WorkIcon />,
    component: (
      <JobDetails
        jobs={programData?.jobs ?? []}
        programId={program_id}
        onRefresh={fetchProgramData}
      />
    ),
  },
  {
    id: "standard",
    title: t("generated.standards"),
    icon: <LibraryBooksIcon />,
    component: <StandardDetails
  standards={programData?.standards ?? []}
  programId={program_id}
  onRefresh={fetchProgramData}
/>,
  },
  {
    id: "outcome",
    title: t("generated.learningOutcomes"),
    icon: <SchoolIcon />,
    component: <OutcomeDetails
      outcomes={programData?.outcomes ?? []}
      programId={program_id}
      onRefresh={fetchProgramData}
    />,
  },
  {
    id: "courses",
    title: t("generated.courses"),
    icon: <AssignmentIcon />,
    component: <CourseDetails courses={programData?.courses ?? []} />,
  },
];

  // useEffect(() => {
  //   const fetchProgramDetails = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:8081/program/data/${program_id}`);
  //       if (!response.ok) throw new Error("Failed to fetch program details");
  //       const data = await response.json();
  //       setProgramData(data);
  //     } catch (error) {
  //       console.error("Error fetching program details:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProgramDetails();
  // }, [program_id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>{t("generated.loadingProgramData")}</Typography>
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
             {t("navigation.dashboard")}
          </Link>
          <Link
            color="inherit"
            sx={{ display: 'flex', alignItems: 'center' }}
            onClick={() => navigate('/program')}
            underline="hover"
          >
            {t("navigation.programs")}
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            {t("navigation.programDetails")}
          </Typography>
        </Breadcrumbs>
        
        <Typography variant="h4" sx={{ mt: 2, fontWeight: 600 }}>
          {programData?.program?.codeName}
        </Typography>
        {/* I would like to change based on language eduGoalKz eduGoalRu */}
        <Typography variant="body1" color="text.secondary">
          {i18n.language === 'ru'
    ? programData?.program?.eduGoalRu
    : i18n.language === 'kk'
    ? programData?.program?.eduGoalKz
    : programData?.program?.eduGoalEn}
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