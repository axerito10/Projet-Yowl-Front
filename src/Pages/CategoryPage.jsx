import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getToken } from '../helpers';

const CategoryPage = () => {
  const [groups, setGroups] = useState([]);
  const { categoryName } = useParams();

  useEffect(() => {
    fetch('http://localhost:1337/api/groupes?populate=categories,image', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      const allGroups = data.data.map(item => {
        const imageUrl = item.attributes.image?.data?.attributes?.url
          ? `http://localhost:1337${item.attributes.image.data.attributes.url}`
          : null;

        const groupCategories = item.attributes.categories?.data?.map(c => c.attributes.category) || [];
        const isCategoryMatch = groupCategories.includes(categoryName);

        return {
          id: item.id,
          ...item.attributes,
          imageUrl, // Assurez-vous que cette propriété est utilisée pour l'image
          isCategoryMatch,
        };
      });

      const filteredGroups = allGroups.filter(group => group.isCategoryMatch);
      setGroups(filteredGroups);
    })
    .catch(error => {
      console.error('Error fetching data: ', error);
    });
  }, [categoryName]);

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
    <div className="container mx-auto px-4 my-8">
      <h2 className="text-2xl font-bold my-4 text-custom-blue">Groupes dans la catégorie : {categoryName}</h2>
      <div className="grid grid-cols-3 gap-4">
        {groups.map(group => (
          <div key={group.id} className="rounded-lg shadow-lg overflow-hidden">
            <Link to={`/group/${group.id}`}>
              <img 
                src={group.imageUrl}
                alt={group.Titre}
                className="w-full h-40 object-cover transition duration-300 ease-in-out group-hover:opacity-50"
              />
              <div className="p-4">
                <h3 className="font-bold text-center">{group.Titre}</h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
    <Navbar />
    </>
  );
};

export default CategoryPage;


