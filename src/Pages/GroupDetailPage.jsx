import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import Navbar from '../components/Navbar';

const GroupDetailPage = () => {
  const [group, setGroup] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:1337/api/groupes/${id}?populate=*`)
      .then((response) => response.json())
      .then((data) => {
        const groupData = data.data;
        setGroup({
          ...groupData.attributes,
          Proprietaire: groupData.attributes.Proprietaire,
          category: groupData.attributes.categories.data[0]?.attributes.category, // Récupération de la catégorie
          ImageUrl: groupData.attributes.image?.data?.attributes?.url
            ? `http://localhost:1337${groupData.attributes.image.data.attributes.url}`
            : null,
          Titre_contenu: groupData.attributes.Titre_contenu,
          Description_contenu: groupData.attributes.Description_contenu,
        });
      })
      .catch((error) => {
        console.error('Error fetching group details: ', error);
      });
  }, [id]);

  const handleCategoryClick = () => {
    // Redirection vers la page des groupes de la même catégorie
    navigate(`/categorie/${group.category}`);
  };

  const toggleDescription = () => { // Définition de la fonction toggleDescription
    setShowDescription(!showDescription);
  };

  if (!group) {
    return <div>Loading...</div>;
  }

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
      <div className="flex items-center justify-between mx-auto px-4 py-4 mr-24">
        <div className="flex items-center ml-24">
          {/* Flèche de retour */}
          <button 
            onClick={() => navigate(-1)} 
            className="text-white text-2xl bg-custom-blue rounded-full p-2"
          >
            <IoIosArrowBack />
          </button>

          {/* Bouton de la catégorie */}
          {group.category && (
            <button
            onClick={handleCategoryClick}
              className="ml-4 text-custom-orange bg-custom-blue rounded-full py-1 px-3 text-lg"
            >
              {group.category}
            </button>
          )}
        </div>

        {/* Bouton du propriétaire déplacé à droite */}
        {group.Proprietaire && (
          <button
            className="text-custom-orange bg-custom-blue rounded-full py-1 px-3 text-lg"
          >
            {group.Proprietaire}
          </button>
        )}
      </div>

      {/* Image du groupe */}
      <div className="container mx-auto px-4 my-8">
        {group.ImageUrl && (
          <img 
            src={group.ImageUrl} 
            alt={group.Titre} 
            className="w-full h-40 object-cover rounded-lg" 
          />
        )}
      </div>
      <div className="container mx-auto px-4 my-8 text-custom-blue">
        <h2 className="text-2xl font-bold my-4">{group.Titre}</h2>
        <p>{group.Description}</p>
        </div>
        <div className="container mx-auto px-4 my-8 text-custom-blue">
        <h2 className="text-2xl font-bold mb-4 text-custom-blue">LES COURS</h2>
        <button
          className="flex items-center px-4 py-2 bg-custom-blue font-bold rounded-lg shadow-lg focus:outline-none "
          onClick={toggleDescription}
        >
          <span className="mr-2 text-custom-orange">{group.Titre_contenu}</span> {/* Ajout de la classe mr-2 pour la marge à droite */}
          <span className={`text-custom-yellow transform transition-transform ${showDescription ? 'rotate-90' : 'rotate-0'}`}>
            &#9656;
          </span>
        </button>
        {showDescription && (
          <div className="mt-4 p-4 border rounded-lg">
            {group.Description_contenu}
          </div>
        )}
      </div>
      <div className="relative container mx-auto px-4 my-8">
        {group.ImageUrl && (
          <img 
            src={group.ImageUrl} 
            alt={group.Titre} 
            className="w-1/4 h-40 object-cover rounded-lg mx-auto" 
          />
        )}

        {/* Div pour le filtre blanc transparent */}
        <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-80 rounded-lg"></div>

        {/* Bouton "REJOINDRE" centré */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <button className="bg-custom-orange text-custom-blue font-bold py-2 px-4 rounded-full">
            REJOINDRE
          </button>
        </div>
      </div>
      <Navbar />
    </>
  );
};

export default GroupDetailPage;