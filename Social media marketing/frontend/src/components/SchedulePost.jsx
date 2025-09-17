import { useState, useEffect } from "react";
import { useApi } from "../utils/api";


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
      
      const response = await makeRequest("schedule-post", {
        method: "POST",
        body: JSON.stringify(data),
      });

      setStatus(`Scheduled Successfully!! check pending posts for details`);
      console.log("Content scheduled:", response);
    } catch (error) {
      console.error("Error scheduling content:", error);
      setStatus(`Error: ${error.message}`);
      
    }
  };

  return (
    <div>
      <h4>Schedule a Post</h4>
      {generatedContent && (
        <form onSubmit={handleSchedulePost}>
          <p><strong>Generated Caption:</strong> {generatedContent.content.caption}</p>
          <input
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            required
          />
          <button type="submit">Schedule Post</button>
        </form>
      )}
      {status && <p>{status}</p>}
    </div>
  );
}
