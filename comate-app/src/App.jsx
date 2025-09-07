import React from 'react';
import Welcome from './pages/Welcome'; // Menyesuaikan path ke folder 'pages'
import FiturUtama from './pages/FiturUtama';
import Footer from './pages/Footer';

function App() {
  return (
    <div className="App">
      <Welcome />
      <FiturUtama/>
      <Footer/>
    </div>
  );
}

export default App;
