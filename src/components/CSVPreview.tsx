import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip
} from '@mui/material';
import { CSVRow } from '@/types';

interface CSVPreviewProps {
  data: CSVRow[];
  fileName: string;
}

const CSVPreview: React.FC<CSVPreviewProps> = ({ data, fileName }) => {
  if (!data.length) return null;

  // Get headers from the first row
  const headers = Object.keys(data[0]);
  
  // Only show first 5 rows in preview
  const previewData = data.slice(0, 5);
  
  return (
    <Paper sx={{ p: 3, my: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          CSV Preview
        </Typography>
        <Box>
          <Chip
            label={`${data.length} rows total`}
            color="primary"
            size="small"
            sx={{ mr: 1 }}
          />
          <Chip
            label={fileName}
            color="secondary"
            size="small"
          />
        </Box>
      </Box>
      
      <TableContainer sx={{ maxHeight: 400, overflowX: 'auto' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell key={header} sx={{ fontWeight: 'bold' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {previewData.map((row, index) => (
              <TableRow key={index} hover>
                {headers.map((header) => (
                  <TableCell key={`${index}-${header}`}>
                    {row[header] || ''}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      {data.length > 5 && (
        <Typography variant="body2" color="textSecondary" sx={{ mt: 2, textAlign: 'center' }}>
          Showing 5 of {data.length} rows
        </Typography>
      )}
    </Paper>
  );
};

export default CSVPreview; 