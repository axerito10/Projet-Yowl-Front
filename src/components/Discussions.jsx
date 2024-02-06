import React, { useState, useEffect, useCallback } from "react";
import { getToken } from "../helpers";
import {
  onSnapshot,
  query,
  where,
  orderBy,
  collection,
} from "firebase/firestore";
import { db } from "../firebase-config";
import ConversationPopup from "./ConversationPopup"; 

const Discussions = ({ currentUserEmail }) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popupRoom, setPopupRoom] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  const fetchMessagesForConversation = useCallback((conversation) => {
    const queryMessages = query(
      collection(db, "messages"),
      where("room", "==", conversation.room),
      orderBy("createdAt")
    );
    return onSnapshot(queryMessages, (snapshot) => {
      let conversationMessages = [];
      snapshot.forEach((doc) => {
        const messageData = { ...doc.data(), id: doc.id };
        conversationMessages.push(messageData);
      });

      setMessages((prevMessages) => ({
        ...prevMessages,
        [conversation.room]: conversationMessages,
      }));
    });
  }, []);

  
  useEffect(() => {
    const initUserEmail = async () => {
      try {
        const email = await currentUserEmail();
        setUserEmail(email);
      } catch (error) {
        console.error("Erreur lors de la récupération du courriel de l'utilisateur", error);
      }
    };

    initUserEmail();
  }, [currentUserEmail]);

  useEffect(() => {
    if (!userEmail) return;

    const fetchData = async () => {
      setLoading(true);
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
          const userConversations = data.data.map((conversation) => ({
            correspondents: conversation.attributes.between.data
              .map((data) => data.attributes.email)
              .filter((email) => email !== userEmail),
            room: conversation.attributes.room,
          })).filter((conversation) => conversation.correspondents.length > 0);

          setConversations(userConversations);

          userConversations.forEach((conversation) => {
            const unsubscribe = fetchMessagesForConversation(conversation);
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
  }, [userEmail, fetchMessagesForConversation]);

  const handleConversationClick = useCallback((room) => {
    setPopupRoom(room);
    setSelectedConversation(room);
  }, []);

  const closePopup = () => {
    setPopupRoom(null);
  };

  const renderConversationsList = () => {
    return conversations.map((conversation) => (
      <div
        key={conversation.room}
        className={`cursor-pointer p-2 rounded-md hover:bg-gray-100 ${
          selectedConversation === conversation.room ? "bg-gray-100" : ""
        }`}
        onClick={() => handleConversationClick(conversation.room)}
      >
        <h4 className="font-medium">
          {conversation.correspondents.filter((email) => email !== userEmail).join(", ")}
        </h4>
        {messages[conversation.room]?.length > 0 && (
          <p className="text-gray-500">
            Dernier message: {messages[conversation.room][messages[conversation.room].length - 1].text}
          </p>
        )}
      </div>
    ));
  };


  return (
    <div className="flex justify-center items-center max-h-screen">
      <div className="w-full max-w-md"> 
        {loading && <p className="text-center">Chargement en cours...</p>}
        {!loading && conversations.length === 0 && <p className="text-center">Aucune conversation en cours.</p>}
        {!loading && conversations.length > 0 && (
          <div className="overflow-hidden rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Conversations en cours :</h2>
            <div className="space-y-2">{renderConversationsList()}</div> 
          </div>
        )}
        {popupRoom && <ConversationPopup room={popupRoom} onClose={closePopup} />}
      </div>
    </div>
  );
};

export default Discussions;
