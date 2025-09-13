// Footer.jsx
import React from 'react';
import { Link } from 'react-scroll'; // Tambahkan ini

const Footer = () => {
    return (
        <footer
            className="relative py-16 text-[#DDF4E7] font-[Poppins]"
            style={{ background: 'linear-gradient(to bottom right, #26667F, #124170)' }}
        >
            <div className="container mx-auto px-4">
                {/* Bullet dots di kiri */}
                <div className="absolute top-0 left-4 h-full flex flex-col justify-center space-y-4">
                    <img
                        src="/bullet25.svg"
                        alt="bullet"
                        className="w-10 h-10 sm:w-16 sm:h-16 md:w-24 md:h-24"
                    />
                </div>

                {/* Bullet dots di kanan */}
                <div className="absolute top-0 right-4 h-full flex flex-col justify-center space-y-4">
                    <img
                        src="/bullet25.svg"
                        alt="bullet"
                        className="w-10 h-10 sm:w-16 sm:h-16 md:w-24 md:h-24"
                    />
                </div>

                {/* Main Content */}
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left gap-12 md:gap-70">
                    {/* Navigator Section */}
                    <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
                        <h3 className="text-lg sm:text-xl font-bold font-[Outfit] mb-4">Navigator</h3>
                        <Link to="welcome" smooth={true} duration={500} className="text-base sm:text-lg hover:text-opacity-80 transition-all mb-2 cursor-pointer">Home</Link>
                        <Link to="fitur-utama" smooth={true} duration={500} offset={-80} className="text-base sm:text-lg hover:text-opacity-80 transition-all mb-2 cursor-pointer">Our Feature</Link>
                        <button
                            className="mt-4 px-6 py-2 rounded-full text-[#DDF4E7] font-semibold text-sm sm:text-base"
                            style={{ background: 'linear-gradient(to right, #67C090, #26667F)' }}
                        >
                            Sign In
                        </button>
                    </div>

                    {/* Dibuat Oleh Section */}
                    <div className="flex flex-col items-center md:items-start mb-8 md:mb-0">
                        <h3 className="text-lg sm:text-xl font-bold font-[Outfit] mb-4">Dibuat Oleh</h3>
                        <a
                            href="https://www.linkedin.com/in/bagus-angkasawan-sumantri-putra/"
                            className="text-base sm:text-lg"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Bagus Angkasawan Sumantri Putra
                        </a>
                        <a
                            href="https://www.linkedin.com/in/xryanayrx/"
                            className="text-base sm:text-lg"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Ryan Nugroho
                        </a>
                    </div>

                    {/* CoMate Section */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left flex-grow">
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-[Outfit] mb-2">
                            CoMate
                        </h2>
                        <p className="text-base sm:text-lg">
                            Kerja Lebih Ringkas, Hidup Lebih Cerdas
                        </p>
                    </div>
                </div>

                {/* Divider + Copyright */}
                <div className="w-full mt-16 pt-8 flex flex-col md:flex-row items-center justify-between">
                    <hr className="w-full md:w-[35%] border-none h-[4px] sm:h-[6px] bg-[#DDF4E7] bg-opacity-40" />
                    <p className="my-4 md:my-0 px-4 text-sm sm:text-base">Copyright@2025</p>
                    <hr className="w-full md:w-[35%] border-none h-[4px] sm:h-[6px] bg-[#DDF4E7] bg-opacity-40" />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
