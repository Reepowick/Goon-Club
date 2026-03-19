import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBNyYyd4xf9ISAznvmKVJIfkUwgkcGgR6Y",
    authDomain: "goonclicker.firebaseapp.com",
    databaseURL: "https://goonclicker-default-rtdb.firebaseio.com",
    projectId: "goonclicker",
    storageBucket: "goonclicker.firebasestorage.app",
    messagingSenderId: "957454926300",
    appId: "1:957454926300:web:48f971e3432b497b344f19"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export { ref, set, get, onValue };