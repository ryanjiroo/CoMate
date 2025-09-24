import React, { useEffect, useState } from "react";
import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";

// ===== React Icons (Bootstrap style) =====
import { BiListCheck, BiBot, BiLogOut, BiEdit } from "react-icons/bi";

const Dashboard = ({ onLogout, children, user, onPageChange, currentPage }) => {
  const [avatarSvg, setAvatarSvg] = useState("");

  useEffect(() => {
    if (user && user.email) {
      const avatar = createAvatar(avataaars, {
        seed: user.email,
        backgroundColor: ["b6e3f4", "c0aede", "d1d4f9"],
      });

      // === Bagian ini yang diperbaiki ===
      const dataUri = avatar.toDataUri(); // Gunakan toDataUri()
      setAvatarSvg(dataUri);
      // ==================================
    }
  }, [user]);

  const handleNavClick = (e, page) => {
    e.preventDefault();
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const activeLinkClass = "bg-white/10 rounded-lg";
  const linkClass = "flex items-center font-[Poppins] text-[#DDF4E7] hover:text-white transition-colors duration-200 p-2";

  return (
    <div
      className="flex min-h-screen font-sans"
      style={{ background: "linear-gradient(to right, #26667F, #124170)" }}
    >
      <aside className="w-64 p-6 flex flex-col justify-between">
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
                  <BiBot className="mr-3 text-2xl" />
                  Chatbot
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
      
      <div className="flex-1 flex p-6 pr-12">
        <main className="flex-1 bg-[#F4F7F7] rounded-l-3xl p-8 shadow-lg">
          {children}
        </main>

        <div className="w-80 p-6 flex flex-col items-center text-white rounded-r-3xl bg-[#F4F7F7]/30">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-white">
            {avatarSvg && <img src={avatarSvg} alt="User Avatar" />}
          </div>
          <h2 className="text-2xl font-bold mb-1">
            {user?.username || "Guest"}
          </h2>
          <p className="text-sm text-gray-200 mb-6">
            {user?.email || "N/A"}
          </p>
          <button className="flex items-center text-white opacity-80 hover:opacity-100 transition-opacity">
            <BiEdit className="mr-2 text-xl" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;