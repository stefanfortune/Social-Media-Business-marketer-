import { useState, useEffect } from "react";
import { useApi } from "../utils/api";
import './SocialMediaManager.css';

/**
 * fetches and displays generated content from the API.
 * Allows the user to select a platform and enter phone numbers if WhatsApp is selected.
 * Posts the generated content to the selected platform(s) and displays the status of the post.
 */
export default function PostContent() {
  const { makeRequest } = useApi();
  const [generatedContent, setGeneratedContent] = useState(null);
  const [platform, setPlatform] = useState("X"); // default: Twitter
  const [phones, setPhones] = useState("");
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

  const handlePostContent = async (e) => {
    e.preventDefault();

    // Collect phone numbers only if WhatsApp is involved
    let phoneList = [];
    if (platform === "whatsapp" || platform === "both") {
      phoneList = phones
        .split(",")
        .map((phone) => phone.trim())
        .filter((phone) => phone.length > 0);

      if (phoneList.length === 0) {
        setStatus("Please enter at least one phone number for WhatsApp.");
        return;
      }
    }

    try {
      const data = {
        platform,
        phone_numbers: phoneList,
        content_id: generatedContent.content_id,
      };
      
      await makeRequest("post-to-socials", {
        method: "POST",
        body: JSON.stringify(data),
      });

      setStatus("Posted Successfully!!");
    } catch (error) {
      console.error("Error posting content:", error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="component-container">
      <h2>Post Content</h2>

      {generatedContent && (
        <div className="form">
          <div className="generated-content card">
            <h3>Generated Content</h3>
            <p>{generatedContent.content.caption}</p>
          </div>

          <form onSubmit={handlePostContent} className="post-form">
            <div className="form-group">
              <label htmlFor="platform-select">Select Platform:</label>
              <select
                id="platform-select"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="select-field"
              >
                <option value="X">X (Twitter)</option>
                {/* Add other platform options as needed */}
              </select>
            </div>

            {/* Show phone input only if WhatsApp is selected */}
            {(platform === "whatsapp" || platform === "both") && (
              <div className="form-group">
                <label htmlFor="phone-numbers">WhatsApp Recipients (comma separated)</label>
                <input
                  id="phone-numbers"
                  type="text"
                  placeholder="Recipient phones (comma separated)"
                  value={phones}
                  onChange={(e) => setPhones(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
            )}

            <button type="submit" className="btn btn-primary">Post Content</button>
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