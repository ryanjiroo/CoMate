import React, { useState, useEffect } from 'react';
import { BiX } from 'react-icons/bi';

const API_URL = 'https://comate-backend.vercel.app/api';

const toLocalISOString = (date) => {
    if (!date) return '';
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const localISOTime = (new Date(new Date(date) - tzoffset)).toISOString().slice(0, 16);
    return localISOTime;
};

const fromDateTimeLocal = (datetimeLocalString) => {
    if (!datetimeLocalString) return "";
    return `${datetimeLocalString}:00.000+07:00`;
};

const Tambah = ({ isOpen, onClose, token, initialData }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'To Do',
        startDate: '',
        endDate: '',
        location: '',
        attendeeEmail: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                status: initialData.status || 'To Do',
                startDate: toLocalISOString(initialData.startDate) || '',
                endDate: toLocalISOString(initialData.endDate) || '',
                location: initialData.location || '',
                attendeeEmail: initialData.attendee || '',
            });
        } else {
            setFormData({
                title: '',
                description: '',
                status: 'To Do',
                startDate: '',
                endDate: '',
                location: '',
                attendeeEmail: '',
            });
        }
    }, [initialData]);

    if (!isOpen) {
        return null;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const todoData = {
            title: formData.title,
            description: formData.description,
            status: formData.status,
            location: formData.location,
            attendee: formData.attendeeEmail,
            startDate: fromDateTimeLocal(formData.startDate),
            endDate: fromDateTimeLocal(formData.endDate),
        };

        const method = initialData ? 'PUT' : 'POST';
        const url = initialData ? `${API_URL}/todo/${initialData._id}` : `${API_URL}/todo`;

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(todoData)
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Failed to save todo.');
            }

            onClose();
        } catch (err) {
            alert(`Failed to save todo: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const isDateDisabled = !!initialData?.googleCalendarId;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">{initialData ? 'Edit Todo' : 'Add New Todo'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <BiX className="text-3xl" />
                    </button>
                </div>

                {/* Modal Body (Form) */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#124170] focus:border-[#124170]"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description <span className="text-gray-400">(Optional)</span>
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#124170] focus:border-[#124170]"
                        ></textarea>
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#124170] focus:border-[#124170]"
                            required
                        >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>

                    {/* Google Calendar Section */}
                    <div className="space-y-4 pt-4">
                        <h3 className="text-sm font-medium text-gray-700">Google Calendar <span className="text-gray-400">(Optional)</span></h3>
                        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                            {/* Start Date */}
                            <div className="flex-1">
                                <label htmlFor="startDate" className="sr-only">Start Date</label>
                                <input
                                    type="datetime-local"
                                    id="startDate"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#124170] focus:border-[#124170]"
                                    disabled={isDateDisabled}
                                />
                            </div>
                            {/* End Date */}
                            <div className="flex-1">
                                <label htmlFor="endDate" className="sr-only">End Date</label>
                                <input
                                    type="datetime-local"
                                    id="endDate"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#124170] focus:border-[#124170]"
                                    disabled={isDateDisabled}
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label htmlFor="location" className="sr-only">Location</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="Location"
                                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#124170] focus:border-[#124170]"
                            />
                        </div>

                        {/* Invite Attendee */}
                        <div>
                            <label htmlFor="attendeeEmail" className="sr-only">Invite Attendee (Email)</label>
                            <input
                                type="email"
                                id="attendeeEmail"
                                name="attendeeEmail"
                                value={formData.attendeeEmail}
                                onChange={handleInputChange}
                                placeholder="attendee@example.com"
                                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#124170] focus:border-[#124170]"
                            />
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[#124170] text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-[#26667F] transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Tambah;