const firebaseConfig = {
  apiKey: "AIzaSyDndR3R24U6P7w3w_mnvaC14u90T9e227U",
  authDomain: "todo-skd.firebaseapp.com",
  projectId: "todo-skd",
  storageBucket: "todo-skd.appspot.com",
  messagingSenderId: "769460416327",
  appId: "1:769460416327:web:b23f329361f6cb8831a662",
  measurementId: "G-CX6V6LBP2B",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var db = firebase.firestore();
