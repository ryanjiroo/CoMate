import React, { useState, useEffect } from "react";
import { BiPlus } from "react-icons/bi";
import Tambah from "./Tambah";

const API_URL = 'https://comate-backend.vercel.app/api';

const ToDoList = ({ token }) => {
    const [todos, setTodos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);

    const fetchTodos = async () => {
        try {
            const res = await fetch(`${API_URL}/todo`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setTodos(data.todo);
        } catch (err) {
            console.error('Failed to fetch todos:', err);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, [token]);

    const openModal = () => {
        setEditingTodo(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTodo(null);
        fetchTodos(); // Refresh list after closing
    };

    const handleEditClick = (todo) => {
        setEditingTodo(todo);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this todo?')) {
            try {
                const res = await fetch(`${API_URL}/todo/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Failed to delete');
                fetchTodos();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleAddToCalendar = async (id) => {
        if (window.confirm("Are you sure you want to add this to Google Calendar?")) {
            try {
                const res = await fetch(`${API_URL}/todo/${id}/calendar`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) throw new Error((await res.json()).message || "Failed to add to calendar");
                alert("Successfully added to calendar!");
                fetchTodos();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const formatDisplayDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'To Do':
                return 'bg-gray-200 text-gray-800';
            case 'In Progress':
                return 'bg-blue-200 text-blue-800';
            case 'Done':
                return 'bg-green-200 text-green-800';
            default:
                return 'bg-yellow-200 text-yellow-800';
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
                <div className="flex flex-col">
                    <h1 className="text-4xl font-bold text-[#124170] font-[Outfit]">
                        My Todos
                    </h1>
                    <p className="text-md text-gray-500 font-[Poppins]">
                        Catat dan Kelola Aktivitasmu
                    </p>
                </div>
                <button
                    onClick={openModal}
                    className="bg-[#124170] text-white px-4 py-2 rounded-lg font-[Poppins] flex items-center shadow-md hover:bg-[#26667F] transition-colors">
                    <BiPlus className="mr-2" />
                    Tambah Tugas
                </button>
            </div>

            <div className="flex space-x-6 mb-8">
                {/* Progress Card */}
                <div className="bg-white p-6 rounded-2xl shadow-lg flex-1">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Progress Minggu Ini
                    </h3>
                    <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                        <div
                            className="bg-[#26667F] h-4 rounded-full"
                            style={{ width: "50%" }}
                        ></div>
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white">
                            50%
                        </span>
                    </div>
                </div>

                {/* Kepedatan Card */}
                <div className="bg-white p-6 rounded-2xl shadow-lg flex-1">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Kepadatan (Minggu Ini)
                    </h3>
                    <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                        <div
                            className="bg-[#F33A3A] h-4 rounded-full"
                            style={{ width: "100%" }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Daftar Tugas Table */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Daftar Tugas</h3>
                {todos.length === 0 ? (
                    <div className="text-center p-5 text-gray-500">No todos yet. Add one to get started!</div>
                ) : (
                    <table className="w-full text-left table-auto">
                        <thead>
                            <tr className="text-gray-500 text-sm border-b">
                                <th className="pb-3 pr-4">Nama Tugas</th>
                                <th className="pb-3 px-4">Start</th>
                                <th className="pb-3 px-4">End</th>
                                <th className="pb-3 px-4">Status</th>
                                <th className="pb-3 pl-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {todos.map((todo) => (
                                <tr key={todo._id} className="border-b last:border-b-0">
                                    <td className="py-4 pr-4">
                                        <div className="font-semibold text-gray-800">
                                            {todo.title}
                                        </div>
                                        <div className="text-sm text-gray-500">{todo.description}</div>
                                    </td>
                                    <td className="py-4 px-4">{todo.startDate ? formatDisplayDate(todo.startDate) : '-'}</td>
                                    <td className="py-4 px-4">{todo.endDate ? formatDisplayDate(todo.endDate) : '-'}</td>
                                    <td className="py-4 px-4">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(todo.status)}`}>
                                            {todo.status}
                                        </span>
                                    </td>
                                    <td className="py-4 pl-4 text-right space-x-2">
                                        {todo.googleCalendarUrl ? (
                                            <a href={todo.googleCalendarUrl} target="_blank" className="text-[#124170] hover:text-[#26667F] transition-colors">
                                                In Calendar
                                            </a>
                                        ) : (
                                            <button onClick={() => handleAddToCalendar(todo._id)} className="text-[#124170] hover:text-[#26667F] transition-colors">
                                                Add To Calendar
                                            </button>
                                        )}
                                        <button onClick={() => handleEditClick(todo)} className="text-gray-500 hover:text-gray-700 transition-colors">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteClick(todo._id)} className="text-red-500 hover:text-red-700 transition-colors">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <Tambah
                isOpen={isModalOpen}
                onClose={closeModal}
                token={token}
                initialData={editingTodo}
            />
        </div>
    );
};

export default ToDoList;
