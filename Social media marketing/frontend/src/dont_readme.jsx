import { useState } from "react";
import { useApi } from "../utils/api";

export default function WhatsAppForm({ contentId, caption }) {
  const { makeRequest } = useApi();
  const [phones, setPhones] = useState("");
  const [status, setStatus] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    const phoneList = phones
      .split(",")
      .map((phone) => phone.trim())
      .filter((phone) => phone.length > 0);

    try {
      const response = await makeRequest("post-to-socials", {
        method: "POST",
        body: JSON.stringify({
          platform: "whatsapp",
          content_id: contentId,
          to: phoneList, // send list of recipient numbers
        }),
      });
      setStatus(`Messages sent: ${JSON.stringify(response)}`);
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="whatsapp-form">
      <h3>Send to WhatsApp</h3>
      <p><strong>Generated Caption:</strong> {caption}</p>
      <form onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Recipient phones (comma separated, e.g. 2349043741747,2348012345678)"
          value={phones}
          onChange={(e) => setPhones(e.target.value)}
          required
        />
        <button type="submit">Send to WhatsApp</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}

// src/components/WhatsAppForm.jsx
import { useState } from "react";
import { useApi } from "../utils/api";

export default function WhatsAppForm({ contentId, caption }) {
  const { makeRequest } = useApi();
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState(null);

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      const response = await makeRequest("post-to-socials", {
        method: "POST",
        body: JSON.stringify({
          platform: "whatsapp",
          content_id: contentId,
          to: phone, // pass recipient number to backend
        }),
      });
      setStatus(`Message sent: ${JSON.stringify(response)}`);
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="whatsapp-form">
      <h3>Send to WhatsApp</h3>
      <p><strong>Generated Caption:</strong> {caption}</p>

      <form onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Recipient phone (e.g. 2349043741747)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit">Send to WhatsApp</button>
      </form>

      {status && <p>{status}</p>}
    </div>
  );
}


<button>
  <Link
    to={`/whatsapp-form?contentId=${generatedContent.content_id}&caption=${encodeURIComponent(
      generatedContent.content.caption
    )}`}
  >
    Send to WhatsApp
  </Link>
</button>




import { Link } from "react-router-dom";
import InstagramLoginButton from './instagramLoginButton';
import WhatsAppButton from './whatsappButton';
import { useState, useEffect } from 'react';
import { useApi } from '../utils/api';


export default function PostContent() {
  const [generatedContent, setGeneratedContent] = useState(null);
  const [platform, setPlatform] = useState('X');              // default to X (Twitter)
  const { makeRequest } = useApi();

  useEffect(() => {
    fetchGeneratedContent();
    }, []);
    const fetchGeneratedContent = async () => {
      try {
        const response = await makeRequest('generated-content');
        //const parsedContent = JSON.parse(response);
        console.log('Response data:', response);
        setGeneratedContent({content: JSON.parse(response.generated_content),
                             content_id: response.content_id
        });
        console.log("generated content:", generatedContent);
      } catch (error) {
        console.error('Error fetching generated content:', error);
      }
    };
    
  const handlePostContent = async () => {
    try {
      const data ={platform,
                   content_id: generatedContent.content_id
                    
      };
      const response = await makeRequest('post-to-socials', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setPlatform(response)
      console.log('Content posted successfully:', response);
    } catch (error) {
      console.error('Error posting content:', error);
    }
      console.error('API Error:', error.detail[0]);
  };

  return (
    <div>
      <h4>Post Generated Content</h4>
      {generatedContent &&  (
        <div className='generated-content'>
          <p>Generated content:{generatedContent.content.caption}</p>
          <p>content id: {generatedContent.content_id} </p>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option value="X">X (Twitter)</option>
            <option value="whatsapp">Whatsapp</option>
            <option value="both">Both Platforms</option>
          </select>
          {platform === 'instagram' && <InstagramLoginButton />}
          {platform === 'whatsapp' && <WhatsAppButton/>}
          <button onClick={handlePostContent}>Post Content</button>
        </div>
      )}
    </div>
  );
}