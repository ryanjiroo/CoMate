import React, { useState, useEffect } from "react";
import { BiPlus, BiPencil, BiTrash } from "react-icons/bi";
import Tambah from "./Tambah";
import GroupTask from "./GroupTask";

const API_URL = 'https://comate-backend.vercel.app/api';

// --- FUNGSI BANTUAN UNTUK PERHITUNGAN MINGGUAN ---

const getWeeklyRange = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); 
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return { startOfWeek, endOfWeek };
};

const getProgressStats = (todos) => {
    const { startOfWeek, endOfWeek } = getWeeklyRange();
    
    const weeklyTodos = todos.filter(t => {
        const start = t.startDate ? new Date(t.startDate) : null;
        const end = t.endDate ? new Date(t.endDate) : null;
        const isStartInWeek = start && start >= startOfWeek && start <= endOfWeek;
        const isEndInWeek = end && end >= startOfWeek && end <= endOfWeek;
        return isStartInWeek || isEndInWeek;
    });

    const totalWeekly = weeklyTodos.length;
    const doneWeekly = weeklyTodos.filter(t => t.status.toLowerCase() === 'done').length;
    
    const progress = totalWeekly > 0 ? Math.round((doneWeekly / totalWeekly) * 100) : 0;
    
    // Logika Warna Progress: Merah < 30%, Kuning < 70%, Hijau >= 70%
    let progressColorClass = '';
    if (progress < 30) {
        progressColorClass = 'bg-red-500'; // Merah
    } else if (progress < 70) {
        progressColorClass = 'bg-yellow-500'; // Kuning
    } else {
        progressColorClass = 'bg-green-500'; // Hijau
    }

    return { totalWeekly, doneWeekly, progress, progressColorClass };
};

const calculateDensity = (todos) => {
    const { startOfWeek, endOfWeek } = getWeeklyRange();
    
    const activeWeeklyTodosCount = todos.filter(t => {
        const start = t.startDate ? new Date(t.startDate) : null;
        const end = t.endDate ? new Date(t.endDate) : null;
        const status = t.status.toLowerCase();

        const isStartInWeek = start && start >= startOfWeek && start <= endOfWeek;
        const isEndInWeek = end && end >= startOfWeek && end <= endOfWeek;
        
        const isActive = status !== 'done' && (isStartInWeek || isEndInWeek);
        return isActive;
    }).length;

    let densityText = '';
    let densityColor = '';
    
    // Logika Kepadatan: < 3 (Santai/Hijau), 3-4 (Sedang/Kuning), >= 5 (Sibuk/Merah)
    if (activeWeeklyTodosCount < 3) {
        densityText = 'Santai';
        densityColor = 'bg-green-500'; 
    } else if (activeWeeklyTodosCount >= 3 && activeWeeklyTodosCount < 5) {
        densityText = 'Sedang';
        densityColor = 'bg-yellow-500'; 
    } else { 
        densityText = 'Sibuk';
        densityColor = 'bg-red-500'; 
    }

    const MAX_DENSITY_TASK = 5;
    const densityScore = Math.min((activeWeeklyTodosCount / MAX_DENSITY_TASK) * 100, 100);

    return { densityScore, densityText, densityColor };
};

// --- KOMPONEN UTAMA ---

