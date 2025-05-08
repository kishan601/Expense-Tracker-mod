import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import './ThemeToggle.css';

export function ThemeToggle({ darkMode, setDarkMode }) {
    return (
      <button
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
      </button>
    );
  }