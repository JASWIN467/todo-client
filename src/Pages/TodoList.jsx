import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Container,
  Paper,
  IconButton,
  Fab,
  Alert,
  Snackbar,
  Chip,
  Avatar
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  Assignment as TodoIcon
} from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

const TodoList = () => {
  const [todo, setTodo] = useState("");
  const [status, setStatus] = useState(false);
  const [todoArray, setTodoArray] = useState([]);

  // 🚀 Validated POST function  
  const postTodo = async () => {

    // 🛑 Prevent sending empty todo  
    if (!todo.trim()) {
      alert("Please enter a valid todo!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/csbs/addtodo", { todo });

      setTodo("");            // clear input
      setStatus(true);        // show success alert
      getTodo();              // refresh list

      setTimeout(() => setStatus(false), 3000);
    } catch (err) {
      console.error("ADD TODO ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.mess || "Something went wrong!");
    }
  };

  // 🚀 Fetch Todo List  
  const getTodo = async () => {
    try {
      const response = await axios.get("http://localhost:5000/csbs/gettodo");
      setTodoArray(response.data);
    } catch (err) {
      console.error("GET TODO ERROR:", err);
    }
  };

  // 🚀 Delete Todo
  const deleteTodo = async (id) => {
    try {
      console.log('Deleting todo with ID:', id);
      await axios.delete(`http://localhost:5000/csbs/deletetodo/${id}`);
      getTodo(); // refresh list
      console.log('Todo deleted successfully');
    } catch (err) {
      console.error("DELETE TODO ERROR:", err);
      alert('Failed to delete todo');
    }
  };

  // Load list on page open  
  useEffect(() => {
    getTodo();
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      postTodo();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="md">
          {/* Header */}
          <Paper elevation={3} sx={{ p: 4, mb: 4, textAlign: 'center', borderRadius: 3 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mx: 'auto', mb: 2 }}>
              <CheckIcon fontSize="large" />
            </Avatar>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              My Todo List
            </Typography>
          </Paper>

          {/* Add Todo Section */}
          <Card elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
                <TextField
                  fullWidth
                  label="What needs to be done?"
                  variant="outlined"
                  value={todo}
                  onChange={(e) => setTodo(e.target.value)}
                  onKeyPress={handleKeyPress}
                  sx={{ flexGrow: 1 }}
                />
                <Fab
                  color="primary"
                  onClick={postTodo}
                  size="medium"
                  sx={{ ml: 1 }}
                >
                  <AddIcon />
                </Fab>
              </Box>
            </CardContent>
          </Card>

          {/* Todo Stats */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <Chip
              icon={<CheckIcon />}
              label={`${todoArray.length} ${todoArray.length === 1 ? 'Task' : 'Tasks'}`}
              color="primary"
              variant="outlined"
            />
          </Box>

          {/* Todo List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {todoArray.length === 0 ? (
              <Card elevation={1} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <TodoIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No tasks yet
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Add your first task above to get started!
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              todoArray.map((item, index) => (
                <Card
                  key={index}
                  elevation={2}
                  sx={{
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      elevation: 4,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
                    <CheckIcon sx={{ color: 'success.main', mr: 2 }} />
                    <Typography variant="body1" sx={{ flexGrow: 1, fontSize: '1.1rem' }}>
                      {item.todo}
                    </Typography>
                    <IconButton color="error" size="small" onClick={() => deleteTodo(item._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>

          {/* Success Snackbar */}
          <Snackbar
            open={status}
            autoHideDuration={3000}
            onClose={() => setStatus(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={() => setStatus(false)}
              severity="success"
              sx={{ width: '100%' }}
            >
              Task added successfully!
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default TodoList;
