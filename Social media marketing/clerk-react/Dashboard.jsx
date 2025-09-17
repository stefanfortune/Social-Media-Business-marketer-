import React from 'react';
import BusinessProfileForm from './BusinessProfileForm';
import ContentCreator from './ContentCreator';
import ContentHistory from './ContentHistory';
import SchedulePost from './SchedulePost';

export default function Dashboard() {
  const [activeTab, setActiveTab] = React.useState('content');
  const [businessProfile, setBusinessProfile] = React.useState(null);
  const [generatedContent, setGeneratedContent] = React.useState(null);

  return (
    <div className="dashboard">
      <div className="tabs">
        <button 
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          Business Profile
        </button>
        <button 
          className={activeTab === 'content' ? 'active' : ''}
          onClick={() => setActiveTab('content')}
        >
          Create Content
        </button>
        <button 
          className={activeTab === 'schedule' ? 'active' : ''}
          onClick={() => setActiveTab('schedule')}
        >
          Schedule Posts
        </button>
        <button 
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          Content History
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'profile' && (
          <BusinessProfileForm 
            onProfileSaved={setBusinessProfile} 
          />
        )}
        {activeTab === 'content' && (
          <ContentCreator 
            businessProfile={businessProfile} 
            onContentCreated={setGeneratedContent} 
          />
        )}
        {activeTab === 'schedule' && generatedContent && (
          <SchedulePost content={generatedContent} />
        )}
        {activeTab === 'history' && <ContentHistory />}
      </div>
    </div>
  );
}