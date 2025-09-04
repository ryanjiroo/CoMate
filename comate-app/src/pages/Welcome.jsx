import React from 'react';
import Navbar from './Navbar';

const Welcome = () => {
    return (
        <div className="min-h-screen w-full bg-[#F4F7F7] font-[Poppins] flex flex-col items-center relative overflow-hidden">
            {/* Navbar */}
            <Navbar />

            {/* Konten Utama */}
            <div className="relative z-10 flex flex-col flex-grow items-center justify-center w-full">
                <main className="flex-grow flex items-center justify-center w-full p-6 sm:p-10">
                    <div className="w-11/12 md:w-4/5 min-h-[700px] lg:min-h-[800px] rounded-3xl relative overflow-hidden bg-gradient-to-br from-[#26667F] to-[#67C090] text-[#DDF4E7]">
                        
                        {/* Garis abstrak di dalam card */}
                        <img
                            src="/garisabstrak.svg"
                            alt="Abstract lines"
                            className="absolute left-164 top-0 w-[60%] h-full object-cover opacity-60"
                        />

                        <div className="relative z-10 flex flex-col mt-20 md:flex-row items-center justify-center gap-10 p-6 md:p-16 lg:p-20">
                            {/* Text Content Section */}
                            <div className="flex flex-col text-left md:w-1/2">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-[Outfit] mb-4 leading-tight text-center md:text-left">
                                    Catat. Atur. Selesai.
                                </h1>
                                <p className="text-lg md:text-xl text-[#DDF4E7] mb-8 text-center md:text-left">
                                    To-do list pintar dengan AI yang membantu kamu mengatur tugas, menentukan prioritas, dan menuntaskan pekerjaan tanpa ribet.
                                </p>
                                <div className="flex justify-center md:justify-start">
                                    <button className="bg-[#DDF4E7] text-[#26667F] font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105 w-fit">
                                        Coba Gratis
                                    </button>
                                </div>
                            </div>

                            {/* Image Section */}
                            <div className="md:w-1/2 mt-12 md:mt-16 flex justify-center items-center p-4">
                                <img src="/kalenderdanorang.svg" alt="Calendar and person" className="w-full max-w-sm h-full" />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Welcome;
