import React from 'react';
import BusinessProfileForm from './BusinessProfileform';
import ContentCreator from './ContentCreator';
import ContentHistory from './ContentHistory';
import SchedulePost from './SchedulePost';
import PostContent from './PostContent';
import PendingPosts from './PendingPosts';
import { FiUser, FiEdit2, FiCalendar, FiClock, FiList } from 'react-icons/fi';


//Dashboad displays a tabbed interface to manage content creator tasks. @returns {React.Component}
 export default function Dashboard() {
  const [activeTab, setActiveTab] = React.useState('content');
  const [businessProfile, setBusinessProfile] = React.useState(null);
  const [generatedContent, setGeneratedContent] = React.useState(null);

  return (
    <div className="dashboard-container">
      <div className="dashboard">
        <div className="tab-header">
          {[
            { key: 'profile', label: 'Business Profile', icon: <FiUser /> },
            { key: 'content', label: 'Content', icon: <FiEdit2 /> },
            { key: 'schedule', label: 'Schedule Posts', icon: <FiCalendar /> },
            { key: 'post', label: 'Post Content', icon: <FiEdit2 /> },
            { key: 'pending', label: 'Pending posts', icon: <FiClock /> },
            { key: 'history', label: 'Content History', icon: <FiList /> },
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
      <style jsx>{`
        .dashboard-container {
          flex: 1;
          padding: 24px;
          background-color: #f8fafc;
        }
        
        .dashboard {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .tab-header {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          padding: 8px;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
        }
        
        .tab-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: transparent;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          font-size: 14px;
          color: #64748b;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .tab-button:hover {
          color: #4f46e5;
          background: rgba(79, 70, 229, 0.05);
        }
        
        .tab-button.active {
          color: #4f46e5;
          background: rgba(79, 70, 229, 0.1);
          font-weight: 600;
        }
        
        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 3px;
          background: #4f46e5;
          border-radius: 3px 3px 0 0;
        }
        
        .tab-icon {
          font-size: 16px;
          display: flex;
        }
        
        .tab-content {
          background: #ffffff;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #e2e8f0;
          min-height: 500px;
        }
        
        @media (max-width: 768px) {
          .tab-header {
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .tab-button {
            padding: 10px 16px;
            font-size: 13px;
          }
          
          .tab-content {
            padding: 24px 16px;
          }
        }
        
        @media (max-width: 480px) {
          .tab-header {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }
          
          .tab-button {
            justify-content: center;
          }
          
          .tab-button.active::after {
            bottom: 0;
            left: 0;
            transform: none;
            width: 3px;
            height: 100%;
            border-radius: 0 3px 3px 0;
          }
        }
      `}</style>
    </div>
  );
}