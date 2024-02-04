import { useEffect, useState } from "react";
import { getUserId, getToken } from '../helpers';
import { v4 as uuidv4 } from 'uuid';
import SearchBarUsers from '../components/SearchBarUsers.jsx';
import Navbar from '../components/Navbar.jsx';
import Header from '../components/Header.jsx';
import ConversationPopup from '../components/ConversationPopup.jsx';

const Messagerie = () => {
    const [channelDiscussion, setChannelDiscussion] = useState("test");
    const [conversationList, setConversationList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const handleUserClick = async (userId, existingRoom) => {
        try {
            const currentUserEmail = await getCurrentUserEmail();
            const clickedUserEmail = await getUserEmail(userId);

            console.log(currentUserEmail, clickedUserEmail);

            // Recherche de la conversation existante entre l'utilisateur actuel et l'utilisateur sélectionné
            const existingConversation = conversationList.find(participants =>
                participants.emails.includes(currentUserEmail) && participants.emails.includes(clickedUserEmail)
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

            // Do something with the user ID, for example, open a chat window
            console.log(`User clicked with ID: ${userId}`);
        } catch (error) {
            console.error("Erreur lors de la gestion du clic sur l'utilisateur", error);
        }
    };

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

    const generateUniqueRoom = (userId) => {
        const uniqueId = uuidv4();
        const uniqueRoom = `${uniqueId}-${userId}`;
        return uniqueRoom;
    };

    const handleSearch = (data) => {
        setSearchResults(data);
    };

    const handleClosePopup = () => {
        setSelectedRoom(null);
    };

    useEffect(() => {
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
                    console.log("Liste des conversations existantes : ", data.data)
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

        fetchUserData();
    }, []);

    return (
        <div className='font-Avenir'>
            <Header />
            <h1 className="text-3xl text-black">MES MESSAGES</h1>
            <SearchBarUsers onSearch={handleSearch} onUserClick={handleUserClick} />
            
            {selectedRoom && (
                <ConversationPopup room={selectedRoom} onClose={handleClosePopup} />
            )}

            <Navbar />
        </div>
    );
};

export default Messagerie;
