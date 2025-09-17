import { useState, useEffect } from "react";
import { useApi } from "../utils/api";

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
      console.log("data:", data);
      try {
        const response = await makeRequest("post-to-socials", {
          method: "POST",
          body: JSON.stringify(data),
        });
        console.log("response:", response);
      } catch (error) {
        console.error("API Error:", error);
      }

      setStatus(`Posted Successfully!!`);
      console.log("Content posted successfully:", response);
    } catch (error) {
      console.error("Error posting content:", error);
      setStatus(`Error: ${error.message}`);
      
    }
  };

  return (
    <div>
      <h4>Post Generated Content</h4>

      {generatedContent && (
        <div className="generated-content">
          <p>
            <strong>Generated content:</strong>{" "}
            {generatedContent.content.caption}
          </p>

          <form onSubmit={handlePostContent}>
            {/* Platform selection */}
            <label>
              Select Platform:
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
              >
                <option value="X">X (Twitter)</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="both">Both Platforms</option>
              </select>
            </label>

            {/* Show phone input only if WhatsApp is selected */}
            {(platform === "whatsapp" || platform === "both") && (
              <div className="whatsapp-form">
                <h3>WhatsApp Recipients</h3>
                <input
                  type="text"
                  placeholder="Recipient phones (comma separated)"
                  value={phones}
                  onChange={(e) => setPhones(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    height: "40px",
                    padding: "10px",
                    border: "1px solid #0f521aff",
                    borderRadius: "5px",
                    fontSize: "16px",
                  }}
                />
              </div>
            )}

            <button type="submit">Post Content</button>
          </form>

          {status && <p>{status}</p>}
        </div>
      )}
    </div>
  );
}
