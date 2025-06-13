import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // AGREGAR ESTA LÍNEA

const firebaseConfig = {
  apiKey: "AIzaSyAxQEbSBtaSwO76yNhHpGst63jWZkqkzxE",
  authDomain: "potros-632ee.firebaseapp.com",
  projectId: "potros-632ee",
  storageBucket: "potros-632ee.firebasestorage.app",
  messagingSenderId: "715399204517",
  appId: "1:715399204517:web:6f82c57e723c47931b074c"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Auth sin persistencia personalizada (compatible con Expo Go)
const auth = getAuth(app);

// Firestore
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

// Storage - AGREGAR ESTAS LÍNEAS
const storage = getStorage(app);

export { app, auth, db, storage }; // AGREGAR storage AL EXPORT