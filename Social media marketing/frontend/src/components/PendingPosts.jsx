import { useEffect, useState } from "react";
import { useApi } from "../utils/api";

// Displays a list of scheduled posts from the backend
export default function PendingPosts() {
  const { makeRequest } = useApi();
  const [scheduledPosts, setScheduledPosts] = useState([]);

  useEffect(() => {
//Fetches the scheduled posts from the backend and updates the state.
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
    <div>
      <h3>Scheduled Posts (Pending)</h3>
      {scheduledPosts.length === 0 ? (
        <p>No scheduled posts yet.</p>
      ) : (
        <ul>
          {scheduledPosts.map((post) => (
            <li key={post.id}>
              <p><strong>Caption:</strong> {post.generated_content}</p>
              <p><strong>Platform:</strong> {post.platform}</p>
              <p><strong>Status:</strong> {post.status}</p>
              <p><strong>Scheduled Time:</strong> {new Date(post.scheduled_time).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
