import { useEffect, useState } from "react";
import { useApi } from "../utils/api";

//Fetches the content history from the backend on mount and displays the history in a list.
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
    <div>
      <h3>Content History</h3>
      {history.length === 0 ? (
        <p>No content history yet.</p>
      ) : (
        <ul>
          {history.map((post) => (
            <li key={post.id}>
              <p>{post.generated_content}</p>
              <p>Status: {post.status}</p>
              <p>Platform: {post.platform}</p>
              <p>Posted at: {new Date(post.created_at).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
