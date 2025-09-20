import { useEffect, useState } from "react";
import { useApi } from "../utils/api";
import './SocialMediaManager.css';

// Displays a list of scheduled posts from the backend
export default function PendingPosts() {
  const { makeRequest } = useApi();
  const [scheduledPosts, setScheduledPosts] = useState([]);

  useEffect(() => {
    // Fetches the scheduled posts from the backend and updates the state.
    const fetchScheduledPosts = async () => {
      try {
        const data = await makeRequest("scheduled-posts");
        setScheduledPosts(data);
      } catch (err) {
        console.error("Error fetching scheduled posts:", err);
      }
    };
    fetchScheduledPosts();
  }, []);

  return (
    <div className="component-container">
      <h2>Scheduled Posts</h2>
      {scheduledPosts.length === 0 ? (
        <p className="empty-state">No scheduled posts yet.</p>
      ) : (
        <div className="posts-list">
          {scheduledPosts.map((post) => (
            <div key={post.id} className="post-item card">
              <p className="content-text">{post.generated_content}</p>
              <div className="post-meta">
                <span className="platform">{post.platform}</span>
                <span className={`status status-${post.status.toLowerCase()}`}>{post.status}</span>
                <span className="date">Scheduled: {new Date(post.scheduled_time).toLocaleString()}</span> 
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}