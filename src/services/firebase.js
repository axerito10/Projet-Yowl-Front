import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, push } from 'firebase/database';


// Initialiser l'application avec la configuration Firebase
const firebaseApp = initializeApp({
  apiKey: 'AIzaSyD0UiVOcmWZNLwtAz7xdkXzCJQQnkwYnUA',
  authDomain: 'skills-6f7df.firebaseapp.com',
  projectId: 'skills-6f7df',
  storageBucket: 'skills-6f7df.appspot.com',
  messagingSenderId: '240850456237',
  appId: '1:240850456237:web:81e2709c154b62ac648024',
  measurementId: 'G-CQXN63T5SN',
  databaseURL: 'https://skills-6f7df-default-rtdb.europe-west1.firebasedatabase.app',
});

const firestore = getFirestore(firebaseApp);


// Obtenez l'instance auth
const auth = getAuth(firebaseApp);

// Obtenez l'instance de la base de données (à adapter selon vos besoins)
const database = getDatabase(firebaseApp);
const messagesRef = ref(database, 'messages');

const listUsers = async () => {
  try {
    const listUsersResult = await auth.listUsers();
    return listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste des utilisateurs:', error);
    throw error;
  }
};

const sendMessage = async (senderUid, receiverUid, text) => {
  try {
    const message = {
      senderUid,
      receiverUid,
      text,
      timestamp: new Date().toISOString(),
    };

    await push(messagesRef, message);

    console.log('Message envoyé avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    throw error;
  }
};

export { listUsers, sendMessage, messagesRef, firestore, database };