import React, { useState } from "react";
import { BiPlus } from "react-icons/bi";
// Hapus import Dashboard dari sini

const ToDoList = () => {
    const [todos, setTodos] = useState([
        {
            namaTugas: "Course Machine Learning",
            deskripsi: "Menyelesaikan course Machine Learning di Dicoding",
            start: "9 Sept",
            end: "9 Sept",
            status: "Pending",
        },
    ]);

    // Hapus tag <Dashboard> di sini
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
                <button className="bg-[#124170] text-white px-4 py-2 rounded-lg font-[Poppins] flex items-center shadow-md hover:bg-[#26667F] transition-colors">
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
                <table className="w-full text-left table-auto">
                    <thead>
                        <tr className="text-gray-500 text-sm border-b">
                            <th className="pb-3 pr-4">Nama Tugas</th>
                            <th className="pb-3 px-4">Start</th>
                            <th className="pb-3 px-4">End</th>
                            <th className="pb-3 px-4">Status</th>
                            <th className="pb-3 pl-4">Simpan ke Kalender</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todos.map((todo, index) => (
                            <tr key={index} className="border-b last:border-b-0">
                                <td className="py-4 pr-4">
                                    <div className="font-semibold text-gray-800">
                                        {todo.namaTugas}
                                    </div>
                                    <div className="text-sm text-gray-500">{todo.deskripsi}</div>
                                </td>
                                <td className="py-4 px-4">{todo.start}</td>
                                <td className="py-4 px-4">{todo.end}</td>
                                <td className="py-4 px-4">
                                    <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                                        {todo.status}
                                    </span>
                                </td>
                                <td className="py-4 pl-4">
                                    <button className="flex items-center text-[#124170] hover:text-[#26667F] transition-colors">
                                        Add To Calendar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ToDoList;