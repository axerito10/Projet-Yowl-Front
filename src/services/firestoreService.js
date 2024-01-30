// firestoreService.js
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { firestore } from './firebase.js';

// Créer une nouvelle conversation
const createConversation = async (participants) => {
  const conversationRef = await addDoc(collection(firestore, 'conversations'), {
    participants,
  });

  return conversationRef.id;
};

// Ajouter un message à une conversation existante
const addMessageToConversation = async (conversationId, senderId, text) => {
  const messagesRef = collection(firestore, `conversations/${conversationId}/messages`);

  await addDoc(messagesRef, {
    senderId,
    text,
    timestamp: serverTimestamp(),
  });

  // Vous pouvez également mettre à jour la dernière heure de modification de la conversation
  const conversationDocRef = doc(firestore, 'conversations', conversationId);
  await updateDoc(conversationDocRef, {
    lastModified: serverTimestamp(),
  });
};

export { createConversation, addMessageToConversation };
