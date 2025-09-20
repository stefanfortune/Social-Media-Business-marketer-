import { useState } from 'react';
import { useApi } from '../utils/api';
import './SocialMediaManager.css';

export default function ContentCreator() {
  const { generateCaption } = useApi();
  const [content, setContent] = useState({ raw_text: '', media: null, tone: 'professional' });
  const [generatedCaption, setGeneratedCaption] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // State to store user input, generated caption and loading status

  const handlegenerateCaption = async () => {
    try {
      setIsLoading(true);
      // FormData to handle file upload
      const formData = new FormData();
      formData.append('raw_text', content.raw_text);
      if (content.media) {
        formData.append('media', content.media); // actual File object
      }
      formData.append('tone', content.tone);
      // Send FormData to backend
      const response = await generateCaption(formData);
      // Save results in state
      console.log('Generated content:', response);
      const data = response.generated_content;
      setGeneratedCaption({
        contentId: response.id,
        userId: response.user_id,
        caption: data.caption,
      });
    } catch (error) {
      console.error('Error generating caption:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="component-container">
      <h2>Content Creator</h2>
      
      <div className="form">
        <div className="form-group">
          <textarea
            rows={6}
            placeholder="What's your post about?"
            value={content.raw_text}
            onChange={(e) => setContent({ ...content, raw_text: e.target.value })}
            className="textarea-field"
          />
        </div>

        <div className="form-group">
          <label htmlFor="media-upload">Upload Media (Optional)</label>
          <input
            id="media-upload"
            type="file"
            onChange={(e) =>
              setContent({ ...content, media: e.target.files[0] })
            }
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tone-select">Select Tone</label>
          <select
            id="tone-select"
            value={content.tone}
            onChange={(e) => setContent({ ...content, tone: e.target.value })}
            className="select-field"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="humorous">Humorous</option>
          </select>
        </div>

        <button onClick={handlegenerateCaption} disabled={isLoading} className="btn btn-primary">
          {isLoading ? 'Generating...' : 'Generate Caption'}
        </button>

        {generatedCaption && (
          <div className="generated-caption card">
            <h3>AI-Generated Caption</h3>
            <p>{generatedCaption.caption}</p>
          </div>
        )}
      </div>
    </div>
  );
}