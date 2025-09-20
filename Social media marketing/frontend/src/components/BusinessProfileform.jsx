import { useState, useEffect } from 'react';
import { useApi } from '../utils/api';
import './SocialMediaManager.css';

// Form to create or edit a business profile, A JSX element containing a form to create or edit a business profile.
export default function BusinessProfileForm() {
  const [formData, setFormData] = useState({
    business_name: '',
    description: '',
    website: '',
    tone: 'professional',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const { makeRequest } = useApi();

  useEffect(() => {
    fetchProfile();
  }, []);

  // Fetch the business profile data. Returns A promise that resolves once the request is completed.
  const fetchProfile = async () => {
    try {
      const data = await makeRequest('business-profile');
      setProfile(data);
    } catch (err) {
      console.log(err);
    }
  };

  // Submits the form data to create or edit a business profile.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await makeRequest('create-business-profile', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setProfile(data);
    } catch (err) {
      setError(err.message || 'Failed to save profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="component-container">
      <h2>Business Profile</h2>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="business_name">Business Name</label>
          <input
            type="text"
            id="business_name"
            name="business_name"
            value={formData.business_name}
            onChange={handleInputChange}
            required
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="textarea-field"
          />
        </div>

        <div className="form-group">
          <label htmlFor="website">Website</label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label htmlFor="tone">Tone</label>
          <select
            id="tone"
            name="tone"
            value={formData.tone}
            onChange={handleInputChange}
            className="select-field"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="humorous">Humorous</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading ? 'Saving...' : 'Save Profile'}
        </button>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {profile && (
          <div className="profile-display card">
            <h3>Saved Business Profile</h3>
            <p><strong>Business Name:</strong> {profile.business_name}</p>
            <p><strong>Description:</strong> {profile.description}</p>
            <p><strong>Website:</strong> {profile.website}</p>
            <p><strong>Tone:</strong> {profile.tone}</p>
          </div>
        )}
      </form>
    </div>
  );
}