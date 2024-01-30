import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { firestore } from '../services/firebase.js';
import { createConversation, addMessageToConversation } from '../services/firestoreService';
import { useAuth } from '../services/AuthContext.jsx';
import { query, collection, getDocs, where } from 'firebase/firestore';// Ajout des imports pour Firestore

const Messagerie = () => {
  const [users, setUsers] = useState([
    { id: 'user1', email: 'user1@example.com' },
    { id: 'user2', email: 'user2@example.com' },
    // ... ajoutez d'autres utilisateurs au besoin
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const handleSearch = () => {
      try {
        console.log('Users:', users);
        console.log('Search Term:', searchTerm);

        const filteredUsers = users.filter((user) =>
          user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filteredUsers);
      } catch (error) {
        console.error('Erreur lors de la recherche des utilisateurs:', error);
      }
    };

    handleSearch();
  }, [searchTerm, users]);

  const handleStartConversation = async (otherUserId) => {
    try {
      // Vérifiez si une conversation existe déjà entre les deux utilisateurs
      console.log('Current User:', currentUser);
  
      if (!currentUser || !currentUser.uid) {
        console.error('Erreur: currentUser ou currentUser.uid est undefined.');
        return;
      }
  
      console.log('Current User UID:', currentUser.uid);
  
      const existingConversationQuery = query(
        collection(firestore, 'conversations'),
        where('participants', 'array-contains', currentUser.uid),
        where('participants', 'array-contains', otherUserId)
      );
  
      const existingConversationSnapshot = await getDocs(existingConversationQuery);
  
      if (!existingConversationSnapshot.empty) {
        // Si une conversation existe, redirigez vers la page de la conversation
        const conversationId = existingConversationSnapshot.docs[0].id;
        console.log('Rediriger vers la conversation existante avec l\'ID :', conversationId);
      } else {
        // Sinon, créez une nouvelle conversation
        const newConversationId = await createConversation([currentUser.uid, otherUserId]);
        console.log('Nouvelle conversation créée avec l\'ID :', newConversationId);
  
        // Ajoutez un message initial à la nouvelle conversation
        const initialMessage = 'Bonjour, démarrons la conversation !';
        console.log("Adding initial message to the new conversation...");
        await addMessageToConversation(newConversationId, currentUser.uid, initialMessage);
      }
    } catch (error) {
      console.error('Erreur lors du démarrage de la conversation:', error);
    }
  };
  
  

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Barre de recherche */}
      <div className="bg-white p-4 shadow-md">
        <input
          type="text"
          placeholder="Rechercher des utilisateurs..."
          className="w-full p-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Liste des conversations */}
      <div className="flex-1 p-4 overflow-y-auto">
        {searchTerm === '' ? (
          <p className="text-gray-500">Liste de toutes les conversations ici</p>
        ) : (
          <p className="text-gray-500">Résultats de recherche ici</p>
        )}

        {/* Afficher la liste des conversations ou des résultats de recherche ici */}
        {searchResults.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-2 border-b">
            <Link to={`/conversation/${user.id}`} className="text-blue-500 hover:underline">
              {user.email}
            </Link>
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded-md"
              onClick={() => handleStartConversation(user.id)}
            >
              Démarrer la conversation
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messagerie;
