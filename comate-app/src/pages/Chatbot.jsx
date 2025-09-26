import React, { useState, useEffect, useRef } from 'react';
import { BiSend } from 'react-icons/bi';
import { marked } from 'marked';

const API_URL = 'https://comate-backend.vercel.app/api';

const Chatbot = ({ token }) => {
    const [messages, setMessages] = useState(() => {
        const storedMessages = sessionStorage.getItem('chatMessages');
        // Inisialisasi pesan dengan konten bot yang sudah diparse jika belum ada
        if (storedMessages) {
            return JSON.parse(storedMessages);
        } else {
            return [{ text: marked.parse("Halo, saya **CoMate AI** yang didukung oleh Llama. Ada yang bisa saya bantu?"), sender: 'bot', isHtml: true }];
        }
    });
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [chatSessionId, setChatSessionId] = useState(() => {
        const storedId = sessionStorage.getItem('chatSessionId');
        return storedId || `session_${Date.now()}`;
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        sessionStorage.setItem('chatSessionId', chatSessionId);
    }, [chatSessionId]);

    useEffect(() => {
        sessionStorage.setItem('chatMessages', JSON.stringify(messages));
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === '') return;

        const userMessageText = input.trim();
        const userMessage = { text: userMessageText, sender: 'user' };
        
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ sessionId: chatSessionId, message: userMessageText })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Chatbot request failed');
            }

            const data = await res.json();
            const parsedContent = marked.parse(data.output);
            const botResponse = { text: parsedContent, sender: 'bot', isHtml: true };
            
            setMessages(prevMessages => [...prevMessages, botResponse]);
        } catch (err) {
            const errorMsg = `Error: ${err.message}`;
            setMessages(prevMessages => [...prevMessages, { text: errorMsg, sender: 'bot', isHtml: false }]);
        } finally {
            setIsLoading(false);
        }
    };

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
                            {/* KUNCI: Tambahkan class 'prose prose-sm' jika konten adalah HTML dari bot */}
                            {msg.isHtml ? (
                                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: msg.text }} />
                            ) : (
                                msg.text
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start mb-4">
                        <div className="max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow-md bg-gray-100 text-gray-800">
                            <span className="animate-pulse">Typing...</span>
                        </div>
                    </div>
                )}
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
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="bg-[#124170] text-white p-3 rounded-full shadow-md hover:bg-[#26667F] transition-colors disabled:opacity-50"
                    disabled={isLoading}
                >
                    <BiSend className="text-2xl" />
                </button>
            </form>
        </div>
    );
};

export default Chatbot;
