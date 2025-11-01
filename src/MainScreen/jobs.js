import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
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
  Menu,
  Typography,
  Avatar,
  Chip,
  Divider,
  Stack,
  Grid,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import FilterListIcon from "@mui/icons-material/FilterList";
import VisibilityIcon from "@mui/icons-material/Visibility";
import styled from "@emotion/styled";
import { jobService } from "../services/user.service";
import NotificationModal from "../components/NotificationModal";
import { useStats } from "../store/StatsContext";
import CreateJob from "../components/createJob";

const Jobs = () => {
  const { setTotalJobs } = useStats();
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createJobModalOpen, setCreateJobModalOpen] = useState(false);
  const [viewJobModalOpen, setViewJobModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loadingJobDetails, setLoadingJobDetails] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    type: 'success',
    title: '',
    message: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    experienceLevel: '',
    minCTC: '',
    maxCTC: '',
  });
  const [filterAnchor, setFilterAnchor] = useState(null);

  useEffect(() => {
    // Only show loading if we're not searching and there's no active search term
    fetchJobs(!isSearching && searchTerm === '');
  }, [pagination.currentPage, filters]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, [searchTerm]);

  // Keep global count updated from API responses in fetch functions below

  // Debounce search to avoid too many API calls - no loading bar during search
  useEffect(() => {
    if (searchTerm === undefined || searchTerm === '') {
      // When search is cleared, fetch with loading
      setIsSearching(false);
      fetchJobs(true);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(() => {
      fetchJobsSilent();
      setIsSearching(false);
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchJobsSilent = async () => {
    try {
      setError(null);
      const response = await jobService.getAllJobs(pagination.currentPage, 10, {
        search: searchTerm || undefined,
        ...filters,
      });
      console.log("Jobs response:", response);
      
      if (response.data?.jobPostings) {
        setJobs(response.data.jobPostings);
      }
      if (response.data?.pagination) {
        setPagination(response.data.pagination);
      }

      // Update global totalJobs directly from API response
      const total =
        (response && (
          (response.data?.pagination && (response.data.pagination.total ?? response.data.pagination.totalCount)) ??
          response.data?.total ??
          response.total ??
          (Array.isArray(response.data?.jobPostings) ? response.data.jobPostings.length : undefined)
        )) || 0;
      setTotalJobs(Number(total) || 0);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError(err.message || "Failed to fetch jobs");
      setJobs([]);
      setTotalJobs(0);
    }
  };

  const fetchJobs = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      const response = await jobService.getAllJobs(pagination.currentPage, 10, {
        search: searchTerm || undefined,
        ...filters,
      });
      console.log("Jobs response:", response);
      
      if (response.data?.jobPostings) {
        setJobs(response.data.jobPostings);
      }
      if (response.data?.pagination) {
        setPagination(response.data.pagination);
      }

      // Update global totalJobs directly from API response
      const total =
        (response && (
          (response.data?.pagination && (response.data.pagination.total ?? response.data.pagination.totalCount)) ??
          response.data?.total ??
          response.total ??
          (Array.isArray(response.data?.jobPostings) ? response.data.jobPostings.length : undefined)
        )) || 0;
      setTotalJobs(Number(total) || 0);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setError(err.message || "Failed to fetch jobs");
      setJobs([]);
      setTotalJobs(0);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
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

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setDeleteModalOpen(true);
  };

  const handleViewJobClick = async (job) => {
    try {
      setLoadingJobDetails(true);
      setSelectedJob(job);
      setViewJobModalOpen(true);
      
      // If you want to fetch full details from API, use this:
      // const response = await jobService.getJobById(job.id);
      // setJobDetails(response.data);
      
      // For now, use the job data directly
      setJobDetails(job);
    } catch (err) {
      console.error("Failed to fetch job details:", err);
      showNotification('error', 'Error', 'Failed to load job details');
    } finally {
      setLoadingJobDetails(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (jobToDelete) {
      try {
        setDeleteLoading(true);
        await jobService.deleteJob(jobToDelete.id);
        await fetchJobs();
        setDeleteModalOpen(false);
        setJobToDelete(null);
        showNotification('success', 'Success', 'Job deleted successfully!');
      } catch (err) {
        console.error("Failed to delete job:", err);
        showNotification('error', 'Error', err.message || 'Failed to delete job');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleJobCreated = async () => {
    setCreateJobModalOpen(false);
    await fetchJobs();
    showNotification('success', 'Success', 'Job posting created successfully!');
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      jobType: '',
      experienceLevel: '',
      minCTC: '',
      maxCTC: '',
    });
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

  const getRowNumber = (index) => {
    // Always show sequential numbers starting from 1
    return index + 1;
  };

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
          <Title>Job Postings ({pagination.total || jobs.length})</Title>
          <ControlSection>
            <SearchField
              placeholder="Search jobs..."
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
            
            <IconButton onClick={(e) => setFilterAnchor(e.currentTarget)}>
              <FilterListIcon />
            </IconButton>

            <CreateButton
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateJobModalOpen(true)}
            >
              Create Job
            </CreateButton>
          </ControlSection>
        </HeaderSection>

        {/* Filter Menu */}
        <Menu
          anchorEl={filterAnchor}
          open={Boolean(filterAnchor)}
          onClose={() => setFilterAnchor(null)}
        >
          <FilterMenuContent>
            <FilterField
              label="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              placeholder="Enter location"
            />
            <FilterField
              label="Job Type"
              value={filters.jobType}
              onChange={(e) => handleFilterChange('jobType', e.target.value)}
              placeholder="Select job type"
              select
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Full-time">Full-time</MenuItem>
              <MenuItem value="Part-time">Part-time</MenuItem>
              <MenuItem value="Contract">Contract</MenuItem>
              <MenuItem value="Internship">Internship</MenuItem>
            </FilterField>
            <FilterField
              label="Experience Level"
              value={filters.experienceLevel}
              onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
              placeholder="Select experience"
              select
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Entry Level">Entry Level</MenuItem>
              <MenuItem value="Mid Level">Mid Level</MenuItem>
              <MenuItem value="Senior Level">Senior Level</MenuItem>
            </FilterField>
            <Button onClick={clearFilters} variant="outlined" fullWidth>
              Clear Filters
            </Button>
          </FilterMenuContent>
        </Menu>

        {/* Table Section */}
        <StyledTableWrapper>  
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Company</TableHeaderCell>
                <TableHeaderCell>Job Name</TableHeaderCell>
                <TableHeaderCell>Location</TableHeaderCell>
                <TableHeaderCell>Job Type</TableHeaderCell>
                <TableHeaderCell>CTC</TableHeaderCell>
                <TableHeaderCell>Created At</TableHeaderCell>
                <TableHeaderCell>Action</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No jobs found
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job, index) => (
                  <TableRow key={job.id}>
                    <TableCell>{getRowNumber(index)}</TableCell>
                    <TableCell>
                      {job.companyName || 'N/A'}
                    </TableCell>
                    <TableCell>{job.jobName}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.jobType}</TableCell>
                    <TableCell>{job.ctc ? `₹${job.ctc}` : '-'}</TableCell>
                    <TableCell>{formatDate(job.createdAt)}</TableCell>
                    <TableCell>
                      <ActionButtons>
                        <IconButton
                          onClick={() => handleViewJobClick(job)}
                          aria-label="view"
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(job)}
                          aria-label="delete"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ActionButtons>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </StyledTable>
        </StyledTableWrapper>

        {/* Pagination Controls */}
        {!searchTerm && pagination.totalPages > 1 && (
          <PaginationContainer>
            <Button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
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
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: pageNum }))}
                    disabled={loading}
                    active={pagination.currentPage === pageNum}
                  >
                    {pageNum}
                  </PaginationButton>
                );
              })}
    </div>

            <Button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
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
        onClose={() => setDeleteModalOpen(false)}
        PaperProps={{ sx: { borderRadius: "12px", minWidth: "400px" } }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this job posting? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} variant="outlined" disabled={deleteLoading}>
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

      {/* View Job Details Modal */}
      <Dialog
        open={viewJobModalOpen}
        onClose={() => setViewJobModalOpen(false)}
        PaperProps={{ sx: { borderRadius: "14px", minWidth: "780px", maxWidth: "980px", overflow: 'hidden' } }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ p: 0 }}>
          <ModalHeader>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={jobDetails?.image || jobDetails?.companyLogo}
                alt={jobDetails?.companyName || 'Company'}
                sx={{ width: 56, height: 56, border: '1px solid #eaeaea', bgcolor: '#f5f5f5' }}
              />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827' }}>
                  {jobDetails?.jobName || 'Job Details'}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  {jobDetails?.companyName || 'Company'}
                </Typography>
              </Box>
            </Stack>
            <BadgeRow>
              {jobDetails?.location && <Chip size="small" label={jobDetails.location} />}
              {jobDetails?.jobType && <Chip size="small" label={jobDetails.jobType} />}
              {jobDetails?.experienceLevel && <Chip size="small" label={jobDetails.experienceLevel} />}
            </BadgeRow>
          </ModalHeader>
        </DialogTitle>
        <DialogContent dividers sx={{ backgroundColor: '#fafafa' }}>
          {loadingJobDetails ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : jobDetails ? (
            <Box>
              <SectionCard>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', mb: 0.5 }}>
                      {jobDetails.jobName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280' }}>
                      {jobDetails.companyName || 'Company'}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {jobDetails.location && <Chip size="small" label={jobDetails.location} />}
                      {jobDetails.jobType && <Chip size="small" label={jobDetails.jobType} />}
                      {jobDetails.experienceLevel && <Chip size="small" label={jobDetails.experienceLevel} />}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: 1 }}>
                      <Pill>
                        {jobDetails.ctc ? `₹${jobDetails.ctc}` : 'CTC: Not disclosed'}
                      </Pill>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        Posted on {formatDate(jobDetails.createdAt)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </SectionCard>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={7}>
                  {jobDetails.description && (
                    <SectionCard>
                      <SectionTitle>Description</SectionTitle>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: '#374151' }}>
                        {jobDetails.description}
                      </Typography>
                    </SectionCard>
                  )}

                  {jobDetails.requirements && (
                    <SectionCard>
                      <SectionTitle>Requirements</SectionTitle>
                      <ChipList>
                        {(Array.isArray(jobDetails.requirements) ? jobDetails.requirements : jobDetails.requirements.split('\n'))
                          .filter(Boolean)
                          .map((req, idx) => (
                            <Chip key={idx} label={req} size="small" />
                          ))}
                      </ChipList>
                    </SectionCard>
                  )}

                  {jobDetails.responsibilities && (
                    <SectionCard>
                      <SectionTitle>Responsibilities</SectionTitle>
                      <ChipList>
                        {(Array.isArray(jobDetails.responsibilities) ? jobDetails.responsibilities : jobDetails.responsibilities.split('\n'))
                          .filter(Boolean)
                          .map((resp, idx) => (
                            <Chip key={idx} label={resp} size="small" color="default" />
                          ))}
                      </ChipList>
                    </SectionCard>
                  )}
                </Grid>

                <Grid item xs={12} md={5}>
                  <SectionCard>
                    <SectionTitle>Summary</SectionTitle>
                    <MetaRow>
                      <MetaItem>
                        <MetaLabel>Location</MetaLabel>
                        <MetaValue>{jobDetails.location || '—'}</MetaValue>
                      </MetaItem>
                      <MetaItem>
                        <MetaLabel>Job Type</MetaLabel>
                        <MetaValue>{jobDetails.jobType || '—'}</MetaValue>
                      </MetaItem>
                      <MetaItem>
                        <MetaLabel>Experience</MetaLabel>
                        <MetaValue>{jobDetails.experienceLevel || '—'}</MetaValue>
                      </MetaItem>
                      <MetaItem>
                        <MetaLabel>CTC</MetaLabel>
                        <MetaValue>{jobDetails.ctc ? `₹${jobDetails.ctc}` : 'Not disclosed'}</MetaValue>
                      </MetaItem>
                      <MetaItem>
                        <MetaLabel>Posted</MetaLabel>
                        <MetaValue>{formatDate(jobDetails.createdAt)}</MetaValue>
                      </MetaItem>
                    </MetaRow>
                  </SectionCard>

                  {(jobDetails.skills && (Array.isArray(jobDetails.skills) ? jobDetails.skills.length : String(jobDetails.skills).length)) ? (
                    <SectionCard>
                      <SectionTitle>Skills</SectionTitle>
                      <ChipList>
                        {(Array.isArray(jobDetails.skills) ? jobDetails.skills : String(jobDetails.skills).split(',')).map((skill, idx) => (
                          <Chip key={idx} label={skill.trim()} size="small" color="primary" variant="outlined" />
                        ))}
                      </ChipList>
                    </SectionCard>
                  ) : null}
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Typography>No details available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewJobModalOpen(false)} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Job Modal */}
      <Dialog
        open={createJobModalOpen}
        onClose={() => setCreateJobModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: "12px" } }}
      >
        <DialogContent>
          <CreateJob 
            onClose={() => setCreateJobModalOpen(false)}
            onSuccess={handleJobCreated}
          />
        </DialogContent>
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

