import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const analyzeWebsite = async () => {
    if (!url.trim()) {
      alert("Please enter a website URL.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("http://localhost:5001/api/analyze", {
        url,
      });

      const jobId = response.data.jobId;

      checkJobStatus(jobId);
    } catch (error) {
      setLoading(false);

      alert(error.response?.data?.message || "Failed to start analysis.");
    }
  };

  const checkJobStatus = (jobId) => {
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/job/${jobId}`,
          {
            headers: {
              "Cache-Control": "no-cache",
            },
          },
        );

        const job = response.data.data;

        if (job.status === "completed") {
          clearInterval(interval);

          setLoading(false);

          navigate(`/report/${jobId}`);
        }

        if (job.status === "failed") {
          clearInterval(interval);

          setLoading(false);

          alert("Analysis failed.");
        }
      } catch (error) {
        // Ignore temporary 404s while waiting
        if (error.response && error.response.status === 404) {
          return;
        }

        clearInterval(interval);
        setLoading(false);

        alert(error.response?.data?.message || "Server Error");
      }
    }, 2000);
  };

  return (
    <div
      style={{
        width: "500px",
        margin: "80px auto",
        textAlign: "center",
      }}
    >
      <h1>SEO Analyzer</h1>

      <input
        type="text"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "20px",
        }}
      />

      <button
        onClick={analyzeWebsite}
        disabled={loading}
        style={{
          marginTop: "20px",
          padding: "12px 25px",
          cursor: "pointer",
        }}
      >
        {loading ? "Analyzing..." : "Analyze Website"}
      </button>
    </div>
  );
}

export default Home;
