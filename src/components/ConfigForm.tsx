import React from 'react';
import { 
  TextField, 
  Grid, 
  Box, 
  Paper, 
  Typography, 
  Switch, 
  FormControlLabel 
} from '@mui/material';
import { ProcessConfig } from '@/types';

interface ConfigFormProps {
  config: ProcessConfig;
  onConfigChange: (field: keyof ProcessConfig, value: string) => void;
  testMode: boolean;
  onTestModeChange: (checked: boolean) => void;
}

const ConfigForm: React.FC<ConfigFormProps> = ({
  config,
  onConfigChange,
  testMode,
  onTestModeChange
}) => {
  return (
    <Paper sx={{ p: 3, my: 2, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Configuration
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Webhook URL"
              variant="outlined"
              value={config.webhookUrl}
              onChange={(e) => onConfigChange('webhookUrl', e.target.value)}
              placeholder="https://your-webhook-url.com"
              helperText="The endpoint to send lead data to"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Source Label"
              variant="outlined"
              value={config.sourceLabel}
              onChange={(e) => onConfigChange('sourceLabel', e.target.value)}
              placeholder="Lead Rocks Campaign"
              helperText="Identify the source of these leads"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Notes"
              variant="outlined"
              value={config.notes}
              onChange={(e) => onConfigChange('notes', e.target.value)}
              placeholder="Additional context for this batch"
              helperText="Optional notes to include with each lead"
              multiline
              rows={1}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={testMode}
                  onChange={(e) => onTestModeChange(e.target.checked)}
                  color="primary"
                />
              }
              label="Test Mode (Send only the first lead)"
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Enable this to send only the first lead as a test before processing the entire file
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ConfigForm; 