import React, { useState, useEffect } from 'react';
import { BiX } from 'react-icons/bi';

const EditProfile = ({ user, onClose, onUpdateProfile, onSubscribe, onFetchUser }) => {
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [newPassword, setNewPassword] = useState('');
    const [voucher, setVoucher] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateStatus, setUpdateStatus] = useState({ message: '', type: '' });
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [subscribeStatus, setSubscribeStatus] = useState({ message: '', type: '' });

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setEmail(user.email);
        }
    }, [user]);

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setUpdateStatus({ message: '', type: '' });
        setIsUpdating(true);
        
        const payload = {
            username,
            email,
        };
        if (newPassword) {
            payload.password = newPassword;
        }

        try {
            await onUpdateProfile(payload);
            setUpdateStatus({ message: 'Profile updated successfully!', type: 'success' });
            setNewPassword('');
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setUpdateStatus({ message: err.message || 'Failed to update profile.', type: 'danger' });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSubscribeSubmit = async (e) => {
        e.preventDefault();
        setSubscribeStatus({ message: '', type: '' });
        setIsSubscribing(true);
        try {
            await onSubscribe(voucher);
            setSubscribeStatus({ message: 'Subscription successful!', type: 'success' });
            await onFetchUser();
        } catch (err) {
            setSubscribeStatus({ message: err.message || 'Failed to subscribe.', type: 'danger' });
        } finally {
            setIsSubscribing(false);
        }
    };

    const renderSubscriptionStatus = () => {
        if (!user) return null;
        if (user.isPremium) {
            return (
                <div className="bg-green-50 p-6 rounded-lg h-full border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Subscription Status</h3>
                    <p className="font-bold text-green-700">Premium Member</p>
                    <p className="text-sm text-gray-600 mb-4">You have access to all features and unlimited todos!</p>
                </div>
            );
        } else {
            return (
                <div className="bg-gray-50 p-6 rounded-lg h-full">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Subscription Status</h3>
                    <p className="font-bold text-gray-800">Free Account</p>
                    <p className="text-sm text-gray-600 mb-4">You are on the free plan with a limit of 10 todos.</p>
                    <h4 className="text-md font-semibold text-gray-700 mb-2">Upgrade to Premium</h4>
                    <form onSubmit={handleSubscribeSubmit} className="flex flex-wrap items-center gap-2">
                        <input
                            type="text"
                            placeholder="Enter Voucher Code"
                            value={voucher}
                            onChange={(e) => setVoucher(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 min-w-[150px]"
                        />
                        <button 
                            type="submit"
                            disabled={isSubscribing}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                        >
                            {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </form>
                    {subscribeStatus.message && <p className={`text-sm mt-2 text-${subscribeStatus.type === 'success' ? 'green' : 'red'}`}>{subscribeStatus.message}</p>}
                </div>
            );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Update Profile</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <BiX className="text-3xl" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Update Profile Section with Form */}
                        <form onSubmit={handleUpdateSubmit} className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Update Profile</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#124170] focus:border-[#124170]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#124170] focus:border-[#124170]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Change Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#124170] focus:border-[#124170]"
                                    placeholder="Leave blank if you don't want to change it."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full bg-[#124170] text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-[#26667F] transition-colors mt-6"
                            >
                                {isUpdating ? 'Updating...' : 'Update Profile'}
                            </button>
                            {updateStatus.message && <p className={`text-sm mt-2 text-${updateStatus.type === 'success' ? 'green' : 'red'}`}>{updateStatus.message}</p>}
                        </form>

                        {/* Subscription Status Section */}
                        {renderSubscriptionStatus()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;