export default Jobs;

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
  flexWrap: "wrap",
});

const SearchField = styled(TextField)({
  width: "300px",
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
    borderRadius: "8px",
    "& fieldset": { borderColor: "#ddd" },
    "&:hover fieldset": { borderColor: "#999" },
    "&.Mui-focused fieldset": { borderColor: "#20c997" },
  },
  "& .MuiInputBase-input": { padding: "10px 14px" },
});

const CreateButton = styled(Button)({
  backgroundColor: "#20c997",
  color: "white",
  borderRadius: "8px",
  padding: "8px 16px",
  "&:hover": { backgroundColor: "#1ba588" },
});

const StyledTableWrapper = styled(Box)({
  backgroundColor: "white",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
});

const StyledTable = styled(Table)({
  "& .MuiTableCell-root": { borderColor: "#e8f5e9", padding: "16px" },
});

const TableHeaderCell = styled(TableCell)({
  backgroundColor: "#e8f5e9",
  fontWeight: 600,
  fontSize: "0.95rem",
  color: "#333",
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
  "&:hover": { backgroundColor: active ? "#20c997" : "#f5f5f5" },
  "&:disabled": { opacity: 0.5, cursor: "not-allowed" },
}));

const FilterMenuContent = styled(Box)({
  padding: "16px",
  minWidth: "300px",
});

