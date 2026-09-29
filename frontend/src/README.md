StreamWeaver

High-Throughput No-Code ETL Pipeline

StreamWeaver is a web-based no-code ETL (Extract, Transform, Load) pipeline that allows users to upload CSV datasets, clean and transform the data, validate the dataset, preview processed records, and download the processed CSV file.

Features

- CSV dataset upload
- Automatic data extraction
- Remove empty rows
- Trim unnecessary spaces
- Convert numeric values automatically
- Column name normalization
- Dataset validation
- Validation error reporting
- Dataset statistics dashboard
- Dataset schema display
- Processed data preview
- Download processed CSV
- Simple and responsive user interface

ETL Workflow

CSV Upload
    ↓
Data Extraction
    ↓
Data Validation
    ↓
Data Transformation
    ↓
Data Quality Report
    ↓
Processed Data Preview
    ↓
Download Processed CSV

Pipeline Controls

StreamWeaver provides configurable transformation options:

Remove Empty Rows

Removes completely empty records from the uploaded dataset.

Trim Spaces

Removes unnecessary spaces from CSV values.

Convert Numbers

Automatically converts numeric values from strings into numbers.

Dashboard

The dashboard displays:

- Total Rows
- Valid Rows
- Invalid Rows
- Number of Columns

Validation Report

The validation report displays detected data-quality issues with:

- Row number
- Validation error
- Total invalid rows

Dataset Schema

StreamWeaver automatically detects and displays the processed dataset columns.

Column names are normalized by:

- Removing unnecessary spaces
- Converting names to lowercase
- Replacing spaces with underscores

Example:

First Name → first_name
Email Address → email_address

Technology Stack

Frontend

- React
- Vite
- JavaScript
- CSS

Backend

- Node.js
- Express.js
- Multer
- CSV Parser
- CORS

Project Structure

streamweaver/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.tsx
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md

Installation

1. Clone the Repository

git clone https://github.com/akankshapunjare/streamweaver.git

2. Open the Project

cd streamweaver

Backend Setup

Open a terminal inside the backend folder:

cd backend

Install dependencies:

npm install

Start the backend:

node server.js

The backend runs on:

http://localhost:5000

Frontend Setup

Open another terminal:

cd frontend

Install dependencies:

npm install

Start the frontend:

npm run dev

The frontend normally runs on:

http://localhost:5173

How to Use

1. Start the backend server.
2. Start the frontend development server.
3. Open StreamWeaver in the browser.
4. Select a CSV file.
5. Configure the pipeline controls.
6. Click Process Dataset.
7. View dataset statistics.
8. Check the validation report.
9. View the processed data preview.
10. Download the processed CSV.

Sample Dataset

Example CSV:

first_name,email,age,city
Akanksha,akanksha@gmail.com,20,Latur
Rahul,rahul@gmail.com,22,Pune
Sneha,sneha@gmail.com,21,Mumbai
Priya,priya@gmail.com,23,Nashik

Future Enhancements

Possible future improvements include:

- Support for Excel and JSON files
- More transformation operations
- Advanced data-quality rules
- Large dataset processing optimization
- Data visualization and analytics
- Database export
- User authentication
- Cloud deployment

Project Objective

The objective of StreamWeaver is to simplify common ETL operations through an easy-to-use interface without requiring users to write transformation code.

Author

Akanksha Punjare

B.Tech Computer Science & Engineering