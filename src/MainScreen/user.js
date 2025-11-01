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
import PrintIcon from "@mui/icons-material/Print";
import styled from "@emotion/styled";
import userService from "../services/user.service";
import NotificationModal from "../components/NotificationModal";
import { useStats } from "../store/StatsContext";

const User = () => {
  const { setTotalUsers } = useStats();
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
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportCount, setExportCount] = useState(50);

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

     
      const total =
        (response && (
          (response.pagination && (response.pagination.totalCount ?? response.pagination.total)) ??
          response.totalUsers ??
          response.total ??
          (Array.isArray(response.users) ? response.users.length : undefined)
        )) || 0;
      setTotalUsers(Number(total) || 0);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(err.message || "Failed to fetch users");
    
      setUsers([]);
      setTotalUsers(0);
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

  const handlePrintExport = () => {
    const total = pagination.totalCount || users.length || 1;
    setExportCount(Math.min(exportCount || total, total));
    setExportDialogOpen(true);
  };

  const handleConfirmExport = async () => {
    try {
      const total = pagination.totalCount || users.length || 0;
      const desired = Math.max(1, Math.min(Number(exportCount) || 1, total || 1));
      const res = await userService.getAllUsers(1, desired);
      const list = res.users || [];
      const rows = list
        .map((u, idx) => {
          const name = `${u.firstName || ''} ${u.lastName || ''}`.trim();
          const email = u.email || '';
          const created = formatDate(u.createdAt);
          return `<tr>
            <td style="padding:8px;border:1px solid #e5e7eb;">${idx + 1}</td>
            <td style="padding:8px;border:1px solid #e5e7eb;">${name}</td>
            <td style="padding:8px;border:1px solid #e5e7eb;">${email}</td>
            <td style="padding:8px;border:1px solid #e5e7eb;">${created}</td>
          </tr>`;
        })
        .join("");
      const title = `Users Export (${desired})`;
      const html = `<!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>${title}</title>
            <style>
              body { font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; color:#111827; }
              h1 { font-size:20px; margin:0 0 12px 0; }
              .meta { color:#6b7280; font-size:12px; margin-bottom:12px; }
              table { border-collapse: collapse; width: 100%; }
              thead th { text-align:left; background:#f3f4f6; border:1px solid #e5e7eb; padding:8px; }
              tbody td { border:1px solid #e5e7eb; padding:8px; }
              @media print { @page { margin: 16mm; } }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            <div class="meta">Generated on ${new Date().toLocaleString()}</div>
            <table>
              <thead>
                <tr>
                  <th style="width:60px;">ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined at</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
            <script>window.onload = function(){ window.print(); };</script>
          </body>
        </html>`;
      const win = window.open("", "_blank");
      if (win) {
        win.document.open();
        win.document.write(html);
        win.document.close();
        win.focus();
      }
      setExportDialogOpen(false);
    } catch (e) {
      showNotification('error', 'Export failed', e.message || 'Could not export users');
    }
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
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={handlePrintExport}
              sx={{ backgroundColor: '#20c997', '&:hover': { backgroundColor: '#1ba588' } }}
            >
              Print
            </Button>
            {/* <StyledSelect
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              displayEmpty
            >
              <MenuItem value="Newest">Newest</MenuItem>
              <MenuItem value="Oldest">Oldest</MenuItem>
            </StyledSelect> */}

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

      {/* Export Count Modal */}
      <Dialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: '12px', minWidth: 360 } }}
      >
        <DialogTitle>Export Users</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Number of users"
              type="number"
              fullWidth
              value={exportCount}
              onChange={(e) => setExportCount(e.target.value)}
              inputProps={{ min: 1, max: Math.max(1, pagination.totalCount || users.length || 1) }}
              helperText={`Max: ${pagination.totalCount || users.length || 1}`}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleConfirmExport} variant="contained">Export</Button>
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