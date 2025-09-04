import React, { useState } from 'react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="relative z-20 w-full bg-[#F4F7F7] text-[#124170]">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <div className="text-xl font-bold font-[Outfit]">CoMate</div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    <a href="#" className="hover:text-[#67C090] transition-colors duration-200">Home</a>
                    <a href="#" className="hover:text-[#67C090] transition-colors duration-200">About Us</a>
                    <button className="bg-gradient-to-br from-[#26667F] to-[#67C090] text-[#F4F7F7] font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-opacity-90">
                        Sign In
                    </button>
                </nav>

                {/* Hamburger Menu Icon */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden text-2xl focus:outline-none"
                >
                    {isMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden w-full absolute top-full left-0 bg-[#F4F7F7]">
                    <nav className="flex flex-col items-center space-y-4 py-4">
                        <a href="#" className="hover:text-[#67C090] transition-colors duration-200">Home</a>
                        <a href="#" className="hover:text-[#67C090] transition-colors duration-200">About Us</a>
                        <button className="bg-gradient-to-br from-[#26667F] to-[#67C090] text-[#F4F7F7] font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:bg-opacity-90">
                            Sign In
                        </button>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Navbar;