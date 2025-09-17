import { useState } from 'react';
import { useApi } from '../utils/api';

export default function ContentCreator() {
  const { generateCaption } = useApi();
  const [content, setContent] = useState({ raw_text: '', media: null });
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
    <div className="content-creator">
      <textarea
        rows={10}
        cols={50}
        placeholder="What's your post about?"
        value={content.raw_text}
        onChange={(e) => setContent({ ...content, raw_text: e.target.value })}
      />
      <input
        type="file"
        onChange={(e) =>
          setContent({ ...content, media: e.target.files[0] })
        }
      />
      <select
        value={content.tone}
        onChange={(e) => setContent({ ...content, tone: e.target.value })}
      >
        <option value="professional">Professional</option>
        <option value="casual">Casual</option>
        <option value="humorous">Humorous</option>
      </select>

      <button onClick={handlegenerateCaption} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Caption'}
      </button>

      {generatedCaption && (
        <div className="generated-caption">
          <h4>AI-Generated Caption</h4>
          <p><strong>Caption:</strong> {generatedCaption.caption}</p>
        </div>
      )}
    </div>
  );
}
