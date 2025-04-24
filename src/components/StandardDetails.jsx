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
  Grid,
  Divider,
  useTheme,
  InputAdornment,
  Link
} from '@mui/material';
import { tokens } from "../theme";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SearchIcon from '@mui/icons-material/Search';
import LinkIcon from '@mui/icons-material/Link';
import LaunchIcon from '@mui/icons-material/Launch';

// Import professional standards data
import profStandardsData from '../data/prof_standard.json';

const StandardDetails = ({ programId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [standards, setStandards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [currentStandard, setCurrentStandard] = useState({ 
    id: null, 
    nameKz: '', 
    nameRu: '', 
    nameEn: '', 
    programId,
    url: '' // Added URL field
  });

  // For professional standards search
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchStandards = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8081/programs/standard/${programId}`);
      if (!response.ok) throw new Error("Failed to fetch standards");
      const data = await response.json();
      setStandards(data);
      setError(null);
    } catch (error) {
      console.error(error.message);
      setError(`Error loading standards: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandards();
  }, [programId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentStandard({ ...currentStandard, [name]: value });
  };

  const handleFormOpen = (standard = null) => {
    if (standard) {
      setCurrentStandard({
        id: standard.id,
        nameKz: standard.nameKz || '',
        nameRu: standard.nameRu || '',
        nameEn: standard.nameEn || '',
        programId,
        url: standard.url || ''
      });
    } else {
      setCurrentStandard({ id: null, nameKz: '', nameRu: '', nameEn: '', programId, url: '' });
    }
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (currentStandard.id) {
        await updateStandard(currentStandard);
      } else {
        await createStandard(currentStandard);
      }
      setFormOpen(false);
      fetchStandards();
    } catch (error) {
      setError(`Failed to save standard: ${error.message}`);
    }
  };

  const createStandard = async (standard) => {
    const response = await fetch(`http://localhost:8081/standard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...standard, programId }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  };

  const updateStandard = async (standard) => {
    const response = await fetch(`http://localhost:8081/standard/${standard.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...standard, programId }),
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
      const response = await fetch(`http://localhost:8081/standard/${deleteId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      fetchStandards();
    } catch (error) {
      setError(`Failed to delete standard: ${error.message}`);
    } finally {
      setOpenDialog(false);
      setDeleteId(null);
    }
  };

  const generateStandards = async () => {
    setGenerating(true);
    try {
      const response = await fetch(`http://localhost:8081/standard/generate/${programId}`, { method: 'POST' });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      fetchStandards();
    } catch (error) {
      setError(`Failed to generate standards: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  // Professional Standards search functions
  const handleSearchDialogOpen = () => {
    setSearchDialogOpen(true);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearchDialogClose = () => {
    setSearchDialogOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    
    // Search logic for professional standards
    const query = searchQuery.toLowerCase();
    const results = profStandardsData.filter(standard => 
      standard.name_ru.toLowerCase().includes(query) || 
      standard.name_en.toLowerCase().includes(query) || 
      standard.name_kk.toLowerCase().includes(query) ||
      standard.code_ps.toLowerCase().includes(query)
    );

    setSearchResults(results);
    setSearchLoading(false);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectProfStandard = (profStandard) => {
    setCurrentStandard({
      id: null,
      nameKz: profStandard.name_kk || '',
      nameRu: profStandard.name_ru || '',
      nameEn: profStandard.name_en || '',
      programId,
      url: profStandard.url || ''
    });
    
    setSearchDialogOpen(false);
    setFormOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LibraryBooksIcon sx={{ mr: 1 }} />
            Standards Management
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Define and manage educational standards for this program. Standards can be created manually, imported from professional standards, or generated automatically.
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
              Add Standard
            </Button>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearchDialogOpen}
              sx={{ bgcolor: colors.blueAccent[400] }}
            >
              Search Prof Standards
            </Button>
            <Button 
              variant="contained" 
              startIcon={<AutoFixHighIcon />} 
              onClick={generateStandards}
              disabled={generating}
              sx={{ bgcolor: colors.blueAccent[500] }}
            >
              {generating ? <CircularProgress size={24} color="inherit" /> : "Generate Standards"}
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

      {/* Standards table */}
      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: colors.blueAccent[700] }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name (Kazakh)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name (Russian)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name (English)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Source Link</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={30} />
                  <Typography sx={{ mt: 1 }}>Loading standards...</Typography>
                </TableCell>
              </TableRow>
            ) : standards.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography>No standards available. Add a standard, import from professional standards, or generate standards.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              standards.map((standard) => (
                <TableRow key={standard.id} hover>
                  <TableCell>{standard.nameKz}</TableCell>
                  <TableCell>{standard.nameRu}</TableCell>
                  <TableCell>{standard.nameEn}</TableCell>
                  <TableCell>
                    {standard.url ? (
                      <Link 
                        href={standard.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <LinkIcon fontSize="small" sx={{ mr: 0.5 }} />
                        View Source
                        <LaunchIcon fontSize="small" sx={{ ml: 0.5 }} />
                      </Link>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => handleFormOpen(standard)} size="small" sx={{ mr: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => handleDeleteClick(standard.id)} size="small" color="error">
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

      {/* Standard form dialog */}
      <Dialog open={formOpen} onClose={handleFormClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentStandard.id ? 'Edit Standard' : 'Add New Standard'}
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
                  label="Standard Name (Kazakh)"
                  name="nameKz"
                  fullWidth
                  value={currentStandard.nameKz}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Standard Name (Russian)"
                  name="nameRu"
                  fullWidth
                  value={currentStandard.nameRu}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Standard Name (English)"
                  name="nameEn"
                  fullWidth
                  value={currentStandard.nameEn}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Source URL (Optional)"
                  name="url"
                  fullWidth
                  value={currentStandard.url}
                  onChange={handleInputChange}
                  variant="outlined"
                  placeholder="https://example.com"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleFormClose} color="inherit">Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {currentStandard.id ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this standard? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Professional Standards Search Dialog */}
      <Dialog 
        open={searchDialogOpen} 
        onClose={handleSearchDialogClose}
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          Search Professional Standards
          <IconButton
            aria-label="close"
            onClick={handleSearchDialogClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <TextField
              autoFocus
              fullWidth
              label="Search by name or code"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Search by standard name (in any language) or code
            </Typography>
          </Box>

          {searchLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          ) : searchResults.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Name (RU)</TableCell>
                    <TableCell>Name (KZ)</TableCell>
                    <TableCell>Name (EN)</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchResults.map((result) => (
                    <TableRow key={result.id} hover>
                      <TableCell>{result.code_ps}</TableCell>
                      <TableCell>{result.name_ru}</TableCell>
                      <TableCell>{result.name_kk}</TableCell>
                      <TableCell>{result.name_en}</TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleSelectProfStandard(result)}
                        >
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : searchQuery ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography>No standards found for "{searchQuery}"</Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography>Enter a search term to find professional standards</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSearchDialogClose} color="inherit">Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StandardDetails;