const ToDoList = ({ token, isPremium, onShowPremiumModal }) => {
    const [allTodos, setAllTodos] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const { progress, totalWeekly, progressColorClass } = getProgressStats(allTodos); // Ambil progressColorClass baru
    const { densityScore, densityText, densityColor } = calculateDensity(allTodos);

    const apiCall = async (endpoint, method = 'GET', body = null) => {
        const options = {
            method,
            headers: { 'Authorization': `Bearer ${token}` }
        };
        if (body) {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
        }
        const res = await fetch(`${API_URL}${endpoint}`, options);
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || 'API request failed');
        }
        return data;
    };

    const fetchAllData = async () => {
        setIsLoading(true);
        try {
            const [todosData, tasksData] = await Promise.all([
                apiCall('/todo'),
                apiCall('/tasks')
            ]);
            setAllTodos(todosData.todo);
            setAllTasks(tasksData);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [token]);

    const openModal = () => {
        if (!isPremium && allTodos.length >= 10) {
            if (onShowPremiumModal) {
                onShowPremiumModal("You have reached the 10 todo limit for free accounts.");
            } else {
                alert("You have reached the 10 todo limit for free accounts.");
            }
            return;
        }
        setEditingTodo(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTodo(null);
        fetchAllData();
    };

    const openGroupModal = (task = null) => {
        setEditingTask(task);
        setIsGroupModalOpen(true);
    };

    const closeGroupModal = () => {
        setIsGroupModalOpen(false);
        setEditingTask(null);
        fetchAllData();
    };

    const handleSaveTodo = async (payload, method, url) => {
        try {
            const response = await apiCall(url, method, payload);
            const savedTodo = response.updatedTodo || response.todo;
            if (savedTodo) {
                setAllTodos(prevTodos => {
                    const index = prevTodos.findIndex(t => t._id === savedTodo._id);
                    if (index !== -1) {
                        return prevTodos.map(t => t._id === savedTodo._id ? savedTodo : t);
                    } else {
                        return [savedTodo, ...prevTodos];
                    }
                });
            }
            closeModal();
        } catch(err) {
            alert(err.message);
        }
    };

    const handleSaveTask = async (payload, method, url) => {
        try {
            const response = await apiCall(url, method, payload);
            const savedTask = response.updatedTask || response.task;
            if (savedTask) {
                setAllTasks(prevTasks => {
                    const index = prevTasks.findIndex(t => t._id === savedTask._id);
                    if (index !== -1) {
                        return prevTasks.map(t => t._id === savedTask._id ? savedTask : t);
                    } else {
                        return [savedTask, ...prevTasks];
                    }
                });
            }
            closeGroupModal();
        } catch(err) {
            alert(err.message);
        }
    };

    const handleEditClick = (todo) => {
        setEditingTodo(todo);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this todo?')) {
            try {
                await apiCall(`/todo/${id}`, 'DELETE');
                setAllTodos(prev => prev.filter(t => t._id !== id));
            } catch (err) {
                alert(err.message);
            }
        }
    };
    
    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task? Todos inside will not be deleted.')) {
            try {
                await apiCall(`/tasks/${taskId}`, 'DELETE');
                setAllTasks(prevTasks => prevTasks.filter(t => t._id !== taskId));
                setAllTodos(prevTodos => prevTodos.map(todo => 
                    todo.taskId === taskId ? { ...todo, taskId: null } : todo
                ));
            } catch(err) {
                alert(err.message);
            }
        }
    };
    
    const handleAddToCalendar = async (id) => {
        if (window.confirm("Are you sure you want to add this to Google Calendar?")) {
            try {
                await apiCall(`/todo/${id}/calendar`, 'POST');
                alert("Successfully added to calendar!");
                fetchAllData();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    // --- LOGIKA DRAG & DROP ---
    const handleDragStart = (e, todoId) => {
        e.dataTransfer.setData("todoId", todoId);
    };

    const handleDragOver = (e) => {
        e.preventDefault(); 
        e.currentTarget.classList.add('bg-blue-100', 'border-blue-400');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('bg-blue-100', 'border-blue-400');
    };

    const handleDrop = async (e, newTaskId) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-blue-100', 'border-blue-400');
        const todoId = e.dataTransfer.getData("todoId");
        
        if (!todoId) return;

        const url = `/todo/${todoId}/move/${newTaskId || 'none'}`; 
        
        try {
            // Pembaruan UI Optimistis
            setAllTodos(prevTodos => prevTodos.map(todo => 
                todo._id === todoId ? { ...todo, taskId: newTaskId || null } : todo
            ));

            // Panggilan API di background
            await apiCall(url, 'PUT');

        } catch (err) {
            alert(err.message || 'Failed to move todo. Reverting changes.');
            fetchAllData(); 
        }
    };
    // --- AKHIR LOGIKA DRAG & DROP ---
    
    const formatDisplayDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'to do':
                return 'bg-gray-200 text-gray-800';
            case 'pending':
                return 'bg-yellow-200 text-yellow-800';
            case 'in progress':
                return 'bg-blue-200 text-blue-800';
            case 'done':
                return 'bg-green-200 text-green-800';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    const createTodoHTML = (item) => {
        const calendarButton = item.googleCalendarUrl ? (
            <a href={item.googleCalendarUrl} target="_blank" rel="noopener noreferrer" className="text-[#124170] hover:text-[#26667F] transition-colors">
                In Calendar
            </a>
        ) : (
            <button onClick={() => handleAddToCalendar(item._id)} className="text-[#124170] hover:text-[#26667F] transition-colors">
                Add To Calendar
            </button>
        );
        
        return (
            <tr 
                key={item._id} 
                className="border-b last:border-b-0 cursor-grab"
                draggable
                onDragStart={(e) => handleDragStart(e, item._id)}
            >
                <td className="py-4 pr-4">
                    <div className="font-semibold text-gray-800">{item.title}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                </td>
                <td className="py-4 px-4">{item.startDate ? formatDisplayDate(item.startDate) : '-'}</td>
                <td className="py-4 px-4">{item.endDate ? formatDisplayDate(item.endDate) : '-'}</td>
                <td className="py-4 px-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                    </span>
                </td>
                <td className="py-4 pl-4 text-right space-x-2">
                    {calendarButton}
                    <button onClick={() => handleEditClick(item)} className="text-gray-500 hover:text-gray-700 transition-colors">Edit</button>
                    <button onClick={() => handleDeleteClick(item._id)} className="text-red-500 hover:text-red-700 transition-colors">Delete</button>
                </td>
            </tr>
        );
    };

    const uncategorizedTodos = allTodos.filter(todo => !todo.taskId);
    
    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
                <div className="flex flex-col">
                    <h1 className="text-4xl font-bold text-[#124170] font-[Outfit]">My Todos</h1>
                    <p className="text-md text-gray-500 font-[Poppins]">Catat dan Kelola Aktivitasmu</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={() => openGroupModal()} className="border border-[#124170] text-[#124170] px-4 py-2 rounded-lg font-[Poppins] flex items-center shadow-md hover:bg-gray-100 transition-colors">
                        <BiPlus className="mr-2" />
                        Tambah Grup
                    </button>
                    <button onClick={openModal} className="bg-[#124170] text-white px-4 py-2 rounded-lg font-[Poppins] flex items-center shadow-md hover:bg-[#26667F] transition-colors">
                        <BiPlus className="mr-2" />
                        Tambah Tugas
                    </button>
                </div>
            </div>

            <div className="flex space-x-6 mb-8">
                {/* --- PROGRESS MINGGU INI --- */}
                <div className="bg-white p-6 rounded-2xl shadow-lg flex-1">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Progress Minggu Ini</h3>
                    <p className="text-sm text-gray-500 mb-3">
                        {totalWeekly > 0 ? `${totalWeekly} tugas terjadwal minggu ini.` : 'Tidak ada tugas terjadwal minggu ini.'}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                        {/* Menerapkan progressColorClass baru */}
                        <div className={`${progressColorClass} h-4 rounded-full transition-all duration-500`} style={{ width: `${progress}%` }}></div>
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white">
                            {progress}%
                        </span>
                    </div>
                </div>
                
                {/* --- KEPADATAN MINGGU INI --- */}
                <div className="bg-white p-6 rounded-2xl shadow-lg flex-1">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Kepadatan ({densityText})</h3>
                    <p className="text-sm text-gray-500 mb-3">
                        Tingkat kesibukan berdasarkan jumlah tugas aktif mingguan.
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                        <div className={`${densityColor} h-4 rounded-full transition-all duration-500`} style={{ width: `${densityScore}%` }}></div>
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white">
                            {densityScore}%
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Daftar Tugas</h3>
                {isLoading ? (
                    <div className="text-center p-5 text-gray-500">Loading todos...</div>
                ) : allTodos.length === 0 && allTasks.length === 0 ? (
                    <div className="text-center p-5 text-gray-500">No tasks or todos yet. Add one to get started!</div>
                ) : (
                    <>
                        {allTasks.map(task => (
                            // Wrapper untuk Task Group (Target Drop)
                            <div 
                                key={task._id} 
                                className="mb-8 p-4 border border-transparent transition-all rounded-xl"
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, task._id)} // Drop ke Task ID
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-lg font-bold text-gray-800">{task.title}</h4>
                                    <div className="space-x-2">
                                        <button onClick={() => openGroupModal(task)} className="text-gray-500 hover:text-gray-700 transition-colors">
                                            <BiPencil />
                                        </button>
                                        <button onClick={() => handleDeleteTask(task._id)} className="text-red-500 hover:text-red-700 transition-colors">
                                            <BiTrash />
                                        </button>
                                    </div>
                                </div>
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
                                        {allTodos.filter(t => t.taskId === task._id).map(createTodoHTML)}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                        {uncategorizedTodos.length > 0 && (
                            // Wrapper untuk Uncategorized Todos (Target Drop: null/none)
                            <div 
                                className="mt-6 p-4 border border-transparent transition-all rounded-xl"
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, null)} // Drop ke NULL (Uncategorized)
                            >
                                <h4 className="text-xl font-bold text-gray-800 mb-4">Other Todos</h4>
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
                                        {uncategorizedTodos.map(createTodoHTML)}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
            <Tambah
                isOpen={isModalOpen}
                onClose={closeModal}
                token={token}
                initialData={editingTodo}
                allTasks={allTasks}
                onSave={handleSaveTodo}
            />
            <GroupTask
                isOpen={isGroupModalOpen}
                onClose={closeGroupModal}
                token={token}
                initialData={editingTask}
                onSave={handleSaveTask}
            />
        </div>
    );
};

export default ToDoList;
