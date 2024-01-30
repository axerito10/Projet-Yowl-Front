import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logout, getToken } from '../helpers';
import { BsPersonGear } from "react-icons/bs";
import { FaPowerOff } from "react-icons/fa6";
import defaultImage from '../../public/no-profil-picture.png';
import Navbar from '../components/Navbar';

const Profil = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [groupBanners, setGroupBanners] = useState([]);

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); 
    };

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

    if (loading) {
        return <p className="text-center mt-4">Chargement en cours...</p>;
    }

    if (error) {
        return <p className="text-center mt-4">Erreur : {error}</p>;
    }


    return (
        <div className="bg-white font-Avenir min-h-screen">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className='flex justify-between items-center mb-10'>
                    <img 
                        className="rounded-full border-2 border-gray-300 h-32 w-32" 
                        src={userData.Photo ? "http://localhost:1337" + userData.Photo.url : defaultImage} 
                        alt="Photo de profil" 
                    />
                    <div className="flex items-center">
                        <Link to="/editprofile" className='text-orange-500 text-2xl mr-4'>
                            <BsPersonGear />
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-orange-500 hover:bg-orange-600 transition duration-300"
                        >
                            <FaPowerOff />
                        </button>
                    </div>
                </div>
                
                <div className='bg-gray-100 p-4 rounded-lg shadow-md mb-6'>
                    <h1 className='text-2xl font-bold text-center mb-4 text-gray-800'>Bonjour, {userData.username}</h1>
                    <p className='text-gray-600 text-center'>Votre adresse mail : {userData.email}</p>
                    <p className='text-gray-600 text-center'>Votre numéro de téléphone : {userData.telephone ? `+33 ${userData.telephone}` : 'Non renseigné'}</p>
                </div>
                
                <h2 className='text-xl font-bold text-gray-800 mb-4'>Vos groupes</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
                    {groupBanners.map((banniere, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                            {banniere ? (
                                <img 
                                    className='w-full h-40 object-cover' 
                                    src={"http://localhost:1337" + banniere.data.attributes.url} 
                                    alt={`Bannière du groupe ${userData.mesGroupes[index].Titre}`} 
                                />
                            ) : (
                                <div className="w-full h-40 bg-gray-200 flex items-center justify-center">Aucune bannière</div>
                            )}
                            <div className="p-4">
                                <h3 className="text-lg font-bold mb-2">{userData.mesGroupes[index].Titre}</h3>
                                <p className='text-sm text-gray-600'>{userData.mesGroupes[index].Description}</p>
                                <Link to={`/modificategroupe/${userData.mesGroupes[index].id}`} className="text-orange-500 hover:text-orange-600 inline-block mt-2">
                                    Modifier le groupe
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
    
                <div className='text-center mb-6'>
                    <Link 
                        to="/creategroupe" 
                        className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-md transition duration-300"
                    >
                        CRÉER UN GROUPE
                    </Link>
                </div>
            </div>
            <Navbar />
        </div>
    );      
};
    
    export default Profil;