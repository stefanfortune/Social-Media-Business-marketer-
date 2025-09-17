import { useState } from "react";
import { useApi } from "../utils/api";

// WhatsAppForm component
export default function WhatsAppForm() {
  const { makeRequest } = useApi();
  const [phones, setPhones] = useState("");
  const [status, setStatus] = useState(null);
  
  // Handles user phone number list
  const handleSend = async (e) => {
    e.preventDefault();
    const phoneList = phones
      .split(",")
      .map((phone) => phone.trim())
      .filter((phone) => phone.length > 0);

    try {
      // send list of recipient numbers to the backend
      const response = await makeRequest("post-to-whatsapp", {
        method: "POST",
        body: JSON.stringify({phone_numbers: phoneList}),
      });
      setStatus(`Messages sent: ${JSON.stringify(response)}`);
    } catch (err) {
      setStatus(`Errors: ${err.message}`);
    }
  };

  return (
    <div className="whatsapp-form">
      <h3>Send to WhatsApp</h3>
      <p><strong>Generated Caption:</strong></p>
      <form onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Recipient phones (comma separated, e.g. 2349043741747,2348012345678)"
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
        <button type="submit">add numbers</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}