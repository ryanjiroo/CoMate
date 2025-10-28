import React, { useState, useEffect, useCallback } from "react";
import { 
    BiArrowBack, 
    BiPencil, 
    BiTrash, 
    BiDiamond, 
    BiCheck, 
    BiX 
} from "react-icons/bi";

const API_URL = 'https://comate-backend.vercel.app/api';

// --- Helper Functions ---
const getInitials = (name = "") => (name[0] || '?').toUpperCase();
const formatCommentDate = (dateString) => dateString ? new Date(dateString).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
};
const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'to do': return 'bg-gray-200 text-gray-800';
        case 'pending': return 'bg-yellow-200 text-yellow-800';
        case 'in progress': return 'bg-blue-200 text-blue-800';
        case 'done': return 'bg-green-200 text-green-800';
        default: return 'bg-gray-200 text-gray-800';
    }
};

// --- Komponen Utama ---
const DetailGroupTask = ({ token, user, isPremium, taskId, onBackToTodos, onShowPremiumModal, onNavigateToProfile }) => {
    
    // --- State ---
    const [task, setTask] = useState(null);
    const [todos, setTodos] = useState([]);
    const [comments, setComments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [alert, setAlert] = useState({ message: null, type: null }); 
    
    const [taskTitle, setTaskTitle] = useState("");
    const [inviteEmail, setInviteEmail] = useState("");
    const [commentContent, setCommentContent] = useState("");

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentContent, setEditingCommentContent] = useState("");

    // --- API Call Helper ---
    const apiCall = useCallback(async (endpoint, method = 'GET', body = null) => {
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
    }, [token]);

    // --- Fetch Data ---
    const fetchData = useCallback(async () => {
        if (!taskId) return;
        setIsLoading(true);
        setAlert({ message: null, type: null });
        try {
            const data = await apiCall(`/tasks/${taskId}/details`);
            setTask(data.task);
            setTaskTitle(data.task.title);
            setTodos(data.todos);
            setComments(data.comments);
        } catch (err) {
            setAlert({ message: err.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [taskId, apiCall]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Alert Handler ---
    const clearAlert = () => {
        setAlert({ message: null, type: null });
    };

    // --- Form Handlers ---
    const handleTitleSubmit = async (e) => {
        e.preventDefault();
        clearAlert();
        try {
            const updatedTask = await apiCall(`/tasks/${taskId}`, 'PUT', { title: taskTitle });
            setTask(updatedTask);
            setAlert({ message: 'Task title updated successfully!', type: 'success' });
        } catch (err) {
            setAlert({ message: err.message, type: 'error' });
        }
    };

    const handleInviteSubmit = async (e) => {
        e.preventDefault();
        clearAlert();
        if (!isPremium) {
            onShowPremiumModal("Invite Members is a premium feature.");
            return;
        }
        try {
            const data = await apiCall(`/tasks/${taskId}/invite`, 'POST', { email: inviteEmail });
            setTask(data.task);
            setInviteEmail("");
            setAlert({ message: data.message, type: 'success' });
        } catch (err) {
            setAlert({ message: err.message, type: 'error' });
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        clearAlert();
        if (!isPremium) {
            onShowPremiumModal("Adding comments is a premium feature.");
            return;
        }
        try {
            const newComment = await apiCall(`/comments/${taskId}`, 'POST', { content: commentContent });
            setComments(prevComments => [...prevComments, newComment]);
            setCommentContent("");
        } catch (err) {
            setAlert({ message: err.message, type: 'error' });
        }
    };

    // --- Comment Edit/Delete Handlers ---
    const handleDeleteComment = async (commentId) => {
        clearAlert();
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await apiCall(`/comments/${commentId}`, 'DELETE');
                setComments(prev => prev.filter(c => c._id !== commentId));
            } catch (err) {
                setAlert({ message: err.message, type: 'error' });
            }
        }
    };

    const startEditComment = (comment) => {
        setEditingCommentId(comment._id);
        setEditingCommentContent(comment.content);
    };

    const cancelEditComment = () => {
        setEditingCommentId(null);
        setEditingCommentContent("");
    };

    const submitEditComment = async (e, commentId) => {
        e.preventDefault();
        clearAlert();
        try {
            const updatedComment = await apiCall(`/comments/${commentId}`, 'PUT', { content: editingCommentContent });
            setComments(prev => prev.map(c => c._id === commentId ? { ...c, content: updatedComment.content } : c));
            cancelEditComment();
        } catch (err) {
            setAlert({ message: err.message, type: 'error' });
        }
    };
    
    // --- Todo Handlers (Delete/Calendar) ---
    const handleDeleteTodo = async (todoId) => {
        clearAlert();
         if (window.confirm('Are you sure you want to delete this todo?')) {
            try {
                await apiCall(`/todo/${todoId}`, 'DELETE');
                setTodos(prev => prev.filter(t => t._id !== todoId));
            } catch (err) {
                setAlert({ message: err.message, type: 'error' });
            }
        }
    };
    
    const handleAddTodoToCalendar = async (todoId) => {
        clearAlert();
        if (window.confirm("Are you sure you want to add this to Google Calendar?")) {
            try {
                await apiCall(`/todo/${todoId}/calendar`, 'POST');
                fetchData();
            } catch (err) {
                setAlert({ message: err.message, type: 'error' });
            }
        }
    };

    // --- Render ---
    if (isLoading) {
        return <div className="text-center p-10 text-gray-500">Loading task details...</div>;
    }

    // --- Sub-Komponen ---

    // Komponen Todo Item
    const TodoItem = ({ item }) => (
        <div className="border-b last:border-b-0 p-4 hover:bg-gray-50 transition-colors duration-150">
            <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                    </span>
                    <strong className="text-lg text-gray-900">{item.title}</strong>
                </div>
                <div className="flex space-x-3 text-gray-500 flex-shrink-0">
                     <button title="Edit Todo" className="hover:text-gray-800">
                        <BiPencil />
                     </button>
                    <button onClick={() => handleDeleteTodo(item._id)} title="Delete Todo" className="hover:text-red-600">
                        <BiTrash />
                    </button>
                </div>
            </div>
            <div className="text-sm text-gray-600 mt-2 pl-10 space-y-1">
                {item.description && <p className="italic">"{item.description}"</p>}
                {item.startDate && 
                    <p>
                        <span className="font-semibold">Time:</span> {formatDisplayDate(item.startDate)} &mdash; {formatDisplayDate(item.endDate)}
                    </p>
                }
                {item.googleCalendarUrl ? (
                    <a href={item.googleCalendarUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 font-semibold">
                        View in Calendar
                    </a>
                ) : (
                    item.startDate &&
                    <button onClick={() => handleAddTodoToCalendar(item._id)} className="text-blue-600 font-semibold">
                        Add to Calendar
                    </button>
                )}
            </div>
        </div>
    );

    // Komponen Alert
    const Alert = ({ message, type }) => {
        if (!message) return null;
        const isError = type === 'error';
        const bgColor = isError ? 'bg-red-50' : 'bg-green-50';
        const borderColor = isError ? 'border-red-300' : 'border-green-300';
        const textColor = isError ? 'text-red-800' : 'text-green-800';
        
        return (
            <div className={`${bgColor} ${borderColor} ${textColor} border px-4 py-3 rounded-lg relative mb-6`} role="alert">
                <span className="block sm:inline">{message}</span>
                <span onClick={clearAlert} className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer">
                    <BiX className="h-6 w-6" />
                </span>
            </div>
        );
    };

    // --- JSX Utama ---
    return (
        <div className="flex flex-col h-full">
            <button
                onClick={onBackToTodos}
                className="mb-4 flex items-center text-gray-600 hover:text-gray-900 font-semibold w-max transition-colors"
            >
                <BiArrowBack className="mr-2" />
                Back to Todos
            </button>

            <Alert message={alert.message} type={alert.type} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                
                {/* Kolom Kiri: Konten Utama */}
                <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                    {/* 1. Form Judul Task */}
                    <form onSubmit={handleTitleSubmit} className="pb-6">
                        <label htmlFor="task-detail-title" className="block text-2xl font-bold text-gray-900 mb-2">
                            Task Title
                        </label>
                        <div className="mt-1 flex relative">
                            <input
                                type="text"
                                id="task-detail-title"
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                className="flex-1 block w-full rounded-l-lg border-gray-200 bg-gray-50 focus:z-10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-300 sm:text-lg transition-all placeholder:text-gray-400 px-6 py-3"
                                required
                            />
                            <button
                                type="submit"
                                className="ml-[-1px] relative inline-flex justify-center rounded-r-lg border border-transparent bg-[#124170] py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#26667F] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 z-10"
                            >
                                Save Title
                            </button>
                        </div>
                    </form>

                    <hr className="my-6" />

                    {/* 2. Daftar Todos */}
                    <div className="pb-6">
                        <h5 className="text-2xl font-bold text-gray-900 mb-4">Todos in this Task</h5>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            {todos.length > 0 ? (
                                todos.map(todo => <TodoItem key={todo._id} item={todo} />)
                            ) : (
                                <p className="p-4 text-gray-500">No todos in this task yet.</p>
                            )}
                        </div>
                    </div>

                    <hr className="my-6" />

                    {/* 3. Daftar Komentar */}
                    <div>
                        <h5 className="text-2xl font-bold text-gray-900 mb-4">Comments</h5>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2 mb-4">
                            {comments.length > 0 ? (
                                comments.map(comment => (
                                    <div key={comment._id} className="flex space-x-3">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600">
                                            {getInitials(comment.username)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <span className="font-semibold text-gray-900">{comment.username}</span>
                                                    <span className="text-xs text-gray-500 ml-2">{formatCommentDate(comment.createdAt)}</span>
                                                </div>
                                                {user._id === comment.user_id && editingCommentId !== comment._id && (
                                                    <div className="flex space-x-2 text-gray-400">
                                                        <button onClick={() => startEditComment(comment)} title="Edit" className="hover:text-gray-600"><BiPencil /></button>
                                                        <button onClick={() => handleDeleteComment(comment._id)} title="Delete" className="hover:text-red-600"><BiTrash /></button>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {editingCommentId === comment._id ? (
                                                <form onSubmit={(e) => submitEditComment(e, comment._id)} className="mt-2">
                                                    <textarea
                                                        value={editingCommentContent}
                                                        onChange={(e) => setEditingCommentContent(e.target.value)}
                                                        className="w-full border-gray-200 bg-gray-50 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-300 transition-all placeholder:text-gray-400 px-6 py-3"
                                                        rows="3"
                                                        required
                                                    />
                                                    <div className="flex space-x-2 mt-2">
                                                        <button type="submit" className="text-green-600"><BiCheck size={20} /></button>
                                                        <button type="button" onClick={cancelEditComment} className="text-red-600"><BiX size={20} /></button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <p className="text-gray-700 mt-1 whitespace-pre-wrap">{comment.content}</p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No comments yet.</p>
                            )}
                        </div>
                        
                        {/* Form Tambah Komentar */}
                        <form onSubmit={handleCommentSubmit} className="relative mt-6">
                            {!isPremium && (
                                <div className="absolute inset-0 bg-gray-100 bg-opacity-80 flex flex-col items-center justify-center rounded-lg z-10">
                                    <BiDiamond className="text-yellow-500 text-3xl mb-2" />
                                    <span className="font-semibold text-gray-700">Comments are a Premium Feature</span>
                                    <button
                                        type="button"
                                        onClick={onNavigateToProfile}
                                        className="mt-2 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-semibold"
                                    >
                                        Upgrade Now
                                    </button>
                                </div>
                            )}
                            <textarea
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                className="w-full border-gray-200 bg-gray-50 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-300 transition-all placeholder:text-gray-400 px-6 py-3"
                                rows="3"
                                placeholder="Add a comment..."
                                required
                                disabled={!isPremium}
                            />
                            <button
                                type="submit"
                                className="mt-2 inline-flex justify-center rounded-md border border-transparent bg-[#124170] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-[#26667F] disabled:opacity-50"
                                disabled={!isPremium}
                            >
                                Post Comment
                            </button>
                        </form>
                    </div>
                </div>

                {/* Kolom Kanan: Kolaborasi (Sticky) */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg sticky top-6">
                        <h5 className="text-2xl font-bold text-gray-900 mb-4">Team Collaboration <span className="text-xs font-bold text-yellow-500 uppercase ml-1">(Premium)</span></h5>
                        
                        {/* Daftar Anggota */}
                        <h6 className="text-lg font-semibold text-gray-700 mb-3">Members</h6>
                        <ul className="space-y-3 mb-6">
                            {task && task.members.length > 0 ? (
                                task.members.map(member => (
                                    <li key={member._id} className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600">
                                            {getInitials(member.username)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{member.username}</p>
                                            <p className="text-sm text-gray-500">{member.email}</p>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No members yet.</p>
                            )}
                        </ul>
                        
                        <hr className="my-6" />

                        {/* Form Invite */}
                        <form onSubmit={handleInviteSubmit} className="relative">
                             {!isPremium && (
                                <div className="absolute inset-0 bg-gray-100 bg-opacity-80 flex flex-col items-center justify-center rounded-lg z-10">
                                    <BiDiamond className="text-yellow-500 text-3xl mb-2" />
                                    <span className="font-semibold text-gray-700">Invite is a Premium Feature</span>
                                    <button
                                        type="button"
                                        onClick={onNavigateToProfile}
                                        className="mt-2 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-semibold"
                                    >
                                        Upgrade Now
                                    </button>
                                </div>
                            )}
                            <label htmlFor="task-invite-email" className="block text-lg font-semibold text-gray-700 mb-2">
                                Invite Member
                            </label>
                            <div className="mt-1 flex relative">
                                <input
                                    type="email"
                                    id="task-invite-email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    className="flex-1 block w-full rounded-l-lg border-gray-200 bg-gray-50 focus:z-10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-300 transition-all placeholder:text-gray-400 px-6 py-2"
                                    placeholder="new.member@example.com"
                                    required
                                    disabled={!isPremium}
                                />
                                <button
                                    type="submit"
                                    className="ml-[-1px] relative inline-flex justify-center rounded-r-lg border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50 z-10"
                                    disabled={!isPremium}
                                >
                                    Invite
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailGroupTask;