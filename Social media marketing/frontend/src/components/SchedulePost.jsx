import { useState, useEffect } from "react";
import { useApi } from "../utils/api";
import './SocialMediaManager.css';

export default function SchedulePost() {
  const { makeRequest } = useApi();
  const [generatedContent, setGeneratedContent] = useState(null);
  const [scheduledTime, setScheduledTime] = useState("");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchGeneratedContent();
  }, []);

  // Fetches generated content from the backend
  const fetchGeneratedContent = async () => {
    try {
      const response = await makeRequest("generated-content");
      setGeneratedContent({
        content: JSON.parse(response.generated_content),
        content_id: response.content_id,
      });
    } catch (error) {
      console.error("Error fetching generated content:", error);
    }
  };

  // Handles scheduling a post
  const handleSchedulePost = async (e) => {
    e.preventDefault();
    try {
      const data = {
        content_id: generatedContent.content_id,
        scheduled_time: scheduledTime, // ISO format
        platform: "X", // default is X 
      };
      
      await makeRequest("schedule-post", {
        method: "POST",
        body: JSON.stringify(data),
      });

      setStatus("Scheduled Successfully!! Check pending posts for details");
    } catch (error) {
      console.error("Error scheduling content:", error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="component-container">
      <h2>Schedule Post</h2>
      
      {generatedContent && (
        <div className="form">
          <div className="generated-content card">
            <h3>Generated Content</h3>
            <p>{generatedContent.content.caption}</p>
          </div>

          <form onSubmit={handleSchedulePost} className="schedule-form">
            <div className="form-group">
              <label htmlFor="scheduled-time">Schedule Time:</label>
              <input
                id="scheduled-time"
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <button type="submit" className="btn btn-primary">Schedule Post</button>
          </form>

          {status && (
            <div className={`status-message ${status.includes("Error") ? "error" : "success"}`}>
              {status}
            </div>
          )}
        </div>
      )}
    </div>
  );
}