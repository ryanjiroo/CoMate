import React, { useState, useEffect } from 'react';
import { BiX } from 'react-icons/bi';

const API_URL = 'https://comate-backend.vercel.app/api';

const GroupTask = ({ isOpen, onClose, token, initialData, onSave }) => {
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
        } else {
            setTitle('');
        }
    }, [initialData]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const method = initialData ? 'PUT' : 'POST';
        const url = initialData ? `/tasks/${initialData._id}` : `/tasks`;
        const payload = { title };
        
        await onSave(payload, method, url);

        setIsLoading(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">{initialData ? 'Edit Task' : 'Add New Task'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <BiX className="text-3xl" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Task Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#124170] focus:border-[#124170]"
                            required
                        />
                    </div>
                    <div className="flex justify-end pt-4 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[#124170] text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-[#26667F] transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : 'Save Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GroupTask;