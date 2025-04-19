import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Paper } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelected(acceptedFiles[0]);
      }
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  return (
    <Paper
      sx={{
        p: 3,
        my: 2,
        borderRadius: 2,
        border: '2px dashed',
        borderColor: isDragActive ? 'primary.main' : 'grey.500',
        backgroundColor: 'background.paper',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: 'primary.main',
        },
        cursor: 'pointer',
        textAlign: 'center',
      }}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Box display="flex" flexDirection="column" alignItems="center" p={2}>
        <CloudUploadIcon fontSize="large" color="primary" sx={{ mb: 2 }} />
        <Typography variant="h6" color="textPrimary" gutterBottom>
          {isDragActive
            ? 'Drop the CSV file here'
            : 'Drag & drop your CSV file here, or click to select file'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Only .csv files are accepted
        </Typography>
      </Box>
    </Paper>
  );
};

export default FileUpload; 