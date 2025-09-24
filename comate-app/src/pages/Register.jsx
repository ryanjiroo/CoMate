import React, { useState } from 'react';

const Register = ({ isOpen, onClose, onSwitchToLogin }) => {
    if (!isOpen) return null;

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Validasi sederhana
        if (!username || !email || !password) {
            setError('Semua kolom wajib diisi.');
            setIsLoading(false);
            return;
        }

        // Simulasi API call
        setTimeout(() => {
            setIsLoading(false);
            // Simulasi pendaftaran berhasil
            alert('Pendaftaran berhasil! Silakan login.');
            onSwitchToLogin();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(8px)' }}>
            <div className="relative w-full max-w-md p-8 bg-[#F4F7F7] rounded-3xl shadow-xl border border-solid" style={{ borderColor: '#D9D9D9' }}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[#26667F] hover:text-[#124170] text-3xl font-light"
                >
                    &times;
                </button>
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-extrabold font-[Outfit]" style={{ color: '#124170' }}>Daftar Sekarang</h2>
                    <p className="text-base mt-2 font-[Poppins]" style={{ color: '#26667F' }}>Yuk, buat akun sekarang dan mulai perjalanan produktifmu.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold mb-1" style={{ color: '#124170' }}>
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 bg-white rounded-full border border-solid focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ borderColor: '#26667F', borderWidth: '1px' }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1" style={{ color: '#124170' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 bg-white rounded-full border border-solid focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ borderColor: '#26667F', borderWidth: '1px' }}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1" style={{ color: '#124170' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 bg-white rounded-full border border-solid focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ borderColor: '#26667F', borderWidth: '1px' }}
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2 px-4 font-bold text-[#DDF4E7] rounded-full transition-all duration-300 transform hover:scale-105 hover:opacity-90 md:w-fit"
                            style={{ background: 'linear-gradient(to right, #26667F, #124170)' }}
                        >
                            {isLoading ? 'Loading...' : 'Daftar'}
                        </button>
                    </div>
                </form>
                <div className="mt-6 text-center text-sm">
                    <p className="text-gray-600 font-[Poppins]">
                        Sudah punya akun?{' '}
                        <button
                            onClick={onSwitchToLogin}
                            className="font-semibold"
                            style={{ color: '#26667F' }}
                        >
                            Masuk Sekarang!
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;