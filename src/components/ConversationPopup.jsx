import React, { useEffect, useState, useRef } from "react";
import { addDoc, collection, serverTimestamp, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import { FiSend } from "react-icons/fi";
import { CiCirclePlus } from "react-icons/ci";
import { IoClose } from "react-icons/io5";

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
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:w-1/2 w-full bg-white rounded-lg shadow-xl max-h-[80vh] p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Messages</h2>
                <button onClick={onClose} className="bg-custom-orange text-custom-blue p-2 rounded-full hover:bg-custom-yellow transition duration-150 ease-in-out">
                    <IoClose />
                </button>
            </div>
            <div ref={messageBodyRef} id="messageBody" className="flex-grow overflow-y-auto p-2 max-h-[60vh] space-y-4">
            {messages.map((message) => {
                console.log("Message:", message.user);
                return (
                    <div key={message.id} className={`flex ${message.user === auth.currentUser.email ? 'justify-end' : 'justify-start'}`}>
                        <div className={`${message.user === auth.currentUser.email ? 'bg-custom-yellow' : 'bg-custom-profile-gray'} text-custom-blue p-2 rounded-md max-w-xs`}>
                            {message.text}
                        </div>
                    </div>
                );
            })}
            </div>
            <form onSubmit={handleSubmit} className="mt-4 flex">
                <label className="text-2xl text-custom-profile-gray p-3 rounded-md cursor-pointer transition duration-150 ease-in-out">
                    <input type="file" accept="image/*" style={{ display: 'none' }} />
                    <CiCirclePlus />
                </label>
                <input
                    className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Écrivez votre message ici ..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                />
                <button type="submit" className="bg-custom-orange text-custom-blue p-2 rounded-r-md hover:bg-custom-yellow transition duration-150 ease-in-out">
                    <FiSend />
                </button>
            </form>
        </div>
    );
};

export default ConversationPopup;
