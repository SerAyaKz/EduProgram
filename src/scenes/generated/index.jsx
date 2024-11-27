import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Button,
  Typography,
} from "@mui/material";
import { tokens } from "../../theme";
import { useParams } from "react-router-dom";
import JobDetails from '../../components/JobDetails';

const Job = () => (
  <Box>
    <Typography variant="h5">Job</Typography>
    <Typography>Job-specific content goes here...</Typography>
  </Box>
);

const Skill = () => (
  <Box>
    <Typography variant="h5">Skill</Typography>
    <Typography>Skill-specific content goes here...</Typography>
  </Box>
);

const Competency = () => (
  <Box>
    <Typography variant="h5">Competency</Typography>
    <Typography>Competency-specific content goes here...</Typography>
  </Box>
);

const TeachingResult = () => (
  <Box>
    <Typography variant="h5">Teaching Result</Typography>
    <Typography>Teaching result-specific content goes here...</Typography>
  </Box>
);

const CoursesComponent = () => (
  <Box>
    <Typography variant="h5">Courses Component</Typography>
    <Typography>Courses component-specific content goes here...</Typography>
  </Box>
);

const Generated = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { program_id } = useParams();
  const [loading, setLoading] = useState(true);

  const sections = [
    { id: "job", title: "Job", component: <JobDetails /> },
    { id: "skill", title: "Skill", component: <Skill /> },
    { id: "competency", title: "Competency", component: <Competency /> },
    { id: "teachingResult", title: "Teaching Result", component: <TeachingResult /> },
    { id: "coursesComponent", title: "Courses Component", component: <CoursesComponent /> },
  ];

  const navigateToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Simulate data fetch
    setTimeout(() => setLoading(false), 1000); // Mock loading delay
  }, [program_id]);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Box m="20px">
      {/* Sticky Navigation Bar */}
      <Box
        position="sticky"
        top="0"
        zIndex="1000"
        bgcolor={colors}
        p="10px"
        boxShadow={2}
        display="flex"
        gap="10px"
      >
        {sections.map((section) => (
          <Button
            key={section.id}
            variant="contained"
            onClick={() => navigateToSection(section.id)}
          >
            Go to {section.title}
          </Button>
        ))}
      </Box>

      {/* Render Each Section */}
      {sections.map((section) => (
        <Box
          key={section.id}
          id={section.id}
          mb="20px"
          p="20px"
          border={`1px solid ${colors.grey[300]}`}
          borderRadius="8px"
          boxShadow={1}
        >
          {section.component}
        </Box>
      ))}
    </Box>
  );
};

export default Generated;
