import { useEffect, useState } from "react";
import { getUserId, getToken } from '../helpers';
import { v4 as uuidv4 } from 'uuid';
import SearchBarUsers from '../components/SearchBarUsers.jsx';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';
import ConversationPopup from '../components/ConversationPopup.jsx';
import Discussions from '../components/Discussions.jsx'

const Messagerie = () => {
    const [channelDiscussion, setChannelDiscussion] = useState("");
    const [conversationList, setConversationList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);

    const fetchData = async () => {
        try {
            // Récupération de l'ID de l'utilisateur
            const userResponse = await fetch(
                `http://localhost:1337/api/users/me?populate=*`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            );

            if (userResponse.ok) {
                const userData = await userResponse.json();
                setCurrentUserId(userData.id);
            } else {
                throw new Error("Erreur lors de la récupération des données utilisateurs");
            }

            // Récupération de la liste des conversations
            const conversationsResponse = await fetch(
                `http://localhost:1337/api/messageries?populate=*`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            );

            if (conversationsResponse.ok) {
                const conversationsData = await conversationsResponse.json();
                setConversationList(
                    conversationsData.data.map(conversation => ({
                        emails: conversation.attributes.between.data.map(data => data.attributes.email),
                        room: conversation.attributes.room,
                    }))
                );
            } else {
                throw new Error("Erreur lors de la récupération des données de conversation");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données", error);
        } finally {
            setLoading(false);
        }
    };

    // Récupération ID de l'utilisateur et liste des conversations au chargement initial
    useEffect(() => {
        fetchData();
    }, []);

    // Gestion du clic
    const handleUserClick = async (userId, existingRoom) => {
        try {
            const currentUserEmail = await getCurrentUserEmail();
            const clickedUserEmail = await getUserEmail(userId);

            console.log(currentUserEmail, clickedUserEmail);

            // Recherche de la conversation existante entre l'utilisateur actuel et l'utilisateur sélectionné
            const existingConversation = conversationList.find(participants =>
                participants.emails.length === 2 &&
                participants.emails.includes(currentUserEmail) &&
                participants.emails.includes(clickedUserEmail)
            );

            if (!existingConversation) {
                // Si la conversation n'existe pas, créez une nouvelle entrée
                const newRoom = generateUniqueRoom(userId);
                await createNewConversation(userId, getUserId(), newRoom);
                console.log(`Nouvelle conversation créée avec la salle : ${newRoom}`);
                setSelectedRoom(newRoom);
            } else {
                // Si la conversation existe, récupérez la salle existante
                console.log("Existing room : ", existingConversation);
                const existingRoom = existingConversation?.room;
                console.log(`Conversation existante avec la salle : ${existingRoom}`);
                setSelectedRoom(existingRoom);
            }

            // Récupération de la liste des conversations existantes après chaque clic
            fetchData();
        } catch (error) {
            console.error("Erreur lors de la gestion du clic sur l'utilisateur", error);
        }
    };

    // Récupérer l'email de l'utilisateur
    const getCurrentUserEmail = async () => {
        try {
            const response = await fetch(
                `http://localhost:1337/api/users/me`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            );
    
            if (response.ok) {
                const data = await response.json();
                console.log("utilisateur actuel : ", data.email)
                return data.email;
            } else {
                throw new Error(
                    "Erreur lors de la récupération des données de l'utilisateur"
                );
            }
        } catch (error) {
            console.error(
                "Erreur lors de la récupération des données de l'utilisateur",
                error
            );
        }
    };

    // Récupérer l'email de l'utilisateur sur lequel on clic
    const getUserEmail = async (userId) => {
        try {
            const response = await fetch(
                `http://localhost:1337/api/users/${userId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            );
    
            if (response.ok) {
                const data = await response.json();
                console.log("utilisateur cliqué : ", data.email)
                return data.email;
            } else {
                throw new Error(
                    "Erreur lors de la récupération des données de l'utilisateur"
                );
            }
        } catch (error) {
            console.error(
                "Erreur lors de la récupération des données de l'utilisateur",
                error
            );
        }
    };

    // Créer une nouvelle conversation
    const createNewConversation = async (currentUserId, userId, newRoom) => {
        try {
            const postData = {
                "data": {
                    "room": newRoom,
                    "between": {
                        "connect": [currentUserId, userId],
                    },
                }
            }

            const response = await fetch('http://localhost:1337/api/messageries?populate=*', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(postData),
            });

            if (response.ok) {
                const strapiData = await response.json();
                console.log('Données soumises avec succès sur Strapi:', strapiData);
            } else {
                throw new Error("Erreur lors de la création d'une nouvelle conversation sur Strapi");
            }
        } catch (error) {
            console.error("Erreur lors de la création d'une nouvelle conversation sur Strapi", error);
        }
    }

    // Générer un uuid pour la room 
    const generateUniqueRoom = (userId) => {
        const uniqueId = uuidv4();
        const uniqueRoom = `${uniqueId}-${userId}`;
        return uniqueRoom;
    };

    // Rechercher
    const handleSearch = (data) => {
        setSearchResults(data);
    };

    // Fermer
    const handleClosePopup = () => {
        setSelectedRoom(null);
    };

    // Récupération de la liste des conversations existantes
    const fetchUserData = async () => {
        try {
            const response = await fetch(
                `http://localhost:1337/api/messageries?populate=*`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setConversationList(
                    data.data.map(conversation => ({
                        emails: conversation.attributes.between.data.map(data => data.attributes.email),
                        room: conversation.attributes.room,
                    }))
                )
            } else {
                throw new Error(
                    "Erreur lors de la récupération des données utilisateurs"
                );
            }
        } catch (error) {
            console.error(
                "Erreur lors de la récupération des données utilisateurs",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    

    return (
        <div className="font-Avenir min-h-screen flex flex-col">
            <Header />
            <div className="mx-auto max-w-4xl py-6 p-3">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">MES MESSAGES</h1>
            </div>
            <div className="mx-auto p-3">
                <SearchBarUsers
                    onSearch={handleSearch}
                    onUserClick={handleUserClick}
                    currentUserId={currentUserId}
                />
            </div>
            <div>
                <Discussions currentUserEmail={getCurrentUserEmail} onUserClick={handleUserClick}/>
            </div>
            {selectedRoom && (
                <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
                    <ConversationPopup room={selectedRoom} onClose={handleClosePopup} />
                </div>
            )}
 
            <Navbar />
        </div>
    );
};

export default Messagerie;
