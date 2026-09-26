import { useState } from "react";
import "./App.css";

function App() {

  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setMessage("Please select a CSV file.");
      return;
    }

    setFile(selectedFile);
    setRows([]);
    setMessage("");
  };

  const uploadFile = async () => {

    if (!file) {
      setMessage("Please select a CSV file first.");
      return;
    }

    setLoading(true);
    setMessage("Uploading and processing...");

    const formData = new FormData();

    formData.append("file", file);

    try {

      const response = await fetch(
        "http://localhost:5000/api/upload",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setRows(data.previewRows);

      setMessage(
        Upload successful! Showing ${data.previewRows.length} preview rows.
      );

    } catch (error) {

      console.error(error);

      setMessage(
        error.message || "Something went wrong."
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="app">

      <header className="header">

        <h1>StreamWeaver</h1>

        <p>
          High-Throughput No-Code ETL Pipeline
        </p>

      </header>


      <main className="container">

        <section className="upload-card">

          <h2>Upload Dataset</h2>

          <p>
            Upload a CSV file to preview and process your dataset.
          </p>

          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />

          {file && (

            <div className="file-info">

              <strong>Selected File:</strong>

              <span>{file.name}</span>

              <span>
                {(file.size / 1024).toFixed(2)} KB
              </span>

            </div>

          )}

          <button
            onClick={uploadFile}
            disabled={!file || loading}
          >
            {loading ? "Processing..." : "Upload CSV"}
          </button>

          {message && (

            <p className="message">
              {message}
            </p>

          )}

        </section>


        {rows.length > 0 && (

          <section className="preview-card">

            <div className="preview-header">

              <div>

                <h2>CSV Preview</h2>

                <p>
                  Showing first {rows.length} rows
                </p>

              </div>

            </div>


            <div className="table-container">

              <table>

                <thead>

                  <tr>

                    {Object.keys(rows[0]).map((column) => (

                      <th key={column}>
                        {column}
                      </th>

                    ))}

                  </tr>

                </thead>


                <tbody>

                  {rows.map((row, index) => (

                    <tr key={index}>

                      {Object.values(row).map(
                        (value, columnIndex) => (

                          <td key={columnIndex}>
                            {value}
                          </td>

                        )
                      )}

                    </tr>

                  ))}

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