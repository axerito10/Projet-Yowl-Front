import { useEffect, useState } from "react"
import { addDoc, collection, serverTimestamp, onSnapshot, query, where } from 'firebase/firestore'
import { db, auth } from '../firebase-config'

const Messagerie = () => {
    const [newMessage, setNewMessage] = useState("")
    const [channelDiscussion, setChannelDiscussion] = useState("test") // AJOUTER LA DIFFÉRENCIATION EN DISCUSSION PRIVÉ PLUS TARD
    const [messages, setMessages] = useState([])

    const messagesRef = collection(db, "messages")

    useEffect(() => {
        const queryMessages = query(messagesRef, where("room", "==", channelDiscussion))
        const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
                messages.push({...doc.data(), id: doc.id});
            });
            setMessages(messages);
        });

        return () => unsuscribe();
    }, []);

    // Fonction d'envoie du message
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (newMessage === "") return;

        await addDoc(messagesRef, {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser.email,
            room: channelDiscussion,

        });

        setNewMessage("")
    };

    return (
        <>
            <div>{messages.map((message) => <h1>{message.text}</h1>)}</div>
            <form onSubmit={handleSubmit}>
                <input 
                    placeholder="Écrivez votre message ici ..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                />
                <button type="submit" >
                    ENVOYER
                </button>
            </form>
        </>
    )
}

export default Messagerie