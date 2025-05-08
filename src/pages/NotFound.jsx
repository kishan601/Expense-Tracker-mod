import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="app-container">
      <div className="app-header-separator"></div>
      
      <div style={{ 
        textAlign: 'center', 
        padding: '100px 0', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>404</h1>
        <p style={{ fontSize: '20px', marginBottom: '30px' }}>Page not found</p>
        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>The page you're looking for doesn't exist or has been moved.</p>
        
        <Link to="/" className="btn btn-primary">
          <FiHome size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}