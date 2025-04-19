import React, { useState, useCallback, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Stepper,
  Step,
  StepLabel,
  AppBar,
  Toolbar,
  useTheme,
} from '@mui/material';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import FileUpload from '@/components/FileUpload';
import ConfigForm from '@/components/ConfigForm';
import ProgressTracker from '@/components/ProgressTracker';
import CSVPreview from '@/components/CSVPreview';
import ActionButtons from '@/components/ActionButtons';
import { parseCSV, sendToWebhook } from '@/utils/csvProcessor';
import { CSVRow, ProcessConfig, ProcessStatus } from '@/types';

export default function Home() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [fileName, setFileName] = useState('');
  const [config, setConfig] = useState<ProcessConfig>({
    webhookUrl: '',
    sourceLabel: '',
    notes: '',
  });
  const [status, setStatus] = useState<ProcessStatus>({
    total: 0,
    processed: 0,
    successful: 0,
    failed: 0,
    errors: [],
    inProgress: false,
    testMode: false,
  });
  
  const abortController = useRef<AbortController | null>(null);
  
  const handleFileSelect = async (file: File) => {
    try {
      setFileName(file.name);
      const data = await parseCSV(file);
      setCsvData(data);
      setStatus({
        ...status,
        total: data.length,
        processed: 0,
        successful: 0,
        failed: 0,
        errors: [],
        inProgress: false,
      });
      setActiveStep(1);
    } catch (error) {
      console.error('Error parsing CSV:', error);
    }
  };
  
  const handleConfigChange = (field: keyof ProcessConfig, value: string) => {
    setConfig({ ...config, [field]: value });
  };
  
  const handleTestModeChange = (checked: boolean) => {
    setStatus({ ...status, testMode: checked });
  };
  
  const stopProcessing = () => {
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }
    setStatus((prev) => ({ ...prev, inProgress: false }));
  };
  
  const resetAll = () => {
    stopProcessing();
    setCsvData([]);
    setFileName('');
    setConfig({
      webhookUrl: '',
      sourceLabel: '',
      notes: '',
    });
    setStatus({
      total: 0,
      processed: 0,
      successful: 0,
      failed: 0,
      errors: [],
      inProgress: false,
      testMode: false,
    });
    setActiveStep(0);
  };

  const processCSVData = async (testOnly: boolean) => {
    if (!csvData.length || !config.webhookUrl) return;
    
    abortController.current = new AbortController();
    const signal = abortController.current.signal;
    
    setStatus((prev) => ({
      ...prev,
      inProgress: true,
      testMode: testOnly,
      processed: 0,
      successful: 0,
      failed: 0,
      errors: [],
    }));
    
    setActiveStep(2);
    
    try {
      const itemsToProcess = testOnly ? csvData.slice(0, 1) : csvData;
      
      for (let i = 0; i < itemsToProcess.length; i++) {
        if (signal.aborted) break;
        
        const item = itemsToProcess[i];
        
        setStatus((prev) => ({ ...prev, currentItem: item }));
        
        try {
          const response = await sendToWebhook(item, config);
          
          if (response.success) {
            setStatus((prev) => ({
              ...prev,
              processed: prev.processed + 1,
              successful: prev.successful + 1,
            }));
          } else {
            setStatus((prev) => ({
              ...prev,
              processed: prev.processed + 1,
              failed: prev.failed + 1,
              errors: [...prev.errors, { item, error: response.message || 'Unknown error' }],
            }));
          }
          
          // Add a small delay between requests to avoid overwhelming the server
          if (i < itemsToProcess.length - 1 && !signal.aborted) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        } catch (error) {
          setStatus((prev) => ({
            ...prev,
            processed: prev.processed + 1,
            failed: prev.failed + 1,
            errors: [...prev.errors, { 
              item, 
              error: error instanceof Error ? error.message : 'Unknown error' 
            }],
          }));
        }
      }
    } finally {
      abortController.current = null;
      setStatus((prev) => ({ 
        ...prev, 
        inProgress: false,
        currentItem: undefined
      }));
    }
  };
  
  const handleStartProcessing = () => processCSVData(false);
  const handleTestProcessing = () => processCSVData(true);
  
  const isReadyToProcess = csvData.length > 0 && config.webhookUrl.trim() !== '' && config.sourceLabel.trim() !== '';
  const isComplete = status.processed > 0 && status.processed === status.total;
  
  const steps = ['Upload CSV', 'Configure', 'Process'];

  return (
    <>
      <AppBar position="sticky" sx={{ mb: 4 }}>
        <Toolbar>
          <CloudSyncIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CSV to Webhook Sender
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg">
        <Paper sx={{ p: 3, my: 2, borderRadius: 2 }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box sx={{ mb: 4 }}>
            {activeStep === 0 && (
              <>
                <Typography variant="h5" gutterBottom align="center">
                  Upload Your CSV File
                </Typography>
                <Typography variant="body1" gutterBottom align="center" color="textSecondary">
                  Start by uploading the CSV file with your leads data
                </Typography>
                <FileUpload onFileSelected={handleFileSelect} />
              </>
            )}
            
            {csvData.length > 0 && (
              <>
                {activeStep === 1 && (
                  <>
                    <Typography variant="h5" gutterBottom align="center">
                      Configure Webhook Settings
                    </Typography>
                    <Typography variant="body1" gutterBottom align="center" color="textSecondary">
                      Configure where to send the data and additional information
                    </Typography>
                  </>
                )}
                
                {activeStep === 2 && (
                  <>
                    <Typography variant="h5" gutterBottom align="center">
                      Processing Leads
                    </Typography>
                    <Typography variant="body1" gutterBottom align="center" color="textSecondary">
                      {status.testMode 
                        ? 'Testing with the first lead' 
                        : 'Sending each lead to the webhook one by one'}
                    </Typography>
                  </>
                )}
                
                <ConfigForm 
                  config={config} 
                  onConfigChange={handleConfigChange}
                  testMode={status.testMode}
                  onTestModeChange={handleTestModeChange}
                />
                
                <CSVPreview data={csvData} fileName={fileName} />
                
                <ProgressTracker status={status} />
                
                <Divider sx={{ my: 2 }} />
                
                <ActionButtons
                  onStart={handleStartProcessing}
                  onStop={stopProcessing}
                  onReset={resetAll}
                  onTest={handleTestProcessing}
                  isProcessing={status.inProgress}
                  isComplete={isComplete}
                  isTesting={status.testMode && status.inProgress}
                  isReady={isReadyToProcess}
                />
              </>
            )}
          </Box>
        </Paper>
        
        <Box sx={{ textAlign: 'center', mt: 4, mb: 2, color: theme.palette.text.secondary }}>
          <Typography variant="body2">
            CSV to Webhook Sender • Send your lead data one by one to any webhook
          </Typography>
        </Box>
      </Container>
    </>
  );
} 