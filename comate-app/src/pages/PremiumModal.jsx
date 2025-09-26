import React from 'react';
import { BiX, BiDiamond } from 'react-icons/bi';

const PremiumModal = ({ isOpen, onClose, message }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm transform transition-all duration-300 scale-100">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Premium Feature</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <BiX className="text-3xl" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 text-center">
                    <BiDiamond className="text-yellow-500 text-6xl mx-auto mb-4" />
                    <p className="text-lg text-gray-700 font-semibold mb-2">{message}</p>
                    <p className="text-sm text-gray-500">Upgrade to premium to unlock this feature and more.</p>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-center p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="bg-[#124170] text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-[#26667F] transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PremiumModal;