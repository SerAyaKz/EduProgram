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
import { useTranslation } from 'react-i18next';

// Import professional standards data
import profStandardsData from '../data/prof_standard.json';

const StandardDetails = ({ standards, programId, onRefresh }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { t, i18n } = useTranslation();

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
    url: ''
  });

  // For professional standards search
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // Re-run search whenever the query or selected language changes,
  // same pattern as the Atlas search in JobDetails.
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedLanguage]);

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
      await onRefresh();
    } catch (error) {
      setError(t('standard.failedToSaveStandard', { error: error.message, defaultValue: `Failed to save standard: ${error.message}` }));
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
      await onRefresh();
    } catch (error) {
      setError(t('standard.failedToDeleteStandard', { error: error.message, defaultValue: `Failed to delete standard: ${error.message}` }));
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
      await onRefresh();
    } catch (error) {
      setError(t('standard.failedToGenerateStandards', { error: error.message, defaultValue: `Failed to generate standards: ${error.message}` }));
    } finally {
      setGenerating(false);
    }
  };

  // Professional Standards search functions
  const handleSearchDialogOpen = () => {
    setSearchDialogOpen(true);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedLanguage(i18n.language === 'ru' ? 'ru' : i18n.language === 'kk' ? 'kk' : 'en');
  };

  const handleSearchDialogClose = () => {
    setSearchDialogOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Map the UI's selected language to the corresponding field on the
  // prof_standard.json records.
  const languageFieldMap = {
    en: 'name_en',
    ru: 'name_ru',
    kk: 'name_kk',
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);

    const query = searchQuery.toLowerCase();
    const nameField = languageFieldMap[selectedLanguage] || 'name_en';

    // Search only within the selected language's name field, plus the code,
    // instead of matching across all three languages at once.
    const results = profStandardsData.filter((standard) =>
      (standard[nameField] || '').toLowerCase().includes(query) ||
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

  // Resolve the display name for a standard based on the active app language,
  // same fallback pattern used for jobs in JobDetails.
  const getDisplayName = (standard) =>
    i18n.language === 'ru'
      ? standard.nameRu
      : i18n.language === 'kk'
        ? standard.nameKz
        : standard.nameEn;

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LibraryBooksIcon sx={{ mr: 1 }} />
            {t('standard.standardsManagement', { defaultValue: 'Standards Management' })}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {t('standard.standardsManagementDescription', {
              defaultValue: 'Define and manage educational standards for this program. Standards can be created manually, imported from professional standards, or generated automatically.'
            })}
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
              {t('standard.addStandard', { defaultValue: 'Add Standard' })}
            </Button>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearchDialogOpen}
              sx={{ bgcolor: colors.blueAccent[400] }}
            >
              {t('standard.searchProfStandards', { defaultValue: 'Search Prof Standards' })}
            </Button>
            <Button
              variant="contained"
              startIcon={<AutoFixHighIcon />}
              onClick={generateStandards}
              disabled={generating}
              sx={{ bgcolor: colors.blueAccent[500] }}
            >
              {generating ? <CircularProgress size={24} color="inherit" /> : t('standard.generateStandards', { defaultValue: 'Generate Standards' })}
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
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                {t('standard.name', { defaultValue: 'Name' })}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                {t('standard.sourceLink', { defaultValue: 'Source Link' })}
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">
                {t('standard.actions', { defaultValue: 'Actions' })}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {standards.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  <Typography>
                    {t('standard.noStandardsAvailable', {
                      defaultValue: 'No standards available. Add a standard, import from professional standards, or generate standards.'
                    })}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              standards.map((standard) => (
                <TableRow key={standard.id} hover>
                  <TableCell sx={{ fontWeight: 'medium' }}>{getDisplayName(standard)}</TableCell>
                  <TableCell>
                    {standard.url ? (
                      <Link
                        href={standard.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <LinkIcon fontSize="small" sx={{ mr: 0.5 }} />
                        {t('standard.viewSource', { defaultValue: 'View Source' })}
                        <LaunchIcon fontSize="small" sx={{ ml: 0.5 }} />
                      </Link>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('standard.edit', { defaultValue: 'Edit' })}>
                      <IconButton onClick={() => handleFormOpen(standard)} size="small" sx={{ mr: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('standard.delete', { defaultValue: 'Delete' })}>
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
          {currentStandard.id
            ? t('standard.editStandard', { defaultValue: 'Edit Standard' })
            : t('standard.addNewStandard', { defaultValue: 'Add New Standard' })}
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
                  label={t('standard.nameKz', { defaultValue: 'Standard Name (Kazakh)' })}
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
                  label={t('standard.nameRu', { defaultValue: 'Standard Name (Russian)' })}
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
                  label={t('standard.nameEn', { defaultValue: 'Standard Name (English)' })}
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
                  label={t('standard.sourceUrl', { defaultValue: 'Source URL (Optional)' })}
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
            <Button onClick={handleFormClose} color="inherit">
              {t('standard.cancel', { defaultValue: 'Cancel' })}
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {currentStandard.id
                ? t('standard.update', { defaultValue: 'Update' })
                : t('standard.create', { defaultValue: 'Create' })}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{t('standard.confirmDeletion', { defaultValue: 'Confirm Deletion' })}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('standard.deleteStandardConfirmation', {
              defaultValue: 'Are you sure you want to delete this standard? This action cannot be undone.'
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            {t('standard.cancel', { defaultValue: 'Cancel' })}
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            {t('standard.delete', { defaultValue: 'Delete' })}
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
          {t('standard.searchProfessionalStandards', { defaultValue: 'Search Professional Standards' })}
          <IconButton
            aria-label="close"
            onClick={handleSearchDialogClose}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <TextField
              autoFocus
              fullWidth
              label={t('standard.searchByNameOrCode', { defaultValue: 'Search by name or code' })}
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
              {t('standard.searchByNameHelperText', {
                defaultValue: 'Search by standard name in the selected language, or by code'
              })}
            </Typography>
          </Box>

          {/* Language selector, same pattern as the Atlas search chips in JobDetails */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Chip
              label={t('standard.english', { defaultValue: 'English' })}
              variant={selectedLanguage === 'en' ? 'filled' : 'outlined'}
              color={selectedLanguage === 'en' ? 'primary' : 'default'}
              onClick={() => setSelectedLanguage('en')}
              clickable
            />
            <Chip
              label={t('standard.russian', { defaultValue: 'Russian' })}
              variant={selectedLanguage === 'ru' ? 'filled' : 'outlined'}
              color={selectedLanguage === 'ru' ? 'primary' : 'default'}
              onClick={() => setSelectedLanguage('ru')}
              clickable
            />
            <Chip
              label={t('standard.kazakh', { defaultValue: 'Kazakh' })}
              variant={selectedLanguage === 'kk' ? 'filled' : 'outlined'}
              color={selectedLanguage === 'kk' ? 'primary' : 'default'}
              onClick={() => setSelectedLanguage('kk')}
              clickable
            />
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
                    <TableCell>{t('standard.code', { defaultValue: 'Code' })}</TableCell>
                    <TableCell>{t('standard.name', { defaultValue: 'Name' })}</TableCell>
                    <TableCell align="right">{t('standard.action', { defaultValue: 'Action' })}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {searchResults.map((result) => (
                    <TableRow key={result.id} hover>
                      <TableCell>{result.code_ps}</TableCell>
                      <TableCell>{result[languageFieldMap[selectedLanguage] || 'name_en']}</TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleSelectProfStandard(result)}
                        >
                          {t('standard.select', { defaultValue: 'Select' })}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : searchQuery ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography>
                {t('standard.noMatchingStandards', { defaultValue: `No standards found for "${searchQuery}"` })}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography>
                {t('standard.typeToSearchProfStandards', { defaultValue: 'Enter a search term to find professional standards' })}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSearchDialogClose} color="inherit">
            {t('standard.cancel', { defaultValue: 'Cancel' })}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StandardDetails;