import { useState, useEffect } from "react";
import { getToken } from "../helpers";
import { onSnapshot, query, where, orderBy, collection } from 'firebase/firestore';
import { db } from "../firebase-config";

const Discussions = ({ currentUserEmail }) => {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const messagesRef = collection(db, 'messages');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const email = await currentUserEmail();
                console.log("Email de l'utilisateur actuel dans Discussions:", email);

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
                    const userConversations = data.data.map(conversation => ({
                        correspondents: conversation.attributes.between.data.map(data => data.attributes.email),
                        room: conversation.attributes.room,
                    })).filter(conversation => conversation.correspondents.includes(email));

                    setConversations(userConversations);

                    // Récupération des messages pour chaque conversation
                    userConversations.forEach((conversation) => {
                        const queryMessages = query(messagesRef, where("room", "==", conversation.room), orderBy("createdAt"));
                        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
                            let conversationMessages = [];
                            snapshot.forEach((doc) => {
                                conversationMessages.push({ ...doc.data(), id: doc.id });
                            });
                            setMessages((prevMessages) => [...prevMessages, ...conversationMessages]);
                        });
                    });
                } else {
                    throw new Error("Erreur lors de la récupération des données de conversation");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentUserEmail]);

    return (
        <>
            {loading && <p>Chargement en cours...</p>}
            {!loading && conversations.length === 0 && <p>Aucune conversation en cours.</p>}
            {!loading && conversations.length > 0 && (
                <div>
                    <h2>Conversations en cours :</h2>
                    {conversations.map((conversation) => (
                        <div key={conversation.room}>
                            <h3>Correspondant(s) : {conversation.correspondents.join(', ')}</h3>
                            {messages
                                .filter((message) => message.room === conversation.room)
                                .map((message) => (
                                    <p key={message.id}>{message.text}</p>
                                ))}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default Discussions;
