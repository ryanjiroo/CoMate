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

// Impor baru yang diperlukan
import DetailGroupTask from './pages/DetailGroupTask'; 
import PremiumModal from './pages/PremiumModal';

const API_URL = 'https://comate-backend.vercel.app/api';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentPage, setCurrentPage] = useState('todos');
  const [user, setUser] = useState(null);
  const [allTodos, setAllTodos] = useState([]);

  // --- State Baru untuk Navigasi Detail ---
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // --- State Baru untuk Modal Premium (dibutuhkan oleh DetailGroupTask) ---
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [premiumModalMessage, setPremiumModalMessage] = useState("");

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

  useEffect(() => {
    if (token) {
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
    setAllTodos([]); 
    setCurrentPage('todos'); // Reset ke halaman todos
    setSelectedTaskId(null); // Reset task ID
  };

  const handlePageChange = (pageName) => {
    setCurrentPage(pageName);
    setSelectedTaskId(null); // Reset ID saat ganti halaman via sidebar
  };

  // --- Handler Baru untuk Navigasi ---
  const handleViewTaskDetails = (taskId) => {
    setSelectedTaskId(taskId);
    setCurrentPage('task-detail');
  };

  const handleBackToTodos = () => {
    setSelectedTaskId(null);
    setCurrentPage('todos');
  };

  // --- Handler Baru untuk Modal Premium ---
  const handleShowPremiumModal = (message) => {
    setPremiumModalMessage(message);
    setIsPremiumModalOpen(true);
  };

  const handleNavigateToProfile = () => {
    // Fungsi ini dipanggil dari DetailGroupTask
    // Kita tidak bisa membuka modal EditProfile di DashboardLayout dari sini
    // Jadi kita hanya menutup modal premium. Pengguna bisa klik Edit Profile manual.
    setIsPremiumModalOpen(false);
    // Jika ingin, kita bisa Arahkan ke halaman profile JIKA itu halaman,
    // tapi karena itu modal, kita biarkan saja.
  };

  if (isLoggedIn || token) {
    const renderPage = () => {
      switch (currentPage) {
        case 'todos':
          return (
            <ToDoList
              token={token}
              isPremium={user?.isPremium}
              onShowPremiumModal={handleShowPremiumModal}
              onDataChange={fetchTodos}
              // Kirim handler agar ToDoList bisa memanggilnya
              onViewTaskDetails={handleViewTaskDetails}
            />
          );
        case 'chatbot':
          return <Chatbot token={token} />;
        case 'ai-recommendation':
          return <Recommender apiCall={apiCall} allTodos={allTodos} />;
        
        // --- Case Baru untuk Halaman Detail ---
        case 'task-detail':
          return (
            <DetailGroupTask
              token={token}
              user={user}
              isPremium={user?.isPremium}
              taskId={selectedTaskId} // Kirim ID yang dipilih
              onBackToTodos={handleBackToTodos} // Kirim handler untuk kembali
              onShowPremiumModal={handleShowPremiumModal}
              onNavigateToProfile={handleNavigateToProfile}
            />
          );
        default:
          // Halaman default jika terjadi error
          return <ToDoList token={token} onDataChange={fetchTodos} onViewTaskDetails={handleViewTaskDetails} />;
      }
    };

    return (
      <>
        <Dashboard
          onLogout={handleLogout}
          onPageChange={handlePageChange}
          currentPage={currentPage}
          user={user}
          onUpdateProfile={handleUpdateProfile}
          onSubscribe={handleSubscribe}
          // Kirim handler modal ke Dashboard juga
          onShowPremiumModal={handleShowPremiumModal} 
        >
          {renderPage()}
        </Dashboard>
        
        {/* Render Modal Premium di level atas */}
        <PremiumModal
          isOpen={isPremiumModalOpen}
          onClose={() => setIsPremiumModalOpen(false)}
          message={premiumModalMessage}
          // (Asumsi komponen PremiumModal Anda tidak butuh onNavigateToProfile)
          // Jika butuh, tambahkan: onNavigateToProfile={handleNavigateToProfile}
        />
      </>
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
