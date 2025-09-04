import React from 'react';
import { ListChecks, Target, MessageCircle } from 'lucide-react';

const FiturUtama = () => {
    const features = [
        {
            title: 'Otomasi Tugas',
            description: 'Buat dan kelola tugas otomatis dari email, kalender, atau chat sehingga pekerjaan lebih cepat tertata.',
            icon: <ListChecks className="w-12 h-12 md:w-14 md:h-14 text-[#DDF4E7]" />
        },
        {
            title: 'Prioritas Cerdas',
            description: 'AI membantumu menentukan urutan kerja terbaik dengan menganalisis deadline, urgensi, dan konteks.',
            icon: <Target className="w-12 h-12 md:w-14 md:h-14 text-[#DDF4E7]" />
        },
        {
            title: 'Chatbot Asisten',
            description: 'Chatbot AI yang bisa diajak bicara untuk menambahkan, mengatur, dan menanyakan tugas kapan saja.',
            icon: <MessageCircle className="w-12 h-12 md:w-14 md:h-14 text-[#DDF4E7]" />
        }
    ];

    return (
        <section className="py-16 bg-[#F4F7F7] font-[Poppins]">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#26667F] mb-4 font-[Outfit]">
                    Apa yang Membuat Kami Berbeda?
                </h2>
                <hr
                    className="w-20 sm:w-[89px] h-[4px] sm:h-[5px] mx-auto mt-4 mb-4 border-none rounded-full"
                    style={{ background: 'linear-gradient(to right, #67C090, #26667F)' }}
                />
                <p className="text-base sm:text-lg md:text-xl text-[#26667F] mb-12 max-w-2xl mx-auto">
                    Gabungan otomasi dan kecerdasan buatan, menjadikan daftar tugas lebih dari sekadar catatan.
                </p>

                <div className="relative pb-10 sm:pb-20">
                    {/* Bullet dots */}
                    <div className="absolute -top-10 left-2 sm:left-4 opacity-40 sm:opacity-100">
                        <img src="/bullet25.svg" alt="bullet" className="w-16 h-16 sm:w-24 sm:h-24" />
                    </div>
                    <div className="absolute bottom-2 right-2 opacity-40 sm:opacity-100">
                        <img src="/bullet25.svg" alt="bullet" className="w-16 h-16 sm:w-24 sm:h-24" />
                    </div>

                    {/* Feature Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-2 sm:px-4 md:px-0 justify-items-center">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="relative p-6 sm:p-8 rounded-3xl shadow-lg w-full max-w-[380px] min-h-[280px] sm:min-h-[340px] flex flex-col justify-start sm:justify-center text-left"
                                style={{ background: 'linear-gradient(to bottom right, #26667F, #124170)' }}
                            >
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-[#DDF4E7] text-lg sm:text-xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-[#DDF4E7] text-sm sm:text-base leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FiturUtama;
