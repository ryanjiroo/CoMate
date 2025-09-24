import React, { useState, useEffect, useRef } from 'react';
// Hapus import Dashboard dari sini
import { BiSend } from 'react-icons/bi';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { text: "Halo! Saya CoMate, teman virtualmu. Ada yang bisa saya bantu?", sender: 'bot' },
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (input.trim() === '') return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInput('');

        setTimeout(() => {
            const botResponse = { text: "Terima kasih atas pertanyaannya. Saya akan memprosesnya.", sender: 'bot' };
            setMessages(prevMessages => [...prevMessages, botResponse]);
        }, 1000);
    };

    // Hapus tag <Dashboard> di sini
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-[#124170] font-[Outfit]">
                    Chatbot
                </h1>
                <p className="text-md text-gray-500 font-[Poppins]">
                    Tanyakan segala hal pada CoMate
                </p>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto pr-4 mb-4" style={{ height: 'calc(100% - 150px)' }}>
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                        <div
                            className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow-md ${msg.sender === 'user' ? 'bg-[#DDF4E7] text-[#124170]' : 'bg-gray-100 text-gray-800'
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Area */}
            <form onSubmit={handleSendMessage} className="flex p-4 bg-white rounded-xl shadow-lg">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-[#124170]"
                    placeholder="Ketik pesan..."
                />
                <button
                    type="submit"
                    className="bg-[#124170] text-white p-3 rounded-full shadow-md hover:bg-[#26667F] transition-colors"
                >
                    <BiSend className="text-2xl" />
                </button>
            </form>
        </div>
    );
};

export default Chatbot;