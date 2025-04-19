export interface CSVRow {
  [key: string]: string;
}

export interface ProcessConfig {
  webhookUrl: string;
  sourceLabel: string;
  notes: string;
}

export interface ProcessStatus {
  total: number;
  processed: number;
  successful: number;
  failed: number;
  currentItem?: CSVRow;
  errors: Array<{
    item: CSVRow;
    error: string;
  }>;
  inProgress: boolean;
  testMode: boolean;
}

export interface WebhookResponse {
  success: boolean;
  message?: string;
} 