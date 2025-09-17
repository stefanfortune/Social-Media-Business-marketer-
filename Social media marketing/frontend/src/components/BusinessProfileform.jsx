import { useState, useEffect } from 'react';
import { useApi } from '../utils/api';

//Form to create or edit a business profile, A JSX element containing a form to create or edit a business profile.
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

//Fetch the business profile data. Returns A promise that resolves once the request is completed.
  const fetchProfile = async () => {
    try {
      const data = await makeRequest('business-profile');
      setProfile(data);
    } catch (err) {
      console.log(err);
    }
  };

//Submits the form data to create or edit a business profile.
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
    <div className="business-profile-form">
      <h2>Business Profile Form</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="business_name">Business Name</label>
          <input
            type="text"
            id="business_name"
            name="business_name"
            value={formData.business_name}
            onChange={handleInputChange}
            required
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
          />
        </div>

        <div className="form-group">
          <label htmlFor="tone">Tone</label>
          <select
            id="tone"
            name="tone"
            value={formData.tone}
            onChange={handleInputChange}
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="humorous">Humorous</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="save-button"
        >
          {isLoading ? 'Saving...' : 'Save Profile'}
        </button>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {profile && (
          <div className="profile-display">
            <h3>Business Profile</h3>
            <p>Business Name: {profile.business_name}</p>
            <p>Description: {profile.description}</p>
            <p>Website: {profile.website}</p>
            <p>Tone: {profile.tone}</p>
          </div>
        )}
      </form>
    </div>
  );
}
