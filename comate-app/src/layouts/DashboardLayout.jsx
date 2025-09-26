import React, { useEffect, useState } from "react";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";
import { BiListCheck, BiBot, BiLogOut, BiEdit, BiDiamond, BiChat} from "react-icons/bi";
import EditProfile from "../pages/EditProfile";
import PremiumModal from "../pages/PremiumModal"; 

const Dashboard = ({ onLogout, children, user, onPageChange, currentPage, onUpdateProfile, onSubscribe, onFetchUser }) => {
  const [avatarSvg, setAvatarSvg] = useState("");
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  useEffect(() => {
    if (user && user.email) {
      const avatar = createAvatar(avataaars, {
        seed: user.email,
        backgroundColor: ["b6e3f4", "c0aede", "d1d4f9"],
      });
      const dataUri = avatar.toDataUri();
      setAvatarSvg(dataUri);
    }
  }, [user]);

  const handleNavClick = (e, page) => {
    e.preventDefault();
    if (page === 'ai-recommendation' && !user?.isPremium) {
      setIsPremiumModalOpen(true);
      return;
    }
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handleOpenEditModal = () => setIsEditProfileModalOpen(true);
  const handleCloseEditModal = () => setIsEditProfileModalOpen(false);

  const activeLinkClass = "bg-white/10 rounded-lg";
  const linkClass = "flex items-center font-[Poppins] text-[#DDF4E7] hover:text-white transition-colors duration-200 p-2";

  const isPremium = user?.isPremium;
  const subscriptionText = isPremium ? 'Premium Account' : 'Free Account';
  const subscriptionColor = isPremium ? 'text-yellow-400' : 'text-gray-200';

  const isAiRecommendationEnabled = isPremium;
  const aiLinkClasses = isAiRecommendationEnabled
    ? linkClass
    : "flex items-center font-[Poppins] text-gray-400 cursor-not-allowed p-2";

  return (
    <div
      // Ganti min-h-screen menjadi h-screen untuk membatasi tinggi ke viewport.
      // overflow-hidden ditambahkan agar scroll bar hanya muncul di <main>.
      className="flex h-screen font-sans overflow-hidden" 
      style={{ background: "linear-gradient(to right, #26667F, #124170)" }}
    >
      <aside className="w-64 p-6 flex flex-col justify-between flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-[#DDF4E7] mb-8 font-[Outfit]">
            CoMate
          </h1>
          <nav>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  onClick={(e) => handleNavClick(e, 'todos')}
                  className={`${linkClass} ${currentPage === 'todos' ? activeLinkClass : ''}`}
                >
                  <BiListCheck className="mr-3 text-2xl" />
                  My Todos
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => handleNavClick(e, 'chatbot')}
                  className={`${linkClass} ${currentPage === 'chatbot' ? activeLinkClass : ''}`}
                >
                  <BiChat className="mr-3 text-2xl" />
                  Chatbot
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => handleNavClick(e, 'ai-recommendation')}
                  className={`${aiLinkClasses} ${currentPage === 'ai-recommendation' ? activeLinkClass : ''}`}
                >
                  <BiBot className="mr-3 text-2xl" />
                  Recommender
                  {!isAiRecommendationEnabled && (
                    <BiDiamond className="ml-2 text-yellow-400 text-lg" />
                  )}
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center text-[#DDF4E7] font-[Poppins] hover:text-white transition-colors duration-200"
        >
          <BiLogOut className="mr-3 text-2xl" />
          Log Out
        </button>
      </aside>

      {/* Kontainer Konten Kanan - flex-1 agar mengambil sisa ruang, dan MINIMUM tinggi penuh */}
      <div className="flex-1 flex p-6 pr-12 min-h-full"> 
        
        {/* Main Content Area - Tambahkan flex-col untuk layout internal, h-full, dan overflow-y-auto */}
        <main className="flex-1 bg-[#F4F7F7] rounded-l-3xl p-8 shadow-lg overflow-y-auto h-full flex flex-col">
          {children}
        </main>
        
        <div className="w-80 p-6 flex flex-col items-center text-white rounded-r-3xl bg-[#F4F7F7]/30 flex-shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-white">
            {avatarSvg && <img src={avatarSvg} alt="User Avatar" />}
          </div>
          <h2 className="text-2xl font-bold mb-1">
            {user?.username || "Guest"}
          </h2>
          <p className="text-sm text-gray-200">
            {user?.email || "N/A"}
          </p>
          <p className={`text-sm font-semibold mb-6 ${subscriptionColor}`}>
            {subscriptionText}
          </p>
          <button
            onClick={handleOpenEditModal}
            className="flex items-center text-white opacity-80 hover:opacity-100 transition-opacity"
          >
            <BiEdit className="mr-2 text-xl" />
            Edit Profile
          </button>
        </div>
      </div>
      {isEditProfileModalOpen && (
        <EditProfile
          user={user}
          onClose={handleCloseEditModal}
          onUpdateProfile={onUpdateProfile}
          onSubscribe={onSubscribe}
          onFetchUser={onFetchUser}
        />
      )}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        message="AI Smart Recommendation is a premium feature."
      />
    </div>
  );
};

export default Dashboard;