const FilterField = styled(TextField)({
  marginBottom: "12px",
  width: "100%",
});

const ActionButtons = styled(Box)({
  display: "flex",
  gap: "8px",
  alignItems: "center",
});

const DetailSection = styled(Box)({
  marginBottom: "16px",
});

const DetailLabel = styled("div")({
  fontWeight: 600,
  fontSize: "0.875rem",
  color: "#666",
  marginBottom: "4px",
});

const DetailValue = styled("div")({
  fontSize: "1rem",
  color: "#333",
  lineHeight: "1.6",
});

const ModalHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
  borderBottom: '1px solid #eef2f7',
});

const BadgeRow = styled(Box)({
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
});

const SectionCard = styled(Box)({
  backgroundColor: '#ffffff',
  border: '1px solid #eef2f7',
  boxShadow: '0 1px 2px rgba(16, 24, 40, 0.04)',
  borderRadius: '12px',
  padding: '16px',
});

const SectionTitle = styled(Typography)({
  fontSize: '0.9rem',
  fontWeight: 700,
  color: '#111827',
  marginBottom: '8px',
});

const Pill = styled('div')({
  backgroundColor: '#ecfdf5',
  color: '#047857',
  border: '1px solid #a7f3d0',
  borderRadius: '9999px',
  padding: '6px 12px',
  fontSize: '0.85rem',
  fontWeight: 700,
});

const MetaRow = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
});

const MetaItem = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
});

const MetaLabel = styled('div')({
  fontSize: '0.75rem',
  color: '#6b7280',
  fontWeight: 600,
});

const MetaValue = styled('div')({
  fontSize: '0.95rem',
  color: '#111827',
  fontWeight: 600,
});

const ChipList = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
});