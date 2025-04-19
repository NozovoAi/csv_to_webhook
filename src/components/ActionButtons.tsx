import React from 'react';
import { 
  Button, 
  Box, 
  Stack,
  Tooltip
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import BugReportIcon from '@mui/icons-material/BugReport';

interface ActionButtonsProps {
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onTest: () => void;
  isProcessing: boolean;
  isComplete: boolean;
  isTesting: boolean;
  isReady: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onStart,
  onStop,
  onReset,
  onTest,
  isProcessing,
  isComplete,
  isTesting,
  isReady
}) => {
  return (
    <Box sx={{ my: 2 }}>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Tooltip title={isReady ? "Start processing" : "Please upload a CSV and configure settings first"}>
          <span>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlayArrowIcon />}
              onClick={onStart}
              disabled={!isReady || isProcessing || isTesting}
              sx={{ minWidth: 120 }}
            >
              Start
            </Button>
          </span>
        </Tooltip>
        
        <Tooltip title="Test with the first lead only">
          <span>
            <Button
              variant="contained"
              color="info"
              startIcon={<BugReportIcon />}
              onClick={onTest}
              disabled={!isReady || isProcessing || isTesting}
              sx={{ minWidth: 120 }}
            >
              Test
            </Button>
          </span>
        </Tooltip>
        
        <Tooltip title={isProcessing ? "Stop processing" : "No active process to stop"}>
          <span>
            <Button
              variant="contained"
              color="error"
              startIcon={<StopIcon />}
              onClick={onStop}
              disabled={!isProcessing && !isTesting}
              sx={{ minWidth: 120 }}
            >
              Stop
            </Button>
          </span>
        </Tooltip>
        
        <Tooltip title="Reset all data and start over">
          <span>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<DeleteIcon />}
              onClick={onReset}
              disabled={isProcessing || isTesting}
              sx={{ minWidth: 120 }}
            >
              Clear
            </Button>
          </span>
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default ActionButtons; 