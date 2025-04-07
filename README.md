# Excel Analyzer Web Application

A web application that allows you to upload Excel files and analyze their contents. The application features a drag-and-drop interface and displays the data in a two-panel layout.

## Features

- Drag and drop Excel file upload
- Two-panel layout:
  - Left panel: Table view with checkboxes for each row
  - Right panel: Reference count statistics
- Support for .xlsx and .xls file formats

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Drag and drop an Excel file onto the upload area or click to select a file
2. The application will automatically:
   - Display the data in a table format
   - Show checkboxes for each row
   - Calculate and display reference counts from the third column

## Requirements

- Node.js (v14 or higher)
- npm (v6 or higher)

## Dependencies

- React
- Material-UI
- XLSX
- React-Dropzone 