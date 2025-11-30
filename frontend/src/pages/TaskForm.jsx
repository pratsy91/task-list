import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";

export default function TaskForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme, mode, toggleTheme } = useTheme();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      setFetching(true);
      const response = await axios.get(`/tasks/${id}`);
      setFormData({
        title: response.data.title,
        description: response.data.description,
        status: response.data.status,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch task");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Please provide a task title");
      return;
    }

    setLoading(true);
    try {
      if (isEditMode) {
        await axios.put(`/tasks/${id}`, formData);
      } else {
        await axios.post("/tasks", formData);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="static"
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          boxShadow: 4,
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate("/dashboard")}
            sx={{
              mr: 2,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {isEditMode ? "Edit Task" : "Create New Task"}
          </Typography>
          <IconButton color="inherit" onClick={toggleTheme}>
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={6}
          sx={{
            padding: { xs: 3, sm: 4 },
            borderRadius: 2,
            background: `linear-gradient(135deg, ${
              theme.palette.background.paper
            } 0%, ${
              theme.palette.mode === "dark"
                ? "rgba(25, 118, 210, 0.1)"
                : "rgba(25, 118, 210, 0.05)"
            } 100%)`,
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Task Title"
              name="title"
              autoFocus
              value={formData.title}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              fullWidth
              id="description"
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/dashboard")}
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: "none",
                  borderWidth: 2,
                  "&:hover": {
                    borderWidth: 2,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                    transform: "translateY(-2px)",
                    boxShadow: 4,
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : isEditMode ? (
                  "Update Task"
                ) : (
                  "Create Task"
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
