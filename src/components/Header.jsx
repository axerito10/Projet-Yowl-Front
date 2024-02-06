import React, { useState, useEffect } from 'react';
import '../Pages/Style/WelcomePage.css'; 
import defaultImage from '../../public/no-profil-picture.png';
import { getToken } from "../helpers";



const Header = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupBanners, setGroupBanners] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const response = await fetch(`http://localhost:1337/api/users/me?populate=*`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUserData(data);

                const banners = await Promise.all(data.mesGroupes.map(async (groupe) => {
                    const groupeResponse = await fetch(`http://localhost:1337/api/groupes/${groupe.id}?populate=*`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${getToken()}`,
                        },
                    });

                    if (groupeResponse.ok) {
                        const groupeData = await groupeResponse.json();
                        return groupeData.data.attributes.image;
                    } else {
                        throw new Error(`Erreur lors de la récupération de la bannière du groupe ${groupe.id}`);
                    }
                }));

                setGroupBanners(banners);

            } else {
                throw new Error('Erreur lors de la récupération des données de l\'utilisateur');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des données de l\'utilisateur', error);
            setError('Erreur lors de la récupération des données de l\'utilisateur');
        } finally {
            setLoading(false);
        }
    };

    fetchUserData();
  }, []);

  // ...

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
        {userData ? (
          <img 
            className="rounded-full border-2 border-gray-300 h-20 w-20" 
            src={userData.Photo ? "http://localhost:1337" + userData.Photo.url : defaultImage} 
            alt="Photo de profil" 
          />
        ) : (
          // Afficher un indicateur de chargement ou un composant de remplacement pendant le chargement
          <div>Loading...</div>
        )}
      </div>
    </header>
  );
};

export default Header;
