import React, { useState, useEffect } from 'react';
import Welcome from './pages/Welcome';
import FiturUtama from './pages/FiturUtama';
import Footer from './pages/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import ToDoList from './pages/ToDoList';
import Chatbot from './pages/Chatbot';
import Dashboard from './layouts/DashboardLayout';

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentPage, setCurrentPage] = useState('todos');
  const [user, setUser] = useState(null);

  // Efek untuk memeriksa token saat aplikasi dimuat
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
      // Simulasikan pengambilan data pengguna setelah token ditemukan
      // Dalam aplikasi nyata, Anda akan melakukan panggilan API di sini
      setUser({
        username: 'User', 
        email: 'user@example.com',
      });
    }
  }, []);

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
    // Set data pengguna setelah login berhasil
    setUser({
      username: 'User',
      email: 'user@example.com',
    });
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
  };

  const handlePageChange = (pageName) => {
    setCurrentPage(pageName);
  };

  if (isLoggedIn || token) {
    const renderPage = () => {
      if (currentPage === 'todos') {
        return <ToDoList />;
      } else if (currentPage === 'chatbot') {
        return <Chatbot />;
      }
    };
    
    return (
      <Dashboard
        onLogout={handleLogout}
        onPageChange={handlePageChange}
        currentPage={currentPage}
        user={user} // Pastikan prop user diteruskan
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
