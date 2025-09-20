import React, { useState } from 'react';
import BusinessProfileForm from './BusinessProfileform';
import ContentCreator from './ContentCreator';
import ContentHistory from './ContentHistory';
import SchedulePost from './SchedulePost';
import PostContent from './PostContent';
import PendingPosts from './PendingPosts';
import { FiUser, FiEdit2, FiCalendar, FiClock, FiList, FiHome, FiMail, FiPhone, FiHeart } from 'react-icons/fi';
import './SocialMediaManager.css';

// Dashboard displays a tabbed interface to manage content creator tasks. @returns {React.Component}
export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('content');
  const [businessProfile, setBusinessProfile] = useState(null);
  const [generatedContent, setGeneratedContent] = useState(null);

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dashboard">
          <header className="dashboard-header">
            <h1>Social Media Manager</h1>
            <p>Create, schedule, and manage your social media content</p>
          </header>
          
          <div className="tab-header">
            {[
              { key: 'profile', label: 'Business Profile', icon: <FiUser /> },
              { key: 'content', label: 'Content', icon: <FiEdit2 /> },
              { key: 'schedule', label: 'Schedule', icon: <FiCalendar /> },
              { key: 'post', label: 'Post Now', icon: <FiEdit2 /> },
              { key: 'pending', label: 'Pending', icon: <FiClock /> },
              { key: 'history', label: 'History', icon: <FiList /> },
            ].map((tab) => (
              <button
                key={tab.key}
                className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <span className="tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === 'profile' && (
              <BusinessProfileForm onProfileSaved={setBusinessProfile} />
            )}
            {activeTab === 'content' && (
              <ContentCreator
                businessProfile={businessProfile}
                onContentCreated={setGeneratedContent}
              />
            )}
            {activeTab === 'schedule' && (
              <SchedulePost content={generatedContent} />
            )}
            {activeTab === 'post' && <PostContent />}
            {activeTab === 'history' && <ContentHistory />}
            {activeTab === 'pending' && <PendingPosts />}
          </div>
        </div>
      </div>
      
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Social Media Manager</h3>
            <p>Streamline your social media content creation and scheduling process.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#" onClick={() => setActiveTab('content')}>Create Content</a></li>
              <li><a href="#" onClick={() => setActiveTab('schedule')}>Schedule Posts</a></li>
              <li><a href="#" onClick={() => setActiveTab('history')}>View History</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Us</h4>
            <div className="contact-info">
              <p><FiMail /> support@socialmanager.com</p>
              <p><FiPhone /> +234 123 4567 89</p>
              <p><FiHome /> 123 Amazingmercy Ave, Suite 1000</p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Social Media Manager. Made with <FiHeart /> for content creators.</p>
        </div>
      </footer>
    </div>
  );
}