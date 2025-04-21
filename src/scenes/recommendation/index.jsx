import React, { useState, useEffect } from "react";
import {
  Box,
  useTheme,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import { tokens } from "../../theme";
import { useParams, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BASE_URL = "http://localhost:8081";

const Recommendation = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { program_id } = useParams();
  const navigate = useNavigate();
  
  // State variables
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentRecommendation, setCurrentRecommendation] = useState({ id: null, content: "", program_id: program_id });
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });
  const [isEditing, setIsEditing] = useState(false);
  
  // Fetch recommendations
  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/recommendation`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Filter recommendations by program_id if needed
      const filteredRecommendations = program_id 
      ? data.filter(rec => rec.program_id === parseInt(program_id))
      : data;
      
      setRecommendations(filteredRecommendations);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setNotification({
        open: true,
        message: "Failed to load recommendations",
        severity: "error"
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [program_id]);

  // Handle dialog open for adding new recommendation
  const handleAddNew = () => {
    setCurrentRecommendation({ id: null, content: "", program_id: program_id });
    setIsEditing(false);
    setOpenDialog(true);
  };

  // Handle dialog open for editing recommendation
  const handleEdit = (recommendation) => {
    setCurrentRecommendation(recommendation);
    setIsEditing(true);
    setOpenDialog(true);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    setCurrentRecommendation({
      ...currentRecommendation,
      content: e.target.value
    });
  };

  // Save recommendation (create or update)
  const handleSave = async () => {
    try {
      if (!currentRecommendation.content.trim()) {
        setNotification({
          open: true,
          message: "Recommendation content cannot be empty",
          severity: "error"
        });
        return;
      }

      const payload = {
        ...currentRecommendation,
        program: program_id 
      };
      console.log(payload)

      const response = await fetch(`${BASE_URL}/recommendation`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setOpenDialog(false);
      fetchRecommendations();
      setNotification({
        open: true,
        message: isEditing ? "Recommendation updated successfully" : "Recommendation added successfully",
        severity: "success"
      });
    } catch (error) {
      console.error("Error saving recommendation:", error);
      setNotification({
        open: true,
        message: "Failed to save recommendation",
        severity: "error"
      });
    }
  };

  // Delete recommendation
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this recommendation?")) {
      try {
        const response = await fetch(`${BASE_URL}/recommendation/${id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        fetchRecommendations();
        setNotification({
          open: true,
          message: "Recommendation deleted successfully",
          severity: "success"
        });
      } catch (error) {
        console.error("Error deleting recommendation:", error);
        setNotification({
          open: true,
          message: "Failed to delete recommendation",
          severity: "error"
        });
      }
    }
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Navigate back
  const handleBack = () => {
    navigate(-1);
  };

  // Function to format content with line breaks
  const formatContent = (content) => {
    return content.split('\n').map((text, index) => (
      <React.Fragment key={index}>
        {text}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <Box m="20px">
      {/* Sticky Navigation Bar */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center"
        mb="20px"
        p="10px"
        bgcolor={colors.primary[400]}
        borderRadius="4px"
      >
        <Box display="flex" alignItems="center">
          <IconButton onClick={handleBack} color="secondary">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" color={colors.grey[100]} fontWeight="bold">
            {program_id ? "Program Recommendations" : "All Recommendations"}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
        >
          Add Recommendation
        </Button>
      </Box>

      {/* Recommendations List */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="300px">
          <CircularProgress />
        </Box>
      ) : recommendations.length === 0 ? (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            bgcolor: colors.primary[400],
            textAlign: "center"
          }}
        >
          <Typography variant="h6">No recommendations found</Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
            startIcon={<AddIcon />}
            onClick={handleAddNew}
          >
            Add Recommendation
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ bgcolor: colors.primary[400] }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: colors.grey[100], fontWeight: "bold", width: "85%" }}>Content</TableCell>
                <TableCell sx={{ color: colors.grey[100], fontWeight: "bold", width: "15%" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recommendations.map((recommendation) => (
                <TableRow key={recommendation.id}>
                  <TableCell sx={{ whiteSpace: "pre-wrap" }}>
                    {formatContent(recommendation.content)}
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      color="info" 
                      onClick={() => handleEdit(recommendation)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDelete(recommendation.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>{isEditing ? "Edit Recommendation" : "Add New Recommendation"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Recommendation Content"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={currentRecommendation.content}
            onChange={handleInputChange}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="secondary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Recommendation;