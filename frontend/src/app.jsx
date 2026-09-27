import { useState } from "react";
import "./App.css";

function App() {
  const [stats, setStats] = useState({
    totalRows: 0,
    validRows: 0,
    invalidRows: 0,
    columns: 0,
  });

  const [columns, setColumns] = useState([]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    setStats({
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      columns: 0,
    });

    setColumns([]);
  };

  const uploadFile = async () => {
    const input = document.querySelector('input[type="file"]');
    const file = input?.files[0];

    if (!file) {
      alert("Please select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

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
        throw new Error(data.message || "Upload failed");
      }

      const transformedData = data.transformedData || [];

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
        setColumns(Object.keys(transformedData[0]));
      }

      alert("Dataset processed successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message || "Something went wrong.");
    }
  };

  return (
    <div className="app">

      <header className="header">
        <h1>StreamWeaver</h1>
        <p>High-Throughput No-Code ETL Pipeline</p>
      </header>

      <main className="container">

        {/* Upload Section */}
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

          <button onClick={uploadFile}>
            Process Dataset
          </button>

        </section>

        {/* Dashboard */}
        <section className="dashboard">

          <h2>Dataset Dashboard</h2>

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

            <div className="stat-card">
              <h3>Columns</h3>
              <strong>{stats.columns}</strong>
            </div>

          </div>

        </section>

        {/* Dataset Schema */}
        {columns.length > 0 && (
          <section className="preview-card">

            <h2>Dataset Schema</h2>

            <div className="schema-list">

              {columns.map((column, index) => (
                <div className="schema-item" key={index}>
                  <strong>{index + 1}.</strong>
                  <span>{column}</span>
                </div>
              ))}

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

export default App;