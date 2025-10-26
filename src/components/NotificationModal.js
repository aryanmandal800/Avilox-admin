import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import styled from '@emotion/styled';

const NotificationModal = ({ open, onClose, type = 'success', title, message }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <StyledSuccessIcon />;
      case 'error':
        return <StyledErrorIcon />;
      case 'warning':
        return <StyledWarningIcon />;
      case 'info':
        return <StyledInfoIcon />;
      default:
        return <StyledSuccessIcon />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success':
        return '#20c997';
      case 'error':
        return '#dc3545';
      case 'warning':
        return '#ffc107';
      case 'info':
        return '#0d6efd';
      default:
        return '#20c997';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          minWidth: '400px',
          padding: '8px',
        },
      }}
    >
      <ContentContainer>
        <IconContainer color={getColor()}>
          {getIcon()}
        </IconContainer>
        <ContentWrapper>
          {title && (
            <DialogTitle sx={{ padding: '8px 0', fontWeight: 600 }}>
              {title}
            </DialogTitle>
          )}
          <DialogContent sx={{ padding: '8px 0' }}>
            <Typography variant="body1" color="text.secondary">
              {message}
            </Typography>
          </DialogContent>
        </ContentWrapper>
      </ContentContainer>
      <DialogActions sx={{ padding: '16px', justifyContent: 'center' }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: getColor(),
            minWidth: '100px',
            '&:hover': {
              backgroundColor: getColor(),
              opacity: 0.8,
            },
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationModal;

const ContentContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '16px',
});

const ContentWrapper = styled(Box)({
  textAlign: 'center',
  width: '100%',
});

const IconContainer = styled(Box)(({ color }) => ({
  width: '64px',
  height: '64px',
  borderRadius: '50%',
  backgroundColor: `${color}20`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px',
}));

const StyledSuccessIcon = styled(CheckCircleIcon)({
  fontSize: '40px',
  color: '#20c997',
});

const StyledErrorIcon = styled(ErrorIcon)({
  fontSize: '40px',
  color: '#dc3545',
});

const StyledWarningIcon = styled(WarningIcon)({
  fontSize: '40px',
  color: '#ffc107',
});

const StyledInfoIcon = styled(InfoIcon)({
  fontSize: '40px',
  color: '#0d6efd',
});

