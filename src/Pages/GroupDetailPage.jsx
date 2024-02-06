import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import Navbar from '../components/Navbar';
import { getToken } from '../helpers';
import Header from '../components/Header';

const GroupDetailPage = () => {
  const [group, setGroup] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:1337/api/groupes/${id}?populate=*`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    })
    .then((response) => response.json())
    .then((data) => {
      const groupData = data.data;

      setGroup({
        ...groupData.attributes,
        Proprietaire: groupData.attributes.Proprietaire,
        category: groupData.attributes.categories.data[0]?.attributes.category,
        ImageUrl: groupData.attributes.image?.data?.attributes?.url
          ? `http://localhost:1337${groupData.attributes.image.data.attributes.url}`
          : null,
        Titre_contenu: groupData.attributes.chapitres.data.map(chapitre => chapitre.attributes.titre),
        Description_contenu: groupData.attributes.chapitres.data.map(chapitre => chapitre.attributes.description),
      });
    })
    .catch((error) => {
      console.error('Error fetching group details: ', error);
    });
  }, [id]);

  const handleCategoryClick = () => {
    navigate(`/categorie/${group.category}`);
  };

  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  if (!group) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className="flex items-center justify-between mx-auto px-4 py-4 mr-24">
        <div className="flex items-center ml-24">
          <button 
            onClick={() => navigate(-1)} 
            className="text-white text-2xl bg-custom-blue rounded-full p-2"
          >
            <IoIosArrowBack />
          </button>

          {group.category && (
            <button
              onClick={handleCategoryClick}
              className="ml-4 text-custom-orange bg-custom-blue rounded-full py-1 px-3 text-lg"
            >
              {group.category}
            </button>
          )}
        </div>

        {group.Proprietaire && (
          <button
            className="text-custom-orange bg-custom-blue rounded-full py-1 px-3 text-lg"
          >
            {group.Proprietaire}
          </button>
        )}
      </div>

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
          <span className="mr-2 text-custom-orange">{group.Titre_contenu}</span>
          <span className={`text-custom-yellow transform transition-transform ${showDescription ? 'rotate-90' : 'rotate-0'}`}>
            &#9656;
          </span>
        </button>
        {showDescription && (
          <div className="mt-4 p-4 border rounded-lg">
            {group.Description_contenu.map((description, index) => (
              <div key={index}>{description}</div>
            ))}
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

        <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-80 rounded-lg"></div>

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
