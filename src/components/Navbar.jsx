import React from 'react';
import { Link } from 'react-router-dom';
import { SiScrollreveal } from "react-icons/si";
import { IoMdStarOutline } from "react-icons/io";
import { LuMessageSquare } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              {/* Logo Menu */}
              <a href="#" className="flex items-center py-4 px-2">
                <SiScrollreveal />
              </a>
            </div>
            {/* Les éléments de la navbar ici */}
            <div className="hidden md:flex items-center space-x-1">
              <Link to="/" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300"><IoMdStarOutline /></Link>
              <Link to="/about" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300"><LuMessageSquare /></Link>
              <Link to="/contact" className="py-4 px-2 text-gray-500 font-semibold hover:text-green-500 transition duration-300"><CgProfile /></Link>
            </div>
          </div>
          {/* Les icônes de la navbar */}
          <div className="hidden md:flex items-center space-x-3 ">
            <a href="#" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">
              <IoMdStarOutline />
            </a>
            <a href="#" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">
              <LuMessageSquare />
            </a>
            <a href="#" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">
              <CgProfile />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
