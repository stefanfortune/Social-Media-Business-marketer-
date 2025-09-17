import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import Navbar from '../components/Navbar';

export default function LoginPage() {
  return (
    <div className="login-page">
      <Navbar />
      <div className="login-container">
        <div className="login-content">
          <h2>Sign in to your account</h2>
          <p>Manage your social media marketing in one place</p>
          <div className="clerk-signin">
            <SignIn />
          </div>
          <div className="login-footer">
            <p>Don't have an account? <a href="/signup">Sign up</a></p>
          </div>
        </div>
        <div className="login-image">
          {/* Visual placeholder for login page */}
        </div>
      </div>
    </div>
  );
}