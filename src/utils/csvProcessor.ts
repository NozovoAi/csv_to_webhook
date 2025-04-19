import Papa from 'papaparse';
import axios from 'axios';
import { CSVRow, ProcessConfig, WebhookResponse } from '@/types';

export const parseCSV = (file: File): Promise<CSVRow[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data as CSVRow[]);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

export const sendToWebhook = async (
  item: CSVRow,
  config: ProcessConfig
): Promise<WebhookResponse> => {
  try {
    const payload = {
      ...item,
      source: config.sourceLabel,
      notes: config.notes,
    };
    
    const response = await axios.post(config.webhookUrl, payload);
    
    if (response.status >= 200 && response.status < 300) {
      return { success: true };
    } else {
      return { 
        success: false, 
        message: `Server responded with status ${response.status}` 
      };
    }
  } catch (error) {
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, message: errorMessage };
  }
}; 