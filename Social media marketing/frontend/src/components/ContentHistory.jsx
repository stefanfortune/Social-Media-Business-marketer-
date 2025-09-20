import { useEffect, useState } from "react";
import { useApi } from "../utils/api";
import './SocialMediaManager.css';

// Fetches the content history from the backend on mount and displays the history in a list.
export default function ContentHistory() {
  const { makeRequest } = useApi();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await makeRequest("content-history");
        setHistory(data);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="component-container">
      <h2>Content History</h2>
      {history.length === 0 ? (
        <p className="empty-state">No content history yet.</p>
      ) : (
        <div className="history-list">
          {history.map((post) => (
            <div key={post.id} className="history-item card">
              <p className="content-text">{post.generated_content}</p>
              <div className="post-meta">
                <span className={`status status-${post.status.toLowerCase()}`}>{post.status}</span>
                <span className="platform">{post.platform}</span>
                <span className="date">{new Date(post.posted_to_x).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}