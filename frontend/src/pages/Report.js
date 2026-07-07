import "./Report.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


function Report() {
  const { jobId } = useParams();

  const [report, setReport] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/results/${jobId}`
      );

      setReport(response.data.data);
    } catch (error) {
      alert("Unable to load report.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading Report...</h2>;
  }

  if (!report) {
    return <h2 style={{ textAlign: "center" }}>Report Not Found</h2>;
  }

  const { summary } = report;

  return (
    <div
      style={{
        width: "90%",
        margin: "30px auto",
        fontFamily: "Arial",
      }}
    >
      <h1>SEO Analysis Report</h1>

      <hr />

      <h2>Summary</h2>

      <p>
        <strong>Website:</strong> {report.url}
      </p>

      <p>
        <strong>Overall Score:</strong> {summary.overallScore}
      </p>

      <p>
        <strong>Grade:</strong> {summary.grade}
      </p>

      <p>
        <strong>Execution Time:</strong>{" "}
        {summary.executionTime} ms
      </p>

      <p>
        <strong>Completed:</strong>{" "}
        {new Date(summary.completedAt).toLocaleString()}
      </p>

      <hr />

      <h2>Crawler Information</h2>

      <pre>{JSON.stringify(report.crawler, null, 2)}</pre>

      <hr />

      <h2>On Page SEO</h2>

      <pre>{JSON.stringify(report.onPage, null, 2)}</pre>

      <hr />

      <h2>Technical SEO</h2>

      <pre>{JSON.stringify(report.technical, null, 2)}</pre>

      <hr />

      <h2>Performance</h2>

      <pre>{JSON.stringify(report.performance, null, 2)}</pre>

      <hr />

      <h2>Content Analysis</h2>

      <pre>{JSON.stringify(report.content, null, 2)}</pre>

      <hr />

      <h2>Recommendations</h2>

      {report.recommendations.length === 0 ? (
        <p>No recommendations.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          cellSpacing="0"
          width="100%"
        >
          <thead>
            <tr>
              <th>Category</th>
              <th>Check</th>
              <th>Severity</th>
              <th>Recommendation</th>
            </tr>
          </thead>

          <tbody>
            {report.recommendations.map((item, index) => (
              <tr key={index}>
                <td>{item.category}</td>

                <td>{item.check}</td>

                <td>{item.severity}</td>

                <td>{item.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Report;