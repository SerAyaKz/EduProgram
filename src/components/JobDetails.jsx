import React, { useState, useEffect } from "react";
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
  InputAdornment,
} from "@mui/material";
import { tokens } from "../theme";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import WorkIcon from "@mui/icons-material/Work";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import BuildIcon from "@mui/icons-material/Build";
import SearchIcon from "@mui/icons-material/Search";
import TruncatedText from "./TruncatedText";
import atlasProfessions from "../data/atlas_professions.json";
import { useTranslation } from "react-i18next";

const JobDetails = ({ jobs, programId, onRefresh }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState({
    id: null,
    nameEn: "",
    descriptionEn: "",
    nameRu: "",
    descriptionRu: "",
    nameKz: "",
    descriptionKz: "",
    job_type: "",
    programId: Number(programId),
  });

  // Atlas search states
  const [atlasSearchOpen, setAtlasSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [creatingJob, setCreatingJob] = useState(false);

  const { t, i18n } = useTranslation();

  // Search through Atlas professions
  useEffect(() => {
    if (searchQuery.trim()) {
      const filteredResults = atlasProfessions.filter((profession) => {
        const title =
          profession.title[selectedLanguage] ||
          profession.title.en ||
          profession.title.ru;
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
        nameEn: job.nameEn || "",
        descriptionEn: job.descriptionEn || "",
        nameRu: job.nameRu || "",
        descriptionRu: job.descriptionRu || "",
        nameKz: job.nameKz || "",
        descriptionKz: job.descriptionKz || "",
        job_type: job.job_type || "",
        programId: Number(programId),
      });
    } else {
      setCurrentJob({
        id: null,
        nameEn: "",
        descriptionEn: "",
        nameRu: "",
        descriptionRu: "",
        nameKz: "",
        descriptionKz: "",
        job_type: "",
        programId: Number(programId),
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
      await onRefresh();
    } catch (error) {
      setError(t("job.failedToSaveJob", { error: error.message }));
    }
  };

  const createJob = async (job) => {
    const response = await fetch(`http://localhost:8081/job`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  };

  const updateJob = async (job) => {
    console.log(job);
    const response = await fetch(`http://localhost:8081/job/${job.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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
      const response = await fetch(`http://localhost:8081/job/${deleteId}`, {
        method: "DELETE",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      await onRefresh();
    } catch (error) {
      setError(t("job.failedToDeleteJob", { error: error.message }));
    } finally {
      setOpenDialog(false);
      setDeleteId(null);
    }
  };

  const generateJobs = async () => {
    setGenerating(true);
    try {
      const response = await fetch(
        `http://localhost:8081/job/generate/${programId}`,
        { method: "POST" },
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      await onRefresh();
    } catch (error) {
      setError(t("job.failedToGenerateJobs", { error: error.message }));
    } finally {
      setGenerating(false);
    }
  };

  const generateSkills = async () => {
    setGenerating(true);
    try {
      const response = await fetch(
        `http://localhost:8081/job/skills/generate/${programId}`,
        { method: "POST" },
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      await onRefresh();
    } catch (error) {
      setError(t("job.failedToGenerateSkills", { error: error.message }));
    } finally {
      setGenerating(false);
    }
  };

  const handleOpenAtlasSearch = () => {
    setAtlasSearchOpen(true);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleCloseAtlasSearch = () => {
    setAtlasSearchOpen(false);
  };

  const handleSelectProfession = async (profession) => {
    // const title =
    //   profession.title[selectedLanguage] ||
    //   profession.title.en ||
    //   profession.title.ru;
    // const description =
    //   profession.description[selectedLanguage] ||
    //   profession.description.en ||
    //   profession.description.ru;

    const newJob = {
      nameEn: profession.title.en || "",
      descriptionEn: profession.description.en || "",

      nameRu: profession.title.ru || "",
      descriptionRu: profession.description.ru || "",

      nameKz: profession.title.kk || "",
      descriptionKz: profession.description.kk || "",

      job_type: "Atlas",
      programId: Number(programId),
    };

    setCreatingJob(true);
    try {
      await createJob(newJob);
      await onRefresh();
      setAtlasSearchOpen(false);
    } catch (error) {
      setError(t("job.failedToAddJobFromAtlas", { error: error.message }));
    } finally {
      setCreatingJob(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography
            variant="h5"
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
          >
            <WorkIcon sx={{ mr: 1 }} />
            {t("job.jobManagement")}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {t("job.jobManagementDescription")}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleFormOpen()}
              sx={{ bgcolor: colors.greenAccent[600] }}
            >
              {t("job.addJob")}
            </Button>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleOpenAtlasSearch}
              sx={{ bgcolor: colors.blueAccent[600] }}
            >
              {t("job.searchAtlas")}
            </Button>
            <Button
              variant="contained"
              startIcon={<AutoFixHighIcon />}
              onClick={generateJobs}
              disabled={generating}
              sx={{ bgcolor: colors.blueAccent[500] }}
            >
              {generating ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t("job.generateJobs")
              )}
            </Button>
            <Button
              variant="contained"
              startIcon={<BuildIcon />}
              onClick={generateSkills}
              disabled={generating}
              sx={{ bgcolor: colors.blueAccent[700] }}
            >
              {generating ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t("job.generateSkills")
              )}
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
            <IconButton
              size="small"
              color="inherit"
              onClick={() => setError(null)}
            >
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
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                {t("job.jobTitle")}
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                {t("job.description")}
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                {t("job.jobType")}
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold" }}
                align="right"
              >
                {t("job.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                  <Typography>{t("job.noJobsAvailable")}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              jobs.map((job) => (
                <TableRow key={job.id} hover>
                  <TableCell sx={{ fontWeight: "medium" }}>
                    {i18n.language === "ru"
                      ? job.nameRu
                      : i18n.language === "kk"
                        ? job.nameKz
                        : job.nameEn}
                  </TableCell>
                  <TableCell>
                    <TruncatedText
                      text={
                        i18n.language === "ru"
                          ? job.descriptionRu
                          : i18n.language === "kk"
                            ? job.descriptionKz
                            : job.descriptionEn
                      }
                      maxLength={100}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        job.job_type === "Atlas"
                          ? t("jobType.atlas")
                          : job.job_type === "Changed Atlas by User"
                            ? t("jobType.changedAtlasByUser")
                            : t("jobType.addedByUser")
                      }
                      size="small"
                      color={job.job_type === "Atlas" ? "success" : "default"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title={t("job.edit")}>
                      <IconButton
                        onClick={() => handleFormOpen(job)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("job.delete")}>
                      <IconButton
                        onClick={() => handleDeleteClick(job.id)}
                        size="small"
                        color="error"
                      >
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
          {currentJob.id ? t("job.editJob") : t("job.addNewJob")}
          <IconButton
            aria-label="close"
            onClick={handleFormClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
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
                  label={t("job.jobTitleEn")}
                  name="nameEn"
                  fullWidth
                  value={currentJob.nameEn}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={t("job.descriptionEn")}
                  name="descriptionEn"
                  fullWidth
                  multiline
                  rows={4}
                  value={currentJob.descriptionEn}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  label={t("job.jobTitleRu")}
                  name="nameRu"
                  fullWidth
                  value={currentJob.nameRu}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={t("job.descriptionRu")}
                  name="descriptionRu"
                  fullWidth
                  multiline
                  rows={4}
                  value={currentJob.descriptionRu}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoFocus
                  label={t("job.jobTitleKz")}
                  name="nameKz"
                  fullWidth
                  value={currentJob.nameKz}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={t("job.descriptionKz")}
                  name="descriptionKz"
                  fullWidth
                  multiline
                  rows={4}
                  value={currentJob.descriptionKz}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              {/* <Grid item xs={12} md={6}>
                <TextField
                  label="Job Type"
                  name="job_type"
                  fullWidth
                  value={currentJob.job_type}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid> */}
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
            <Button onClick={handleFormClose} color="inherit">
              {t("job.cancel")}
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {currentJob.id ? t("job.update") : t("job.create")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{t("job.confirmDeletion")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("job.deleteJobConfirmation")}{" "}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            {t("job.cancel")}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            {t("job.delete")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Atlas Search Dialog */}
      <Dialog
        open={atlasSearchOpen}
        onClose={handleCloseAtlasSearch}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {t("job.searchAtlasProfessions")}
          <IconButton
            aria-label="close"
            onClick={handleCloseAtlasSearch}
            sx={{ position: "absolute", right: 8, top: 8 }}
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
                label={t("job.searchForJobTitles")}
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
                placeholder={t("job.typeToSearch")}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Chip
                  label={t("job.english")}
                  variant={selectedLanguage === "en" ? "filled" : "outlined"}
                  color={selectedLanguage === "en" ? "primary" : "default"}
                  onClick={() => setSelectedLanguage("en")}
                  clickable
                />
                <Chip
                  label={t("job.russian")}
                  variant={selectedLanguage === "ru" ? "filled" : "outlined"}
                  color={selectedLanguage === "ru" ? "primary" : "default"}
                  onClick={() => setSelectedLanguage("ru")}
                  clickable
                />
                <Chip
                  label={t("job.kazakh")}
                  variant={selectedLanguage === "kk" ? "filled" : "outlined"}
                  color={selectedLanguage === "kk" ? "primary" : "default"}
                  onClick={() => setSelectedLanguage("kk")}
                  clickable
                />
              </Box>
            </Grid>
          </Grid>

          {searchResults.length > 0 ? (
            <List>
              {searchResults.map((profession) => {
                const title =
                  profession.title[selectedLanguage] ||
                  profession.title.en ||
                  profession.title.ru;
                const industry =
                  profession.industry[selectedLanguage] ||
                  profession.industry.en ||
                  profession.industry.ru;

                return (
                  <ListItem
                    key={profession.id}
                    button
                    onClick={() => handleSelectProfession(profession)}
                    disabled={creatingJob}
                    divider
                    sx={{
                      "&:hover": {
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
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {industry}
                        </Typography>
                      }
                    />
                    {creatingJob && (
                      <CircularProgress
                        size={20}
                        color="inherit"
                        sx={{ ml: 2 }}
                      />
                    )}
                  </ListItem>
                );
              })}
            </List>
          ) : searchQuery.trim() ? (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography color="text.secondary">
                {t("job.noMatchingJobs")}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography color="text.secondary">
                {t("job.typeToSearchAtlas")}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseAtlasSearch} color="inherit">
            {t("job.cancel")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobDetails;
