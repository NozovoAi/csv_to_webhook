import React from 'react';
import { 
  Paper, 
  Typography, 
  LinearProgress, 
  Box, 
  Chip, 
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import { ProcessStatus, CSVRow } from '@/types';

interface ProgressTrackerProps {
  status: ProcessStatus;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ status }) => {
  const progressPercentage = status.total > 0 
    ? Math.round((status.processed / status.total) * 100) 
    : 0;

  return (
    <Paper sx={{ p: 3, my: 2, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Progress
      </Typography>
      
      {status.inProgress && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="textSecondary">
              {status.testMode ? 'Testing...' : 'Processing leads...'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {progressPercentage}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progressPercentage} 
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>
      )}
      
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Chip 
          icon={<InfoIcon />} 
          label={`Total: ${status.total}`}
          color="primary" 
          variant="outlined"
        />
        <Chip 
          icon={<InfoIcon />} 
          label={`Processed: ${status.processed}`}
          color="secondary" 
          variant="outlined"
        />
        <Chip 
          icon={<CheckCircleIcon />} 
          label={`Successful: ${status.successful}`}
          color="success" 
          variant="outlined"
        />
        <Chip 
          icon={<ErrorIcon />} 
          label={`Failed: ${status.failed}`}
          color="error" 
          variant="outlined"
        />
      </Stack>
      
      {status.currentItem && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Currently processing: {status.currentItem['Full Name'] || 'Unknown lead'}
          </Typography>
        </Alert>
      )}
      
      {status.errors.length > 0 && (
        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography color="error">
              {status.errors.length} Error{status.errors.length > 1 ? 's' : ''} Occurred
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1}>
              {status.errors.map((error, index) => (
                <Alert key={index} severity="error">
                  <Typography variant="body2">
                    <strong>{error.item['Full Name'] || 'Unknown lead'}</strong>: {error.error}
                  </Typography>
                </Alert>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}
    </Paper>
  );
};

export default ProgressTracker; 