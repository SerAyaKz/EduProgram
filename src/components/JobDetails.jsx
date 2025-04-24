import React, { useState, useEffect } from 'react'; 
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  TextField, 
  IconButton,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  CircularProgress,
  Alert,
  Collapse,
  Chip,
  Grid,
  Divider,
  useTheme,
  List,
  ListItem,
  ListItemText,
  InputAdornment
} from '@mui/material';
import { tokens } from "../theme";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import WorkIcon from '@mui/icons-material/Work';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import BuildIcon from '@mui/icons-material/Build';
import SearchIcon from '@mui/icons-material/Search';
import TruncatedText from './TruncatedText';
import atlasProfessions from '../data/atlas_professions.json';

const JobDetails = ({ programId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState({ 
    id: null, 
    name: '', 
    description: '', 
    job_type: '', 
    // skills: '', 
    programId: Number(programId)
  });

  // Atlas search states
  const [atlasSearchOpen, setAtlasSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [creatingJob, setCreatingJob] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8081/programs/job/${programId}`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const data = await response.json();
      setJobs(data);
      setError(null);
    } catch (error) {
      console.error(error.message);
      setError(`Error loading jobs: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [programId]);

  // Search through Atlas professions
  useEffect(() => {
    if (searchQuery.trim()) {
      const filteredResults = atlasProfessions.filter(profession => {
        const title = profession.title[selectedLanguage] || profession.title.en || profession.title.ru;
        return title.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, selectedLanguage]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentJob({ ...currentJob, [name]: value });
  };

  const handleFormOpen = (job = null) => {
    if (job) {
      setCurrentJob({
        id: job.id,
        name: job.name || '',
        description: job.description || '',
        job_type: job.job_type || '',
        // skills: job.skills || '',
        programId: Number(programId)
      });
    } else {
      setCurrentJob({ 
        id: null, 
        name: '', 
        description: '', 
        job_type: '', 
        // skills: '', 
        programId: Number(programId)
      });
    }
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (currentJob.id) {
        await updateJob(currentJob);
      } else {
        await createJob(currentJob);
      }
      setFormOpen(false);
      fetchJobs();
    } catch (error) {
      setError(`Failed to save job: ${error.message}`);
    }
  };

  const createJob = async (job) => {
    const response = await fetch(`http://localhost:8081/job`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  };

  const updateJob = async (job) => {
    console.log(job)
    const response = await fetch(`http://localhost:8081/job/${job.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:8081/job/${deleteId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      fetchJobs();
    } catch (error) {
      setError(`Failed to delete job: ${error.message}`);
    } finally {
      setOpenDialog(false);
      setDeleteId(null);
    }
  };

  const generateJobs = async () => {
    setGenerating(true);
    try {
      const response = await fetch(`http://localhost:8081/job/generate/${programId}`, { method: 'POST' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      fetchJobs();
    } catch (error) {
      setError(`Failed to generate jobs: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const generateSkills = async () => {
    setGenerating(true);
    try {
      const response = await fetch(`http://localhost:8081/job/skills/generate/${programId}`, { method: 'POST' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      fetchJobs();
    } catch (error) {
      setError(`Failed to generate skills: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleOpenAtlasSearch = () => {
    setAtlasSearchOpen(true);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleCloseAtlasSearch = () => {
    setAtlasSearchOpen(false);
  };

  const handleSelectProfession = async (profession) => {
    const title = profession.title[selectedLanguage] || profession.title.en || profession.title.ru;
    const description = profession.description[selectedLanguage] || profession.description.en || profession.description.ru;
    
    const newJob = {
      name: title,
      description: description,
      job_type: 'atlas',
      programId: Number(programId)
    };
    
    setCreatingJob(true);
    try {
      await createJob(newJob);
      fetchJobs();
      setAtlasSearchOpen(false);
    } catch (error) {
      setError(`Failed to add job from Atlas: ${error.message}`);
    } finally {
      setCreatingJob(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <WorkIcon sx={{ mr: 1 }} />
            Job Management
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Define and manage job roles relevant to this program. Jobs can be created manually or imported from Atlas.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={() => handleFormOpen()} 
              sx={{ bgcolor: colors.greenAccent[600] }}
            >
              Add Job
            </Button>
            <Button 
              variant="contained" 
              startIcon={<SearchIcon />} 
              onClick={handleOpenAtlasSearch}
              sx={{ bgcolor: colors.blueAccent[600] }}
            >
              Search Atlas
            </Button>
            <Button 
              variant="contained" 
              startIcon={<AutoFixHighIcon />} 
              onClick={generateJobs}
              disabled={generating}
              sx={{ bgcolor: colors.blueAccent[500] }}
            >
              {generating ? <CircularProgress size={24} color="inherit" /> : "Generate Jobs"}
            </Button>
            <Button 
              variant="contained" 
              startIcon={<BuildIcon />} 
              onClick={generateSkills}
              disabled={generating}
              sx={{ bgcolor: colors.blueAccent[700] }}
            >
              {generating ? <CircularProgress size={24} color="inherit" /> : "Generate Skills"}
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Error message */}
      <Collapse in={!!error}>
        <Alert 
          severity="error" 
          action={
            <IconButton size="small" color="inherit" onClick={() => setError(null)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      </Collapse>

      {/* Jobs table */}
      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: colors.blueAccent[700] }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Job Title</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Job Type</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={30} />
                  <Typography sx={{ mt: 1 }}>Loading jobs...</Typography>
                </TableCell>
              </TableRow>
            ) : jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  <Typography>No jobs available. Add a job, search Atlas, or generate jobs.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.id} hover>
                  <TableCell sx={{ fontWeight: 'medium' }}>{job.name}</TableCell>
                  <TableCell>
                    <TruncatedText text={job.description} maxLength={100} />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={job.job_type || "Not specified"} 
                      size="small"
                      color={job.job_type === "atlas" ? "success" : job.job_type ? "primary" : "default"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleFormOpen(job)} size="small" sx={{ mr: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDeleteClick(job.id)} size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Job form dialog */}
      <Dialog open={formOpen} onClose={handleFormClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentJob.id ? 'Edit Job' : 'Add New Job'}
          <IconButton
            aria-label="close"
            onClick={handleFormClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  label="Job Title"
                  name="name"
                  fullWidth
                  value={currentJob.name}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  fullWidth
                  multiline
                  rows={4}
                  value={currentJob.description}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Job Type"
                  name="job_type"
                  fullWidth
                  value={currentJob.job_type}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              {/* <Grid item xs={12} md={6}>
                <TextField
                  label="Required Skills"
                  name="skills"
                  fullWidth
                  multiline
                  rows={2}
                  value={currentJob.skills}
                  onChange={handleInputChange}
                  variant="outlined"
                  helperText="Enter skills separated by commas"
                />
              </Grid> */}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleFormClose} color="inherit">Cancel</Button>
            <Button onClick={handleOpenAtlasSearch} color="primary">
              Search Atlas
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {currentJob.id ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this job? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Atlas Search Dialog */}
      <Dialog open={atlasSearchOpen} onClose={handleCloseAtlasSearch} maxWidth="md" fullWidth>
        <DialogTitle>
          Search Atlas Professions
          <IconButton
            aria-label="close"
            onClick={handleCloseAtlasSearch}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                fullWidth
                label="Search for job titles"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                placeholder="Type to search..."
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip 
                  label="English" 
                  variant={selectedLanguage === 'en' ? 'filled' : 'outlined'}
                  color={selectedLanguage === 'en' ? 'primary' : 'default'}
                  onClick={() => setSelectedLanguage('en')}
                  clickable
                />
                <Chip 
                  label="Russian" 
                  variant={selectedLanguage === 'ru' ? 'filled' : 'outlined'}
                  color={selectedLanguage === 'ru' ? 'primary' : 'default'}
                  onClick={() => setSelectedLanguage('ru')}
                  clickable
                />
                <Chip 
                  label="Kazakh" 
                  variant={selectedLanguage === 'kk' ? 'filled' : 'outlined'}
                  color={selectedLanguage === 'kk' ? 'primary' : 'default'}
                  onClick={() => setSelectedLanguage('kk')}
                  clickable
                />
              </Box>
            </Grid>
          </Grid>

          {searchResults.length > 0 ? (
            <List>
              {searchResults.map((profession) => {
                const title = profession.title[selectedLanguage] || profession.title.en || profession.title.ru;
                const industry = profession.industry[selectedLanguage] || profession.industry.en || profession.industry.ru;
                
                return (
                  <ListItem 
                    key={profession.id} 
                    button 
                    onClick={() => handleSelectProfession(profession)}
                    disabled={creatingJob}
                    divider
                    sx={{
                      '&:hover': {
                        bgcolor: colors.blueAccent[50],
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          {title}
                        </Typography>
                      }
                      secondary={
                        <Typography component="span" variant="body2" color="text.secondary">
                          {industry}
                        </Typography>
                      }
                    />
                    {creatingJob && (
                      <CircularProgress size={20} color="inherit" sx={{ ml: 2 }} />
                    )}
                  </ListItem>
                );
              })}
            </List>
          ) : searchQuery.trim() ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="text.secondary">No matching jobs found. Try a different search term.</Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="text.secondary">Type to search for jobs in Atlas.</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseAtlasSearch} color="inherit">Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobDetails;