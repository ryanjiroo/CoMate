import React, { useState, useEffect } from 'react';
import { BiBot, BiRefresh } from 'react-icons/bi';
import { marked } from 'marked';

const Recommender = ({ apiCall, allTodos }) => {
    const [recommendationResult, setRecommendationResult] = useState(() => {
        return sessionStorage.getItem('cachedRecommendation') || '';
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        sessionStorage.setItem('cachedRecommendation', recommendationResult);
    }, [recommendationResult]);

    const generateRecommendation = async () => {
        if (isLoading) return;

        setIsLoading(true);
        setError(null);
        setRecommendationResult('');

        try {
            const todosString = allTodos.map(t =>
                `- ${t.title} (Status: ${t.status})`
            ).join('\n');

            const prompt = `Based on my current todo list below, please provide a priority recommendation. Analyze the tasks and suggest which ones I should focus on first. Explain your reasoning briefly. Format your response in markdown. Use bahasa indonesia.
            
My Todos:
${todosString}`;

            const res = await apiCall('/chat', 'POST', {
                sessionId: `recommendation_${Date.now()}`,
                message: prompt
            });

            const parsedHtml = marked.parse(res.output);
            setRecommendationResult(parsedHtml);

        } catch (err) {
            console.error("Failed to generate recommendation:", err);
            setError(err.message || "Failed to generate recommendation. Please try again.");
            setRecommendationResult('');
        } finally {
            setIsLoading(false);
        }
    };

    const loadingContent = (
        <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-gray-500">AI is analyzing your todos...</p>
        </div>
    );

    const initialContent = (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
            <BiBot className="text-6xl text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Get Smart Priority Recommendations</h3>
            <p className="text-gray-600 mb-6">Let CoMate AI analyze your current todos and suggest the best course of action.</p>
        </div>
    );

    const errorContent = (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
        </div>
    );

    return (
        <div className="flex flex-col h-full">
            {/* Header meniru gaya Chatbot dan ToDoList */}
            <div className="mb-6">
                <h1 className="text-4xl font-bold text-[#124170] font-[Outfit]">
                    AI Smart Recommender
                </h1>
                <p className="text-md text-gray-500 font-[Poppins]">
                    Dapatkan rekomendasi prioritas tugas dari AI
                </p>
            </div>

            {/* Konten Utama */}
            <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <BiBot className="mr-2 text-2xl text-blue-600" />
                    Analisis Prioritas Tugas
                </h3>

                <button
                    onClick={generateRecommendation}
                    disabled={isLoading}
                    className="bg-[#124170] hover:bg-[#26667F] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out disabled:opacity-50 flex items-center justify-center mb-8"
                >
                    {isLoading ? (
                        <>
                            <span className="animate-spin border-t-2 border-white rounded-full h-4 w-4 mr-2"></span>
                            Generating...
                        </>
                    ) : (
                        <>
                            <BiRefresh className="mr-2 text-xl" />
                            Generate New Recommendation
                        </>
                    )}
                </button>

                <div id="recommendation-result" className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-inner prose max-w-none">
                    {isLoading
                        ? loadingContent
                        : error
                            ? errorContent
                            : recommendationResult
                                ? <div dangerouslySetInnerHTML={{ __html: recommendationResult }} />
                                : initialContent}
                </div>
            </div>


            {allTodos.length === 0 && !isLoading && !recommendationResult && (
                <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-xl shadow-md">
                    <p className="text-sm">💡 Add some todos to your list before generating a recommendation!</p>
                </div>
            )}
        </div>
    );
};

export default Recommender;