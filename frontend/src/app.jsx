import { useState } from "react";
import "./App.css";

function App() {

  const [file, setFile] = useState(null);

  const [processedData, setProcessedData] = useState([]);

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

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setProcessedData([]);
    setColumns([]);

    setStats({
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      columns: 0,
    });

    setMessage(Selected: ${selectedFile.name});
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
        Dataset processed successfully! ${transformedData.length} rows ready.
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

                  {processedData.map(
                    (row, index) => (

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