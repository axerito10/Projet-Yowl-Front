import React, { useEffect, useState, useRef } from "react";
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase-config';

const ConversationPopup = ({ room, onClose }) => {
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const messageBodyRef = useRef(null);

    const messagesRef = collection(db, "messages");

    useEffect(() => {
        const queryMessages = query(messagesRef, where("room", "==", room), orderBy("createdAt"));
        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
                messages.push({ ...doc.data(), id: doc.id });
            });
            setMessages(messages);
        });

        return () => unsubscribe();
    }, [room]);

    useEffect(() => {
        // Défilement vers le bas une fois que les messages ont été mis à jour
        if (messageBodyRef.current) {
            messageBodyRef.current.scrollTop = messageBodyRef.current.scrollHeight - messageBodyRef.current.clientHeight;
        }
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (newMessage === "") return;

        await addDoc(messagesRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser.email,
            room: room,
        });

        setNewMessage("");
    };

    return (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 sm:w-80 bg-white rounded-md shadow-lg max-h-[80vh]">
            <div className="popup-inner">
                <button onClick={onClose}>Fermer</button>
                <div ref={messageBodyRef} id="messageBody" className="flex-grow overflow-y-auto p-4 max-h-[60vh]">
                    {messages.map((message) => (
                        <div key={message.id} className="mb-4">
                            <div className="bg-blue-500 text-white p-2 rounded-md max-w-xs">
                                {message.text}
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="p-4">
                    <input
                        className="p-2 border border-gray-300 rounded-md mr-2"
                        placeholder="Écrivez votre message ici ..."
                        onChange={(e) => setNewMessage(e.target.value)}
                        value={newMessage}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded-md"
                    >
                        ENVOYER
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ConversationPopup;
