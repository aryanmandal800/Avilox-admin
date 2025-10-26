import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CreateJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: "",
    jobName: "",
    location: "",
    jobType: "",
    ctc: "",
    description: "",
  });

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: replace with your API call, e.g. await jobService.createJob(form)
    console.log("Create job payload:", form);
    // After creating, navigate back to jobs list
    navigate("/");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, maxWidth: 800, margin: "0 auto" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Create New Job
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Company Name"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Job Name"
            name="jobName"
            value={form.jobName}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Job Type"
            name="jobType"
            value={form.jobType}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            placeholder="e.g. Full-time"
          />
          <TextField
            label="CTC (LPA)"
            name="ctc"
            value={form.ctc}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button onClick={() => navigate(-1)} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Create
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateJob;