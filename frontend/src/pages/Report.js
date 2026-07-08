import "./Report.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function StatusBadge({ status }) {
  const cls =
    status === "pass"
      ? "pass"
      : status === "warning"
      ? "warning"
      : "error";

  return (
    <span className={`badge ${cls}`}>
      {status?.toUpperCase()}
    </span>
  );
}

function Report() {
  const { jobId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `https://seo-analyzer-backend-rvh5.onrender.com/api/results/${jobId}`
        );
        setReport(res.data.data);
      } catch (e) {
        alert("Unable to load report.");
      } finally {
        setLoading(false);
      }
    })();
  }, [jobId]);

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  if (!report) return <h2 style={{ textAlign: "center" }}>Report Not Found</h2>;

  const { summary, crawler, onPage, technical,performance, content } = report;

  return (
    <div className="report-container">
      <h1 className="page-title">SEO Analysis Report</h1>

<div className="summary-grid">

  {/* Left Card */}
  <div className="summary-card info-card">

    <div className="info-box">
      <div className="info-icon">🌐</div>
      <div className="info-content">
        <p>Website</p>
        <h4>{report.url}</h4>
      </div>
    </div>

    <div className="info-box">
      <div className="info-icon">🏆</div>
      <div className="info-content">
        <p>Grade</p>
        <h4>{summary.grade}</h4>
      </div>
    </div>

    <div className="info-box">
      <div className="info-icon">⚡</div>
      <div className="info-content">
        <p>Execution Time</p>
        <h4>{summary.executionTime} ms</h4>
      </div>
    </div>

  </div>

  {/* Right Card */}
  <div className="summary-card score-card">

    <h3>SEO Score</h3>

    <div
      className="circle-progress"
      style={{
        background: `conic-gradient(
          ${
            summary.overallScore >= 80
              ? "#22c55e"
              : summary.overallScore >= 60
              ? "#f59e0b"
              : "#ef4444"
          } ${summary.overallScore * 3.6}deg,
          #e5e7eb 0deg
        )`,
      }}
    >
      <div className="circle-inner">
        <span className="score">{summary.overallScore}</span>
        <small>/100</small>
      </div>
    </div>

  </div>

</div>

      <div className="section">
        <h2>Crawler Information</h2>

        <div className="metric-row"><strong>Title:</strong> {crawler.title}</div>
        <div className="metric-row"><strong>Final URL:</strong> {crawler.finalUrl}</div>
        <div className="metric-row"><strong>Status Code:</strong> {crawler.statusCode}</div>
        <div className="metric-row"><strong>Response Time:</strong> {crawler.responseTime} ms</div>
        <div className="metric-row"><strong>Page Size:</strong> {crawler.pageSize} bytes</div>
        <div className="metric-row"><strong>Server:</strong> {crawler.headers.server}</div>
      </div>

      <div className="section">
        <h2>On-Page SEO</h2>

        {Object.entries(onPage).map(([key, value]) => (
          <div className="metric" key={key}>
            <div className="metric-title">{key}</div>

            {"status" in value && (
              <div className="metric-row">
                <strong>Status:</strong>
                <StatusBadge status={value.status} />
              </div>
            )}

            {Object.entries(value).map(([k, v]) => {
              if (["status", "recommendation"].includes(k)) return null;
              return (
                <div className="metric-row" key={k}>
                  <strong>{k}:</strong>{" "}
                  {typeof v === "object" ? JSON.stringify(v) : String(v)}
                </div>
              );
            })}

            {value.recommendation && (
              <div className="recommendation">
                <strong>Recommendation:</strong> {value.recommendation}
              </div>
            )}
          </div>
        ))}
      </div>


<div className="section">
  <h2>Technical SEO</h2>

  {Object.entries(technical).map(([key, value]) => (
    <div className="metric" key={key}>
      <div className="metric-title">{key}</div>

      {value && typeof value === "object" && !Array.isArray(value) ? (
        <>
          {Object.prototype.hasOwnProperty.call(value, "status") && (
            <div className="metric-row">
              <strong>Status:</strong>
              <StatusBadge status={value.status} />
            </div>
          )}

          {Object.entries(value).map(([k, v]) => {
            if (["status", "recommendation"].includes(k)) return null;
            return (
              <div className="metric-row" key={k}>
                <strong>{k}:</strong>{" "}
                {v && typeof v === "object" ? JSON.stringify(v) : String(v)}
              </div>
            );
          })}

          {Object.prototype.hasOwnProperty.call(value, "recommendation") &&
            value.recommendation && (
              <div className="recommendation">
                <strong>Recommendation:</strong> {value.recommendation}
              </div>
            )}
        </>
      ) : (
        <div className="metric-row">
          <strong>Value:</strong> {String(value)}</div>
      )}
    </div>
  ))}
</div>

<div className="section">
  <h2>Performance</h2>

  {Object.entries(performance).map(([key, value]) => (
    <div className="metric" key={key}>
      <div className="metric-title">{key}</div>

      {value && typeof value === "object" && !Array.isArray(value) ? (
        <>
          {Object.prototype.hasOwnProperty.call(value, "status") && (
            <div className="metric-row">
              <strong>Status:</strong>
              <StatusBadge status={value.status} />
            </div>
          )}

          {Object.entries(value).map(([k, v]) => {
            if (["status", "recommendation"].includes(k)) return null;
            return (
              <div className="metric-row" key={k}>
                <strong>{k}:</strong>{" "}
                {v && typeof v === "object" ? JSON.stringify(v) : String(v)}
              </div>
            );
          })}

          {Object.prototype.hasOwnProperty.call(value, "recommendation") &&
            value.recommendation && (
              <div className="recommendation">
                <strong>Recommendation:</strong> {value.recommendation}
              </div>
            )}
        </>
      ) : (
        <div className="metric-row">
          <strong>Value:</strong> {String(value)}</div>
      )}
    </div>
  ))}
</div>

<div className="section">
  <h2>Content Analysis</h2>

  {Object.entries(content).map(([key, value]) => (
    <div className="metric" key={key}>
      <div className="metric-title">{key}</div>

      {value && typeof value === "object" && !Array.isArray(value) ? (
        <>
          {Object.prototype.hasOwnProperty.call(value, "status") && (
            <div className="metric-row">
              <strong>Status:</strong>
              <StatusBadge status={value.status} />
            </div>
          )}

          {Object.entries(value).map(([k, v]) => {
            if (["status", "recommendation"].includes(k)) return null;
            return (
              <div className="metric-row" key={k}>
                <strong>{k}:</strong>{" "}
                {v && typeof v === "object" ? JSON.stringify(v) : String(v)}
              </div>
            );
          })}

          {Object.prototype.hasOwnProperty.call(value, "recommendation") &&
            value.recommendation && (
              <div className="recommendation">
                <strong>Recommendation:</strong> {value.recommendation}
              </div>
            )}
        </>
      ) : (
        <div className="metric-row">
          <strong>Value:</strong> {String(value)}</div>
      )}
    </div>
  ))}
</div>


    </div>
  );
}

export default Report;