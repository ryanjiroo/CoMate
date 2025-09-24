import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: '#124170' }}>
      <main className="text-center text-[#DDF4E7]">
        <h1 className="text-5xl md:text-6xl font-extrabold font-[Outfit] mb-4">
          Selamat Datang di Dashboard!
        </h1>
        <p className="text-lg md:text-xl font-[Poppins] max-w-2xl mx-auto mb-8">
          Ini adalah halaman utama Anda setelah berhasil login. Di sini, Anda dapat mengelola tugas, melihat data produktivitas, dan mengakses fitur-fitur lainnya.
        </p>
        <button
          className="bg-gradient-to-br from-[#26667F] to-[#67C090] text-[#F4F7F7] font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-opacity-90"
          onClick={() => alert('Ini adalah aksi Logout.')}
        >
          Logout
        </button>
      </main>
    </div>
  );
};

export default Dashboard;