import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../Pages/Style/WelcomePage.css';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getToken } from '../helpers';

const HomePage = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetch('http://localhost:1337/api/groupes?populate=*', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const transformedGroups = data.data.map(item => {
        const imageUrl = item.attributes.image?.data?.attributes?.url
          ? `http://localhost:1337${item.attributes.image.data.attributes.url}`
          : null;

        return {
          id: item.id,
          ...item.attributes,
          ImageUrl: imageUrl,
        };
      });
      setGroups(transformedGroups);
    })
    .catch((error) => {
      console.error('Error fetching data: ', error);
    });
  }, []);  

  // Paramètres de configuration pour react-slick
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

return (
    <>
      <header className="bg-white flex justify-between items-center p-4">
        {/* Logo SKILLS à gauche */}
        <div className="flex items-center">
          <img
            className="h-11 align-middle ml-24" 
            src="https://cdn.discordapp.com/attachments/1182732629573910569/1196830881592131677/Logo_2_Skills.png"
            alt="Skills logo"
          />
          <span className="text-6xl font-bold text-custom-blue">KILLS</span>
        </div>


        {/* Avatar de profil à droite */}
        <div className="flex items-center mr-24">
          <img
            src='../public/no-profil-picture.png' 
            alt="Profile"
            className="w-20 border-gray-300 mr-13"
          />
        </div>
      </header>

      <section className="container mx-auto px-4 my-8">
        <h2 className="text-2xl font-bold mb-4 text-custom-blue">LES PLUS POPULAIRES</h2>
        <Slider {...settings}>
        {groups.map((group) => (
          <Link to={`/group/${group.id}`} key={group.id}>
          <div key={group.id} className="group card relative p-5 transition-transform duration-300 hover:scale-105">
            <img 
              src={group.ImageUrl} 
              alt={group.Titre} 
              className="w-full h-40 object-cover rounded-lg transition duration-300 ease-in-out group-hover:opacity-50" 
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
              <span className="text-custom-blue text-xl font-bold">{group.Titre}</span>
            </div>
          </div>
          </Link>
        ))}
        </Slider>
      </section>
      <section className="container mx-auto px-4 my-8">
      <h2 className="text-2xl font-bold mb-4">VOS GROUPES</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => (
          <div key={group.id} className="group card relative mx-4 transition-transform duration-300 hover:scale-105">
            <img 
              src={group.ImageUrl} 
              alt={group.Titre} 
              className="w-full h-40 object-cover rounded-lg transition duration-300 ease-in-out group-hover:opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out">
              <span className="text-custom-blue text-xl font-bold">{group.Titre}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
    <Navbar />
  </>
);
};

export default HomePage;