import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getToken, getUserId } from '../helpers.js';
import Navbar from '../components/Navbar';
import Header from '../components/Header.jsx'

const Favoris = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [groupFavorites, setGroupFavorites] = useState([]);
    const [loadingBanners, setLoadingBanners] = useState(true);

    const removeFavorite = async (groupId) => {
        try {
            const raw = {
                "data": {
                    "groupeFavoris": {
                        "disconnect": [groupId],
                    }
                }
            };
            const response = await fetch(`http://localhost:1337/api/privates/${getUserId()}?populate=*`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(raw),
            });

            if (response.ok) {
                console.log(`Suppression de l'article avec l'ID ${groupId} réussie.`);
            } else {
                throw new Error(`Erreur lors de la suppression du groupe des favoris`);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du groupe des favoris', error);
            setError('Erreur lors de la suppression du groupe des favoris');
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:1337/api/privates/${getUserId()}?populate=*`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
                    },
                });
        
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data.data.attributes.groupeFavoris.data);
        
                    if (data && data.data && data.data.attributes && data.data.attributes.groupeFavoris.data) {
                        const banners = await Promise.all(data.data.attributes.groupeFavoris.data.map(async (groupe) => {
                            try {
                                const groupeResponse = await fetch(`http://localhost:1337/api/groupes/${groupe.id}?populate=*`, {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${getToken()}`,
                                    },
                                });
        
                                if (groupeResponse.ok) {
                                    const groupeData = await groupeResponse.json();
                                    const groupID = groupe.id
                                    return { ...groupeData.data.attributes, groupID };
                                } else {
                                    console.error(`Erreur lors de la récupération du favori ${groupe.id}`);
                                    // Ajouter une URL de bannière par défaut ici
                                    return { data: { attributes: { url: '/default-banner.jpg' } } };
                                }
                            } catch (error) {
                                console.error(error);
                                throw new Error('Erreur lors de la récupération des bannières');
                            }
                        }));
        
                        setGroupFavorites(banners);
                    }
                } else {
                    throw new Error('Erreur lors de la récupération des données de l\'utilisateur');
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des données de l\'utilisateur', error);
                setError('Erreur lors de la récupération des données de l\'utilisateur');
            } finally {
                setLoading(false);
                setLoadingBanners(false);
            }
        };
    
        fetchUserData();
    }, []);
    

    if (loading || loadingBanners) {
        return <p className="text-center mt-4">Chargement en cours...</p>;
    }

    if (error) {
        return <p className="text-center mt-4">Erreur : {error}</p>;
    }

    return (
        <>
            <Header />
            <h2 className='text-xl font-bold text-gray-800 mb-4'>Vos favoris</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
                {groupFavorites.map((favorite, groupID) => (
                    <div key={groupID} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                        {favorite.image.data && favorite.image.data.attributes.url ? (
                            <img
                                className='w-full h-40 object-cover'
                                src={"http://localhost:1337" + favorite.image.data.attributes.url}
                                alt={`Bannière du groupe ${favorite.Titre || 'Sans titre'}`}
                            />
                        ) : (
                            <div className="w-full h-40 bg-gray-200 flex items-center justify-center">Aucune bannière</div>
                        )}
                        <div className="p-4">
                            {favorite ? (
                                <>
                                    <h3 className="text-lg font-bold mb-2">{favorite.Titre}</h3>
                                    <p className='text-sm text-gray-600'>{favorite.Description}</p>
                                    <button
                                        onClick={() => removeFavorite(favorite.groupID)}
                                        className="text-red-500 hover:text-red-600 inline-block mt-2"
                                    >
                                        Retirer des favoris
                                    </button>
                                </>
                            ) : (
                                <p className='text-sm text-gray-600'>Aucune information sur le groupe</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <Navbar />
        </>
    );
};

export default Favoris;
