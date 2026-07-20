import React, { useState } from "react";
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
  Switch,
  FormControlLabel,
  useTheme,
  Chip,
} from "@mui/material";
import { tokens } from "../theme";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import SchoolIcon from "@mui/icons-material/School";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import TruncatedText from "./TruncatedText";
import { useTranslation } from "react-i18next";

const OutcomeDetails = ({ outcomes, programId, onRefresh }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { t, i18n } = useTranslation();
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [currentOutcome, setCurrentOutcome] = useState({
    id: null,
    code: "",
    learningOutcomeKz: "",
    learningOutcomeRu: "",
    learningOutcomeEn: "",
    programId,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentOutcome({ ...currentOutcome, [name]: value });
  };

  const handleFormOpen = (outcome = null) => {
    if (outcome) {
      setCurrentOutcome({
        id: outcome.id,
        code: outcome.code || "",
        learningOutcomeKz: outcome.learningOutcomeKz || "",
        learningOutcomeRu: outcome.learningOutcomeRu || "",
        learningOutcomeEn: outcome.learningOutcomeEn || "",
        programId,
      });
    } else {
      setCurrentOutcome({
        id: null,
        code: "",
        learningOutcomeKz: "",
        learningOutcomeRu: "",
        learningOutcomeEn: "",
        programId,
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
      if (currentOutcome.id) {
        await updateOutcome(currentOutcome);
      } else {
        await createOutcome(currentOutcome);
      }
      setFormOpen(false);
      await onRefresh();
    } catch (error) {
      setError(
        t("outcome.failedToSaveOutcome", {
          error: error.message,
          defaultValue: `Failed to save learning outcome: ${error.message}`,
        }),
      );
    }
  };

  const createOutcome = async (outcome) => {
    const response = await fetch(`http://localhost:8081/learningOutcome`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...outcome, programId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  };

  const updateOutcome = async (outcome) => {
    const response = await fetch(
      `http://localhost:8081/learningOutcome/${outcome.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...outcome, programId }),
      },
    );

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
      const response = await fetch(
        `http://localhost:8081/learningOutcome/${deleteId}`,
        { method: "DELETE" },
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      await onRefresh();
    } catch (error) {
      setError(
        t("outcome.failedToDeleteOutcome", {
          error: error.message,
          defaultValue: `Failed to delete learning outcome: ${error.message}`,
        }),
      );
    } finally {
      setOpenDialog(false);
      setDeleteId(null);
    }
  };

  const generateOutcomes = async () => {
    setGenerating(true);
    try {
      const response = await fetch(
        `http://localhost:8081/learningOutcome/generate/${programId}`,
        { method: "POST" },
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      await onRefresh();
    } catch (error) {
      setError(
        t("outcome.failedToGenerateOutcomes", {
          error: error.message,
          defaultValue: `Failed to generate learning outcomes: ${error.message}`,
        }),
      );
    } finally {
      setGenerating(false);
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
            <SchoolIcon sx={{ mr: 1 }} />
            {t("outcome.learningOutcomesManagement", {
              defaultValue: "Learning Outcomes Management",
            })}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {t("outcome.learningOutcomesManagementDescription", {
              defaultValue:
                "Define and manage learning outcomes for this program. Learning outcomes describe what students should know or be able to do upon completion.",
            })}
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
              {t("outcome.addOutcome", { defaultValue: "Add Outcome" })}
            </Button>
            <Button
              variant="contained"
              startIcon={<AutoFixHighIcon />}
              onClick={generateOutcomes}
              disabled={generating}
              sx={{ bgcolor: colors.blueAccent[500] }}
            >
              {generating ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t("outcome.generateOutcomes", {
                  defaultValue: "Generate Outcomes",
                })
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

      {/* Outcomes table */}
      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: colors.blueAccent[700] }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                {t("outcome.code", { defaultValue: "Code" })}
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                {t("outcome.outcomeEnglish", { defaultValue: "Outcome" })}
              </TableCell>
              <TableCell
                sx={{ color: "white", fontWeight: "bold" }}
                align="right"
              >
                {t("outcome.actions", { defaultValue: "Actions" })}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {outcomes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                  <Typography>
                    {t("outcome.noOutcomesAvailable", {
                      defaultValue:
                        "No learning outcomes available. Add an outcome or generate outcomes.",
                    })}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              outcomes.map((outcome) => (
                <TableRow key={outcome.id} hover>
                  <TableCell>
                    <Chip
                      label={outcome.code}
                      size="small"
                      color="white"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <TruncatedText
                      text={
                        i18n.language === "ru"
                          ? outcome.learningOutcomeRu
                          : i18n.language === "kk"
                            ? outcome.learningOutcomeKz
                            : outcome.learningOutcomeEn
                      }
                      maxLength={100}
                    />
                  </TableCell>
                  
                  <TableCell align="right">
                    <Tooltip
                      title={t("outcome.edit", { defaultValue: "Edit" })}
                    >
                      <IconButton
                        onClick={() => handleFormOpen(outcome)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={t("outcome.delete", { defaultValue: "Delete" })}
                    >
                      <IconButton
                        onClick={() => handleDeleteClick(outcome.id)}
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

      {/* Learning outcome form dialog */}
      <Dialog open={formOpen} onClose={handleFormClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentOutcome.id
            ? t("outcome.editOutcome", {
                defaultValue: "Edit Learning Outcome",
              })
            : t("outcome.addNewOutcome", {
                defaultValue: "Add New Learning Outcome",
              })}
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
                  label={t("outcome.code", { defaultValue: "Code" })}
                  name="code"
                  fullWidth
                  value={currentOutcome.code}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  placeholder="e.g., LO1, PLO2"
                  helperText={t("outcome.codeHelperText", {
                    defaultValue: "Unique identifier for this learning outcome",
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={t("outcome.learningOutcomeEn", {
                    defaultValue: "Learning Outcome (English)",
                  })}
                  name="learningOutcomeEn"
                  fullWidth
                  multiline
                  rows={3}
                  value={currentOutcome.learningOutcomeEn}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                  placeholder={t("outcome.learningOutcomeEnPlaceholder", {
                    defaultValue: "Students will be able to...",
                  })}
                />
              </Grid>

              <Grid item xs={12} sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showAdvanced}
                      onChange={() => setShowAdvanced(!showAdvanced)}
                      color="primary"
                    />
                  }
                  label={t("outcome.showTranslations", {
                    defaultValue: "Show translations",
                  })}
                />
              </Grid>

              {showAdvanced && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      label={t("outcome.learningOutcomeKz", {
                        defaultValue: "Learning Outcome (Kazakh)",
                      })}
                      name="learningOutcomeKz"
                      fullWidth
                      multiline
                      rows={3}
                      value={currentOutcome.learningOutcomeKz}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label={t("outcome.learningOutcomeRu", {
                        defaultValue: "Learning Outcome (Russian)",
                      })}
                      name="learningOutcomeRu"
                      fullWidth
                      multiline
                      rows={3}
                      value={currentOutcome.learningOutcomeRu}
                      onChange={handleInputChange}
                      variant="outlined"
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleFormClose} color="inherit">
              {t("outcome.cancel", { defaultValue: "Cancel" })}
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {currentOutcome.id
                ? t("outcome.update", { defaultValue: "Update" })
                : t("outcome.create", { defaultValue: "Create" })}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {t("outcome.confirmDeletion", { defaultValue: "Confirm Deletion" })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("outcome.deleteOutcomeConfirmation", {
              defaultValue:
                "Are you sure you want to delete this learning outcome? This action cannot be undone.",
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            {t("outcome.cancel", { defaultValue: "Cancel" })}
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            {t("outcome.delete", { defaultValue: "Delete" })}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OutcomeDetails;
