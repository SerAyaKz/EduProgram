import React, { useState, useEffect } from 'react'; 
import { Box, useTheme, List, ListItem, ListItemText, Divider, Typography } from '@mui/material';
import { tokens } from '../../theme';
import { useParams } from 'react-router-dom';
import StandardDetails from '../../components/StandardDetails';
import SectionDetails from '../../components/SectionDetails';
import JobDetails from '../../components/JobDetails';

const standard = { id: 'standard', name: "Lists of Standards" };
const job = { id: 'job', name: "Job Listings" };
const course = { id: 'course', name: "Course Catalog" };
const items = [standard, job, course];

const NestedList = ({ sections, onSelect }) => {
  return (
    <List>
      {sections && sections.map((section) => (
        <React.Fragment key={section.id}>
          <ListItem button onClick={() => onSelect(section)}>
            <ListItemText
              primary={section.sectionTitle}
              style={{
                paddingLeft: `${(section.numbering.split('.').length - 1) * 20}px`,
                marginBottom: '8px'
              }}
            />
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
};



const Program = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedSection, setSelectedSection] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { program_id } = useParams();
//console.log(sections)
const handleSelect = (section) => {
  setSelectedSection(section);
};
const sectionComponents = {
  [standard.id]: (
    <>
      <Typography variant="h5">{standard.name}</Typography>
      <StandardDetails programId={program_id} />
    </>
  ),
  [job.id]: (
    <>
    <Typography variant="h5">{job.name}</Typography>
    <JobDetails programId={program_id} />
    </>
  ),
  [course.id]: (
    <>
    <Typography variant="h5">{course.name}</Typography>
    {/* <JobDetails programId={program_id} /> */}
    </>
  ),
};
  const fetchSections = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8081/programs/section/${program_id}`, {
        headers: {
          // Authorization: `Bearer ${token}`, 
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sections");
      }

      const data = await response.json();
      setSections(data);
      setSelectedSection(null);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id, updatedSection) => {
    console.log(updatedSection)
    try {
      await fetch(`http://localhost:8081/section/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSection),
      });
      fetchSections(); 
    } catch (error) {
      console.error("Error updating section:", error);
    }
  };

  const handleDelete = async (id) => {
    
    try {
      await fetch(`http://localhost:8081/section/${id}`, {
        method: 'DELETE',
      });
      fetchSections(); 
    } catch (error) {
      console.error("Error deleting section:", error);
    }
  };

  const handleCreate = async (newSection) => {
    console.log(newSection)
    try {
      await fetch(`http://localhost:8081/section`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSection),
      });
      fetchSections(); 
    } catch (error) {
      console.error("Error creating section:", error);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [program_id]);

  if (loading) {
    return <Typography variant="h6">Loading sections...</Typography>;
  }

  return (
    <Box m="20px" display="flex" borderRadius="5px" boxShadow={3}>
      <Box
        flex={1}
        bgcolor={`1px solid ${colors.grey[100]}`}
        borderRight={`1px solid ${colors.grey[300]}`}
        p="20px"
      >
        <Typography variant="h4">Sections</Typography>
        <NestedList sections={sections} onSelect={handleSelect} />
        <Divider />
        <List>
  {items.map((item) => (
    <ListItem button key={item.id} onClick={() => handleSelect(item)}>
      <ListItemText primary={item.name} />
    </ListItem>
  ))}
</List>
      </Box>
      <Box flex={2} p="20px">
      {selectedSection ? (
          selectedSection.id === standard.id || selectedSection.id === job.id || selectedSection.id === course.id ? (
            sectionComponents[selectedSection.id] || <Typography variant="h6">Content not available.</Typography>
          ) : (
            <SectionDetails
              section={selectedSection} // Assuming SectionDetails accepts a section prop
              onUpdate={handleUpdate} // Pass any necessary props for SectionDetails
              onDelete={handleDelete}
              onCreate={handleCreate}
              programId={program_id}
            />
          )
        ) : (
          <Typography variant="h6">Select a section to see the content.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Program;