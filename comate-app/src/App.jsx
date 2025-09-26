import React, { useState, useEffect } from 'react';
import Welcome from './pages/Welcome';
import FiturUtama from './pages/FiturUtama';
import Footer from './pages/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import ToDoList from './pages/ToDoList';
import Chatbot from './pages/Chatbot';
import Recommender from './pages/Recommender'; 
import Dashboard from './layouts/DashboardLayout';

const API_URL = 'https://comate-backend.vercel.app/api';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentPage, setCurrentPage] = useState('todos');
  const [user, setUser] = useState(null);
  const [allTodos, setAllTodos] = useState([]); // <-- TAMBAH STATE UNTUK TODOS

  const apiCall = async (endpoint, method = 'GET', body = null) => {
    const options = {
      method,
      headers: { 'Authorization': `Bearer ${token}` }
    };
    if (body) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
    const res = await fetch(`${API_URL}${endpoint}`, options);
    const data = await res.json();
    if (!res.ok) {
      if (res.status === 401) handleLogout();
      throw new Error(data.message || 'API request failed');
    }
    return data;
  };

  const fetchCurrentUser = async (userToken) => {
    try {
      const res = await fetch(`${API_URL}/users/current`, {
        headers: { 'Authorization': `Bearer ${userToken}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUser(data.data);
    } catch (error) {
      console.error('Failed to fetch user data', error);
      handleLogout();
    }
  };

  const fetchTodos = async () => {
    try {
      const data = await apiCall('/todo');
      setAllTodos(data.todo);
    } catch (error) {
      console.error('Failed to fetch todos', error);
      setAllTodos([]);
    }
  };

  const handleUpdateProfile = async (payload) => {
    try {
      await apiCall('/users/current', 'PUT', payload);
      await fetchCurrentUser(token);
    } catch (err) {
      throw new Error(err.message || 'Failed to update profile');
    }
  };

  const handleSubscribe = async (voucher) => {
    try {
        await apiCall('/users/subscribe', 'POST', { voucher });
        await fetchCurrentUser(token);
    } catch(err) {
        throw new Error(err.message);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      fetchCurrentUser(storedToken);
    }
  }, []);

  // Efek untuk memuat data setelah login berhasil atau token tersedia
  useEffect(() => {
    if (token) {
        // Hanya memuat todos jika sudah login untuk menghindari error API
        fetchTodos(); 
    }
  }, [token]);

  const handleOpenLogin = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
  };

  const handleOpenRegister = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const handleCloseModals = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  const handleLoginSuccess = (userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
    setIsLoggedIn(true);
    fetchCurrentUser(userToken);
    handleCloseModals();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('chatSessionId');
    sessionStorage.removeItem('chatMessages');
    sessionStorage.removeItem('cachedRecommendation');
    setToken(null);
    setIsLoggedIn(false);
    setUser(null);
    setAllTodos([]); // Hapus todos saat logout
  };

  const handlePageChange = (pageName) => {
    setCurrentPage(pageName);
  };

  if (isLoggedIn || token) {
    const renderPage = () => {
      if (currentPage === 'todos') {
        // Perluas ToDoList jika ia juga perlu tahu kapan harus me-refresh data
        return <ToDoList token={token} onDataChange={fetchTodos} />; 
      } else if (currentPage === 'chatbot') {
        return <Chatbot token={token} />;
      } else if (currentPage === 'ai-recommendation') { // <-- TAMBAH HALAMAN RECOMMENDER
        return <Recommender apiCall={apiCall} allTodos={allTodos} />;
      }
      return <div>Select a menu item.</div>;
    };

    return (
      <Dashboard
        onLogout={handleLogout}
        onPageChange={handlePageChange}
        currentPage={currentPage}
        user={user}
        onUpdateProfile={handleUpdateProfile}
        onSubscribe={handleSubscribe}
      >
        {renderPage()}
      </Dashboard>
    );
  }

  return (
    <div className="App">
      <Welcome onSignInClick={handleOpenLogin} />
      <FiturUtama />
      <Footer />

      <Login
        isOpen={isLoginModalOpen}
        onClose={handleCloseModals}
        onSwitchToRegister={handleOpenRegister}
        onLoginSuccess={handleLoginSuccess}
      />
      <Register
        isOpen={isRegisterModalOpen}
        onClose={handleCloseModals}
        onSwitchToLogin={handleOpenLogin}
      />
    </div>
  );
}

export default App;
