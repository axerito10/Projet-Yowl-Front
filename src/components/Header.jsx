import React from 'react';
import '../Pages/Style/WelcomePage.css'; 

const Header = () => {
  return (
    <header className="bg-white flex justify-between items-center p-4">
      {/* Logo SKILLS à gauche */}
      <div className="flex items-center">
        <img
          className="h-11 mr-1 align-middle" 
          src="https://cdn.discordapp.com/attachments/1182732629573910569/1196830881592131677/Logo_2_Skills.png"
          alt="Skills logo"
        />
        <span className="text-6xl font-bold text-custom-blue">KILLS</span>
      </div>

      {/* Avatar de profil à droite */}
      <div className="flex items-center">
        <img
          src='../public/no-profil-picture.png' 
          alt="Profile"
          className="w-20 border-gray-300"
        />
      </div>
    </header>
  );
};

export default Header;
