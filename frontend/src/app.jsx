import { useState } from "react";
import "./App.css";

function App() {

  const [file, setFile] = useState(null);

  const [processedData, setProcessedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  const [fileName, setFileName] = useState("");

  const [stats, setStats] = useState({
    totalRows: 0,
    validRows: 0,
    invalidRows: 0,
    columns: 0,
  });

  const [columns, setColumns] = useState([]);

  const [removeEmptyRows, setRemoveEmptyRows] = useState(true);
  const [trimSpaces, setTrimSpaces] = useState(true);
  const [convertNumbers, setConvertNumbers] = useState(true);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // =============================
  // File Selection
  // =============================

  const handleFileChange = (event) => {
  const selectedFile = event.target.files[0];
console.log("FILE SELECTED:", selectedFile);
  if (!selectedFile) {
    return;
  }

  if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
    setMessage("Please select a CSV file only.");
    setFile(null);
    return;
  }

  if (selectedFile.size > 10 * 1024 * 1024) {
    setMessage("File size must be less than 10 MB.");
    setFile(null);
    return;
  }

  setFile(selectedFile);
  setFileName(selectedFile.name);
  setProcessedData([]);
  setColumns([]);

  setStats({
    totalRows: 0,
    validRows: 0,
    invalidRows: 0,
    columns: 0,
  });

  setMessage(`Selected: ${selectedFile.name}`);
};
  // =============================
  // Process Dataset
  // =============================

  const uploadFile = async () => {

    if (!file) {
      setMessage("Please select a CSV file first.");
      return;
    }

    setLoading(true);
    setMessage("Processing dataset...");

    const formData = new FormData();

    formData.append("file", file);

    formData.append(
      "removeEmptyRows",
      removeEmptyRows
    );

    formData.append(
      "trimSpaces",
      trimSpaces
    );

    formData.append(
      "convertNumbers",
      convertNumbers
    );

    try {

      const response = await fetch(
        "http://localhost:5000/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Processing failed"
        );
      }

      const transformedData =
        data.transformedData || [];

      setProcessedData(transformedData);
      setValidationErrors(data.validationErrors || []);

      setStats({
        totalRows: data.totalRows || 0,
        validRows: data.validRows || 0,
        invalidRows: data.invalidRows || 0,
        columns:
          transformedData.length > 0
            ? Object.keys(transformedData[0]).length
            : 0,
      });

      if (transformedData.length > 0) {

        setColumns(
          Object.keys(transformedData[0])
        );
      }

      setMessage(
        `Dataset processed successfully! ${transformedData.length} rows ready.`
      );

    } catch (error) {

      console.error(error);

      setMessage(
        error.message ||
        "Something went wrong."
      );

    } finally {

      setLoading(false);
    }
  };

  // =============================
  // Download Processed CSV
  // =============================

  const downloadProcessedData = () => {

    if (processedData.length === 0) {
      alert("No processed data available.");
      return;
    }

    const headers =
      Object.keys(processedData[0]);

    const csvContent = [

      headers.join(","),

      ...processedData.map((row) =>

        headers
          .map((header) =>
            `"${String(
              row[header] ?? ""
            ).replace(/"/g, '""')}"`
          )
          .join(",")

      ),

    ].join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "streamweaver_processed.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (

    <div className="app">

      {/* Header */}

      <header className="header">

        <h1>StreamWeaver</h1>

        <p>
          High-Throughput No-Code ETL Pipeline
        </p>

      </header>

      <main className="container">

        {/* Upload */}

        <section className="upload-card">

          <h2>Upload Dataset</h2>

          <p>
            Upload a CSV file to process your dataset.
          </p>

          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />

          {file && (

            <div className="file-info">

              <strong>
                Selected File:
              </strong>

              <span>
                {file.name}
              </span>

              <span>
                {(file.size / 1024).toFixed(2)} KB
              </span>

            </div>

          )}

          <button
            onClick={uploadFile}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : "Process Dataset"}
          </button>

          {message && (

            <p className="message">
              {message}
            </p>

          )}

        </section>

        {/* Pipeline Controls */}

        <section className="pipeline-card">

          <h2>Pipeline Controls</h2>

          <p>
            Configure how StreamWeaver transforms your dataset.
          </p>

          <label>

            <input
              type="checkbox"
              checked={removeEmptyRows}
              onChange={(e) =>
                setRemoveEmptyRows(
                  e.target.checked
                )
              }
            />

            Remove Empty Rows

          </label>

          <label>

            <input
              type="checkbox"
              checked={trimSpaces}
              onChange={(e) =>
                setTrimSpaces(
                  e.target.checked
                )
              }
            />

            Trim Spaces

          </label>

          <label>

            <input
              type="checkbox"
              checked={convertNumbers}
              onChange={(e) =>
                setConvertNumbers(
                  e.target.checked
                )
              }
            />

            Convert Numbers

          </label>
