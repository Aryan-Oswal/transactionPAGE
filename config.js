// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase'
require('@firebase/firestore')
const firebaseConfig = {
    apiKey: "AIzaSyCFlSkoa1NEkwRIeTb3DqqbMmUgTYXr_-A",
    authDomain: "ballon-fe72e.firebaseapp.com",
    databaseURL: "https://ballon-fe72e-default-rtdb.firebaseio.com",
    projectId: "ballon-fe72e",
    storageBucket: "ballon-fe72e.appspot.com",
    messagingSenderId: "983212160358",
    appId: "1:983212160358:web:c9a75cec92df007fb0c4a7",
    measurementId: "G-WLJLWR3VYP"
  };
if(!firebase.apps.length) {
    const firebaseApp = firebase.initializeApp(firebaseConfig)
}

export default firebase.firestore()