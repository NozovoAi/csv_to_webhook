# CSV to Webhook Sender

A modern web application that processes CSV files and sends each row as a JSON object to a webhook, one at a time, with tracking and error handling.

## Features

- **Dark Theme UI**: Modern, clean interface with a dark theme for comfortable usage
- **CSV Parsing**: Automatically converts CSV data to JSON objects
- **Sequential Sending**: Sends data one row at a time, waiting for each response before sending the next
- **Test Mode**: Try with just the first lead to verify your webhook integration
- **Detailed Progress Tracking**: Track progress, successes, and failures in real-time
- **Error Handling**: Continues processing even if individual rows fail, with detailed error reporting
- **Customizable Metadata**: Add source labels and notes to each request
- **CSV Preview**: See a preview of your data before processing

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository or download the files
2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

4. Open your browser to `http://localhost:3000`

## Usage

### 1. Upload CSV File

- Drag and drop your CSV file or click to browse
- The app will parse the file and show a preview of the data

### 2. Configure Settings

- Enter your webhook URL (required)
- Add a source label to identify where these record came from (required)
- Optionally add notes that will be sent with each records
- Toggle test mode if you want to test with just the first records

### 3. Process rows

- Click "Test" to send just the first row as a test
- Click "Start" to process the entire file
- Monitor progress in real-time
- View successes and failures
- Stop processing at any time

## Webhook Format

The application sends each row as a JSON object with all CSV columns as properties. It adds two additional fields:

- `source`: The source label you specified
- `notes`: Any notes you provided

Example webhook payload:

```json
{
  "Linked Url": "https://linkedin.com/in/example",
  "Full Name": "John Doe",
  "First Name": "John",
  "Last Name": "Doe",
  "Job Title": "Manager",
  "source": "LeadRocks Campaign",
  "notes": "Follow up within 2 days"
  // ... all other CSV columns
}
```

## Tech Stack

- Next.js
- React
- TypeScript
- Material UI
- PapaParse (CSV parsing)
- Axios (HTTP requests)
- React Dropzone (File uploads)

## License

MIT License 