<button
  type="button"
  onClick={() => {
    setRemoveEmptyRows(true);
    setTrimSpaces(true);
    setConvertNumbers(true);
    setMessage("Pipeline controls reset to default.");
  }}
>
  Reset Controls
</button>
        </section>

        {/* Dashboard */}

        <section className="dashboard">

          <h2>Dataset Dashboard</h2>

          <div className="stats-grid">

            <div className="stat-card">

              <h3>Total Rows</h3>

              <strong>
                {stats.totalRows}
              </strong>

            </div>


            <div className="stat-card">

              <h3>Valid Rows</h3>

              <strong>
                {stats.validRows}
              </strong>

            </div>

            <div className="stat-card">

              <h3>Invalid Rows</h3>

              <strong>
                {stats.invalidRows}
              </strong>

            </div>

            <div className="stat-card">

              <h3>Columns</h3>

              <strong>
                {stats.columns}
              </strong>

            </div>
<div className="stat-card">
  <h3>Valid %</h3>
  <strong>
    {stats.totalRows > 0
      ? ((stats.validRows / stats.totalRows) * 100).toFixed(1)
      : 0}%
  </strong>
</div>
          </div>

        </section>
        {/* Processing Summary */}

<section className="preview-card">

  <h2>Processing Summary</h2>

  <div className="schema-list">

    <div className="schema-item">
      <strong>File:</strong>
      <span>{fileName || "No file selected"}</span>
    </div>

    <div className="schema-item">
      <strong>Empty Rows:</strong>
      <span>
        {removeEmptyRows ? "Removed" : "Kept"}
      </span>
    </div>

    <div className="schema-item">
      <strong>Spaces:</strong>
      <span>
        {trimSpaces ? "Trimmed" : "Original"}
      </span>
    </div>

    <div className="schema-item">
      <strong>Numbers:</strong>
      <span>
        {convertNumbers ? "Converted" : "Original"}
      </span>
    </div>

  </div>

</section>

        {/* Dataset Schema */}

        {columns.length > 0 && (

          <section className="preview-card">

            <h2>
              Dataset Schema
            </h2>

            <div className="schema-list">

              {columns.map(
                (column, index) => (

                  <div
                    className="schema-item"
                    key={index}
                  >

                    <strong>
                      {index + 1}.
                    </strong>

                    <span>
                      {column}
                    </span>

                  </div>

                )
              )}

            </div>

          </section>

        )}
        {/* Validation Report */}

<section className="preview-card">

  <h2>Validation Report</h2>

  <div className="stats-grid">

    <div className="stat-card">
      <h3>Total Rows</h3>
      <strong>{stats.totalRows}</strong>
    </div>

    <div className="stat-card">
      <h3>Valid Rows</h3>
      <strong>{stats.validRows}</strong>
    </div>

    <div className="stat-card">
      <h3>Invalid Rows</h3>
      <strong>{stats.invalidRows}</strong>
    </div>

  </div>

  {validationErrors.length > 0 ? (

    <div style={{ marginTop: "20px" }}>

      <h3>Validation Errors</h3>

      {validationErrors.map((error, index) => (

        <div
          key={index}
          style={{
            padding: "10px",
            marginBottom: "8px",
            background: "#fef2f2",
            borderRadius: "6px"
          }}
        >
          <strong>Row {error.row}</strong>
          {" → "}
          {error.error}
        </div>

      ))}

    </div>

  ) : (

    <p style={{ marginTop: "20px", fontWeight: "bold" }}>
      No validation errors found.
    </p>

  )}

</section>

        {/* Processed Data */}

        {processedData.length > 0 && (

          <section className="preview-card">

            <div className="preview-header">

              <div>

                <h2>
                  Processed Data Preview
                </h2>

                <p>
                  Showing processed dataset rows
                </p>
<div className="data-search">
  <input
    type="text"
    placeholder="Search processed data..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <span>
    {processedData.filter((row) =>
      Object.values(row).some((value) =>
        String(value)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    ).length} rows
  </span>
</div>

              </div>

              <button
                onClick={
                  downloadProcessedData
                }
              >
                Download Processed CSV
              </button>

            </div>

            <div className="table-container">

              <table>

                <thead>

                  <tr>

                    {Object.keys(
                      processedData[0]
                    ).map((column) => (

                      <th key={column}>
                        {column}
                      </th>

                    ))}

                  </tr>

                </thead>

                <tbody>

{processedData
  .filter((row) =>
    Object.values(row).some((value) =>
      String(value)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  )
  .map((row, index) => (
                      <tr key={index}>

                        {Object.values(row).map(
                          (value, columnIndex) => (

                            <td key={columnIndex}>
                              {String(value)}
                            </td>

                          )
                        )}

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default App;