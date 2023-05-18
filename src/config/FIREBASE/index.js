import firebase from 'firebase/compat/app';
import {getDatabase} from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyC_TYQGvtlUhwyhc2umVM-GjsgFjJk0j-Y',
  authDomain: 'gmaps-372813.firebaseapp.com',
  databaseURL:
    'https://gmaps-372813-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'gmaps-372813',
  storageBucket: 'gmaps-372813.appspot.com',
  messagingSenderId: '417073522945',
  appId: '1:417073522945:web:de7901c6a9ad9f07839300',
};

// Initialize Firebase

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

// const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase();

export default database;
