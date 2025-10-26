import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import styled from "@emotion/styled";
import userService from "../services/user.service";
import NotificationModal from "../components/NotificationModal";

const User = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("Newest");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    type: 'success',
    title: '',
    message: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  });

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, [pagination.currentPage]);

  // Calculate row number for display
  const getRowNumber = (index) => {
    // If searching, show sequential numbers 1, 2, 3...
    // Otherwise, show paginated numbers
    if (searchTerm) {
      return index + 1;
    }
    return (pagination.currentPage - 1) * 10 + index + 1;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getAllUsers(pagination.currentPage, 10);
      console.log("Users response:", response);
      
      if (response.users) {
        setUsers(response.users);
      }
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(err.message || "Failed to fetch users");
      // Fallback to empty array on error
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const showNotification = (type, title, message) => {
    setNotification({
      open: true,
      type,
      title,
      message,
    });
  };

  const hideNotification = () => {
    setNotification({
      open: false,
      type: 'success',
      title: '',
      message: '',
    });
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        setDeleteLoading(true);
        console.log("Deleting user:", userToDelete.id);
        const response = await userService.deleteUser(userToDelete.id);
        console.log("Delete successful:", response);
        
        // Refresh the user list
        await fetchUsers();
        setDeleteModalOpen(false);
        setUserToDelete(null);
        
        // Show success notification
        showNotification('success', 'Success', 'User deleted successfully!');
      } catch (err) {
        console.error("Failed to delete user:", err);
        setError(err.message || "Failed to delete user");
        // Show error notification
        showNotification('error', 'Error', err.message || 'Failed to delete user');
        // Keep modal open on error so user can retry
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) => {
      if (!searchTerm) return true; // Show all if no search term
      const searchLower = searchTerm.toLowerCase();
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim().toLowerCase();
      const email = user.email?.toLowerCase() || '';
      return fullName.includes(searchLower) || email.includes(searchLower);
    }
  );

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <CircularProgress />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <>
      <Container>
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {/* Header Section */}
        <HeaderSection>
          <Title>Users ({searchTerm ? filteredUsers.length : pagination.totalCount})</Title>
          <ControlSection>
            <StyledSelect
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              displayEmpty
            >
              <MenuItem value="Newest">Newest</MenuItem>
              <MenuItem value="Oldest">Oldest</MenuItem>
            </StyledSelect>

            <SearchField
              placeholder="Search by name, email, o..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon style={{ color: "#999" }} />
                  </InputAdornment>
                ),
              }}
            />
          </ControlSection>
        </HeaderSection>

        {/* Table Section */}
        <StyledTableWrapper>
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Created At</TableHeaderCell>
                <TableHeaderCell>Action</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
                {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {searchTerm ? 'No users found matching your search' : 'No users found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user, index) => (
                  <TableRow key={user.id}>
                    <StyledTableCell>{getRowNumber(index)}</StyledTableCell>
                    <StyledTableCell>{user.firstName} {user.lastName}</StyledTableCell>
                    <StyledTableCell>{user.email}</StyledTableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                    <ActionButtons>
                      {/* <ViewButton variant="contained" size="small">
                        View
                      </ViewButton> */}
                      <DeleteButton
                        onClick={() => handleDeleteClick(user)}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </DeleteButton>
                    </ActionButtons>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </StyledTable>
        </StyledTableWrapper>

        {/* Pagination Controls */}
        {/* Only show pagination when not searching */}
        {!searchTerm && pagination.totalPages > 1 && (
          <PaginationContainer>
            <Button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1 || loading}
              variant="outlined"
            >
              Previous
            </Button>
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.currentPage - 2 + i;
                }
                
                return (
                  <PaginationButton
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={loading}
                    active={pagination.currentPage === pageNum}
                  >
                    {pageNum}
                  </PaginationButton>
                );
              })}
            </div>

            <Button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages || loading}
              variant="outlined"
            >
              Next
            </Button>
          </PaginationContainer>
        )}
      </Container>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            minWidth: "400px",
          },
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete user "{userToDelete?.name}"? This
          action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} variant="outlined" disabled={deleteLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={deleteLoading}
          >
            {deleteLoading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Modal */}
      <NotificationModal
        open={notification.open}
        onClose={hideNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </>
  );
};

export default User;

const Container = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  background: "#f3fbf3",
  padding: "20px",
});

const LoadingContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "60vh",
});

const HeaderSection = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  flexWrap: "wrap",
  gap: "16px",
});

const Title = styled("h2")({
  color: "#20c997",
  margin: 0,
  fontSize: "1.5rem",
  fontWeight: 600,
});

const ControlSection = styled(Box)({
  display: "flex",
  gap: "12px",
  alignItems: "center",
});

const StyledSelect = styled(Select)({
  backgroundColor: "white",
  borderRadius: "8px",
  height: "40px",
  width: "120px",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#ddd",
  },
});

const SearchField = styled(TextField)({
  width: "300px",
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
    borderRadius: "8px",
    "& fieldset": {
      borderColor: "#ddd",
    },
    "&:hover fieldset": {
      borderColor: "#999",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#20c997",
    },
  },
  "& .MuiInputBase-input": {
    padding: "10px 14px",
  },
});

const StyledTableCell = styled(TableCell)({
  maxWidth: "200px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const StyledTableWrapper = styled(Box)({
  backgroundColor: "white",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
});

const StyledTable = styled(Table)({
  "& .MuiTableCell-root": {
    borderColor: "#e8f5e9",
    padding: "16px",
  },
});

const TableHeaderCell = styled(TableCell)({
  backgroundColor: "#e8f5e9",
  fontWeight: 600,
  fontSize: "0.95rem",
  color: "#333",
});

const ActionButtons = styled(Box)({
  display: "flex",
  gap: "8px",
  alignItems: "center",
});

const ViewButton = styled(Button)({
  backgroundColor: "#0d6efd",
  color: "white",
  borderRadius: "6px",
  padding: "6px 16px",
  fontSize: "0.875rem",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#0a58ca",
  },
});

const DeleteButton = styled(IconButton)({
  backgroundColor: "#dc3545",
  color: "white",
  borderRadius: "6px",
  width: "36px",
  height: "36px",
  padding: "8px",
  "&:hover": {
    backgroundColor: "#bb2d3b",
  },
  "& .MuiSvgIcon-root": {
    fontSize: "1.2rem",
  },
});

const PaginationContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "16px",
  marginTop: "20px",
  padding: "16px",
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
});

const PaginationButton = styled(Button)(({ active }) => ({
  minWidth: "40px",
  height: "40px",
  borderRadius: "8px",
  backgroundColor: active ? "#20c997" : "white",
  color: active ? "white" : "#333",
  border: `1px solid ${active ? "#20c997" : "#ddd"}`,
  "&:hover": {
    backgroundColor: active ? "#20c997" : "#f5f5f5",
  },
  "&:disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
}));