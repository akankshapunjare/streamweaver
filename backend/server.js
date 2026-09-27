require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const csv = require("csv-parser");

const app = express();

app.use(cors());
app.use(express.json());

// =============================
// File Upload Configuration
// =============================

const upload = multer({
    dest: "uploads/"
});

// =============================
// Test Route
// =============================

app.get("/", (req, res) => {
    res.json({
        message: "StreamWeaver Backend is running!"
    });
});

// =============================
// CSV Upload + ETL Processing
// =============================

app.post("/api/upload", upload.single("file"), (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded"
        });
    }

    const filePath = req.file.path;
    const rows = [];
    const validationErrors = [];

    let totalRows = 0;

    fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {

            totalRows++;

            // Basic validation
            if (!row || Object.keys(row).length === 0) {

                validationErrors.push({
                    row: totalRows,
                    error: "Empty row"
                });

                return;
            }

            // =============================
            // Data Transformation
            // =============================

            const transformedRow = {};

            Object.keys(row).forEach((key) => {

                const cleanKey = key
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, "_");

                let value = row[key];

                // Convert numbers
                if (value !== "" && !isNaN(value)) {
                    value = Number(value);
                }

                // Remove extra spaces from text
                if (typeof value === "string") {
                    value = value.trim();
                }

                transformedRow[cleanKey] = value;
            });

            // Store transformed data
            if (rows.length < 1000) {
                rows.push(transformedRow);
            }
        })
        .on("end", () => {

            // Delete temporary uploaded file
            fs.unlink(filePath, (error) => {

                if (error) {
                    console.error("File cleanup error:", error);
                }

            });

            res.json({

                message: "CSV uploaded and transformed successfully",

                fileName: req.file.originalname,

                fileSize: req.file.size,

                totalRows: totalRows,

                validRows:
                    totalRows - validationErrors.length,

                invalidRows:
                    validationErrors.length,

                validationErrors:
                    validationErrors,

                transformedData:
                    rows

            });
        })
        .on("error", (error) => {

            console.error(error);

            res.status(500).json({
                message: "Error processing CSV"
            });
        });
});

// =============================
// Start Server
// =============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `StreamWeaver Backend running on port ${PORT}`
    );

});