import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SiScrollreveal } from "react-icons/si";
import { IoIosStarOutline } from "react-icons/io";
import { LuMessageSquare } from "react-icons/lu"; 
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const activeIconClass = "text-custom-orange text-2xl"; 
  const inactiveIconClass = "text-black text-2xl"; 

  return (
    <nav className="fixed bottom-0 inset-x-0 p-2 flex justify-center">
      <div className="flex justify-center items-center bg-white shadow-lg rounded-full border border-black w-full max-w-2xl">
        <Link to="/home" className={`flex-1 flex flex-col items-center justify-center py-2 font-semibold hover:text-custom-orange transition duration-300 ${isActive('/home') ? activeIconClass : inactiveIconClass}`}>
          <SiScrollreveal />
          <span className="hidden md:block text-sm">Accueil</span>
        </Link>
        <Link to="/favoris" className={`flex-1 flex flex-col items-center justify-center py-2 font-semibold hover:text-custom-orange transition duration-300 ${isActive('/favoris') ? activeIconClass : inactiveIconClass}`}>
          <IoIosStarOutline />
          <span className="hidden md:block text-sm">Favoris</span>
        </Link>
        <Link to="/messagerie" className={`flex-1 flex flex-col items-center justify-center py-2 font-semibold hover:text-custom-orange transition duration-300 ${isActive('/messagerie') ? activeIconClass : inactiveIconClass}`}>
          <LuMessageSquare />
          <span className="hidden md:block text-sm">Message</span>
        </Link>
        <Link to="/profil" className={`flex-1 flex flex-col items-center justify-center py-2 font-semibold hover:text-custom-orange transition duration-300 ${isActive('/profil') ? activeIconClass : inactiveIconClass}`}>
          <CgProfile />
          <span className="hidden md:block text-sm">Profil</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
