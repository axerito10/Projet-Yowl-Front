import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { logout, getToken } from '../helpers';
import { BsPencilSquare, BsPersonGear } from "react-icons/bs";
import defaultImage from '../../public/no-profil-picture.png';

const Profil = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [groupBanners, setGroupBanners] = useState([]);

    const navigate = useNavigate();

    // Fonction pour le bouton de déconnexion
    const handleLogout = () => {
        logout();
        // Mettez à jour l'état de connexion ici si nécessaire
        navigate('/');
    };

    // Fonction de récupération des données utilisateur
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

                    // Récupérer les bannières des groupes
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
                            return groupeData.data.attributes.Banniere;
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
        <div className="bg-cover bg-center h-screen font-Avenir" style={{ backgroundImage: "url('../../public/background-profil-page.jpg')" }}>
            <div className="container mx-auto p-4">
                <div className='absolute top-4 right-10'>
                    <Link to="/editprofile" className='text-custom-orange text-4xl'><BsPersonGear /></Link>
                </div>
                <img className="rounded-full h-32 w-32 mx-auto mb-4" src={"http://localhost:1337" + userData.Photo.url} alt="Photo de profil" />
                <h1 className='text-2xl font-bold text-center mb-2'>Bonjour <span className='text-custom-orange'>{userData.username}</span></h1>
                <div className='text-center mb-4 md:w-2/12 mx-auto'>
                    <h2 className='text-custom-profile-gray mb-1'>Votre adresse mail :</h2>
                    <p className='text-custom-blue border-custom-gray border-b-2 mb-4'>{userData.email}</p>
                    <h2 className='text-custom-profile-gray mb-1'>Votre numéro de téléphone:</h2>
                    <p className='text-custom-blue border-custom-gray border-b-2 mb-4'>+33 {userData.telephone}</p>
                </div>
                <h1 className='text-xl font-bold text-custom-profile-gray mb-2 text-center'>Vos groupes</h1>

                {/* Affichage des bannières, titres et descriptions des groupes créés par l'utilisateur*/}
                {groupBanners.map((banniere, index) => (
                    <div key={index} className="mb-4 relative w-2/3 mx-auto">
                        {banniere ? (
                            <img className='w-full z-1 h-auto mb-2 rounded-xl' src={"http://localhost:1337" + banniere.data.attributes.url} alt={`Bannière du groupe ${userData.mesGroupes[index].Titre}`} />
                        ) : (
                            <p className="text-center">Aucune bannière disponible pour le groupe {userData.mesGroupes[index].Titre}</p>
                        )}
                        <div className="z-4 absolute bottom-0 left-0 w-full h-full flex flex-col justify-end p-4 text-white">
                            <h2 className="text-xs md:text-xl z-4 font-black mb-2">{userData.mesGroupes[index].Titre}</h2>
                            <p className='text-xs z-4'>{userData.mesGroupes[index].Description}</p>
                        </div>

                        <div className="absolute top-4 right-4">
                            <Link to={`/modificategroupe/${userData.mesGroupes[index].id}`} className="bg-custom-orange hover:bg-custom-hoverorange text-custom-blue p-2 rounded-full w-10 h-10 flex items-center justify-center">
                                <BsPencilSquare className="text-white cursor-pointer" />
                            </Link>
                        </div>
                    </div>
                ))}
                <div className='mx-auto text-center'>
                    <Link to="/creategroupe" className="bg-custom-orange hover:bg-custom-hoverorange text-custom-blue mr-4 p-2 rounded-3xl w-full text-center">CRÉER UN GROUPE</Link>
                </div>
            </div>
        </div>
    );
};

export default Profil;
