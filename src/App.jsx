import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';import Home from './pages/Home';
import Reports from './pages/Reports';
import Budgets from './pages/Budgets';
import Bills from './pages/Bills';
import NotFound from './pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('expense-tracker-theme') === 'dark'
  );

  useEffect(() => {
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
    localStorage.setItem('expense-tracker-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`app ${darkMode ? 'dark-theme' : 'light-theme'}`}>
        <Router>
          <Routes>
            <Route path="/" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/reports" element={<Reports darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/budgets" element={<Budgets darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/bills" element={<Bills darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="*" element={<NotFound darkMode={darkMode} setDarkMode={setDarkMode} />} />
          </Routes>
        </Router>
      </div>
    </QueryClientProvider>
  );
}

export default App;