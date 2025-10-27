import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { jobService } from "../services/user.service";

const CreateJob = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    jobName: "",
    companyName: "",
    image: "",
    description: "",
    ctc: "",
    eCTC: "",
    noticePeriod: "",
    location: "",
    workingDays: "",
    jobType: "",
    employmentType: "",
    experienceLevel: "",
    skills: [],
    requirements: [],
    responsibilities: [],
  });
  
  const [skillInput, setSkillInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");
  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleAddSkill = () => {
    if (skillInput.trim() && form.skills.length < 3) {
      setForm((s) => ({ ...s, skills: [...s.skills, skillInput.trim()] }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (index) => {
    setForm((s) => ({
      ...s,
      skills: s.skills.filter((_, i) => i !== index),
    }));
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleAddRequirement = () => {
    if (requirementInput.trim()) {
      setForm((s) => ({ ...s, requirements: [...s.requirements, requirementInput.trim()] }));
      setRequirementInput("");
    }
  };

  const handleRemoveRequirement = (index) => {
    setForm((s) => ({
      ...s,
      requirements: s.requirements.filter((_, i) => i !== index),
    }));
  };

  const handleRequirementKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddRequirement();
    }
  };

  const handleAddResponsibility = () => {
    if (responsibilityInput.trim()) {
      setForm((s) => ({ ...s, responsibilities: [...s.responsibilities, responsibilityInput.trim()] }));
      setResponsibilityInput("");
    }
  };

  const handleRemoveResponsibility = (index) => {
    setForm((s) => ({
      ...s,
      responsibilities: s.responsibilities.filter((_, i) => i !== index),
    }));
  };

  const handleResponsibilityKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddResponsibility();
    }
  };

  const validateForm = () => {
    if (!form.jobName || !form.description || !form.location) {
      setError("Job name, description, and location are required");
      return false;
    }
    if (form.skills.length < 2 || form.skills.length > 3) {
      setError("Please provide 2 or 3 skills");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Prepare data to send - only include non-empty fields
      const dataToSend = {};
      
      // Required fields
      dataToSend.jobName = form.jobName;
      dataToSend.description = form.description;
      dataToSend.location = form.location;
      
      // Optional fields - only add if they have values
      if (form.companyName) dataToSend.companyName = form.companyName;
      if (form.image) dataToSend.image = form.image;
      if (form.ctc) dataToSend.ctc = parseFloat(form.ctc);
      if (form.eCTC) dataToSend.eCTC = parseFloat(form.eCTC);
      if (form.noticePeriod) dataToSend.noticePeriod = parseInt(form.noticePeriod);
      if (form.workingDays) dataToSend.workingDays = form.workingDays;
      if (form.jobType) dataToSend.jobType = form.jobType;
      if (form.employmentType) dataToSend.employmentType = form.employmentType;
      if (form.experienceLevel) dataToSend.experienceLevel = form.experienceLevel;
      if (form.skills.length > 0) dataToSend.skills = form.skills;
      if (form.requirements.length > 0) dataToSend.requirements = form.requirements;
      if (form.responsibilities.length > 0) dataToSend.responsibilities = form.responsibilities;

      console.log('Sending data to backend:', dataToSend);
      
      await jobService.createJob(dataToSend);
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      setError(err.message || "Failed to create job posting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, color: "#20c997" }}>
        Create New Job Posting
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
          <TextField
            label="Company Name"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Job Name"
            name="jobName"
            value={form.jobName}
            onChange={handleChange}
            fullWidth
            required
          />
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
          <TextField
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Image URL"
            name="image"
            value={form.image}
            onChange={handleChange}
            fullWidth
            placeholder="Company logo URL"
          />
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Job Type (Work Location)</InputLabel>
            <Select
              name="jobType"
              value={form.jobType}
              onChange={handleChange}
              label="Job Type (Work Location)"
            >
              <MenuItem value="onsite">Onsite</MenuItem>
              <MenuItem value="hybrid">Hybrid</MenuItem>
              <MenuItem value="remote">Remote</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Employment Type</InputLabel>
            <Select
              name="employmentType"
              value={form.employmentType}
              onChange={handleChange}
              label="Employment Type"
            >
              <MenuItem value="full_time">Full Time</MenuItem>
              <MenuItem value="part_time">Part Time</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Experience Level</InputLabel>
            <Select
              name="experienceLevel"
              value={form.experienceLevel}
              onChange={handleChange}
              label="Experience Level"
            >
              <MenuItem value="fresher">Fresher</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="experienced">Experienced</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
          <TextField
            label="Working Days"
            name="workingDays"
            value={form.workingDays}
            onChange={handleChange}
            fullWidth
            placeholder="e.g. Monday to Friday"
          />
          <TextField
            label="Notice Period"
            name="noticePeriod"
            value={form.noticePeriod}
            onChange={handleChange}
            fullWidth
            type="number"
            placeholder="Days"
          />
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2, mb: 2 }}>
          <TextField
            label="CTC (LPA)"
            name="ctc"
            value={form.ctc}
            onChange={handleChange}
            fullWidth
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">LPA</InputAdornment>,
            }}
          />
          <TextField
            label="Expected CTC (LPA)"
            name="eCTC"
            value={form.eCTC}
            onChange={handleChange}
            fullWidth
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">LPA</InputAdornment>,
            }}
          />
          <TextField
            label="Notice Period"
            name="noticePeriod"
            value={form.noticePeriod}
            onChange={handleChange}
            fullWidth
            placeholder="e.g. 2 weeks"
          />
        </Box>

        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 2 }}
          required
        />

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
            Skills (2-3 required)
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            {form.skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                onDelete={() => handleRemoveSkill(index)}
                color="primary"
              />
            ))}
          </Box>
          <TextField
            placeholder={`Enter skill (${form.skills.length}/3)`}
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={handleSkillKeyPress}
            fullWidth
            size="small"
            disabled={form.skills.length >= 3}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleAddSkill}
                    disabled={form.skills.length >= 3}
                    color="primary"
                  >
                    <AddIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
            Requirements
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            {form.requirements.map((req, index) => (
              <Chip
                key={index}
                label={req}
                onDelete={() => handleRemoveRequirement(index)}
                color="secondary"
              />
            ))}
          </Box>
          <TextField
            placeholder="Enter requirement"
            value={requirementInput}
            onChange={(e) => setRequirementInput(e.target.value)}
            onKeyPress={handleRequirementKeyPress}
            fullWidth
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleAddRequirement} color="secondary">
                    <AddIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
            Responsibilities
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            {form.responsibilities.map((resp, index) => (
              <Chip
                key={index}
                label={resp}
                onDelete={() => handleRemoveResponsibility(index)}
                color="success"
              />
            ))}
          </Box>
          <TextField
            placeholder="Enter responsibility"
            value={responsibilityInput}
            onChange={(e) => setResponsibilityInput(e.target.value)}
            onKeyPress={handleResponsibilityKeyPress}
            fullWidth
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleAddResponsibility} color="success">
                    <AddIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button onClick={onClose} variant="outlined" disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Creating..." : "Create Job"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CreateJob;