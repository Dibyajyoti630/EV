import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"
import { getDatabase, ref, child, get, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { getStorage } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js"
import { getValidRedirectLink, redirect } from "../common/utils/urls.js"


// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBeh7xrIz7XVUZRnB7t76WPgoI6-_pn0ZM",
    authDomain: "carbon-poet-420015.firebaseapp.com",
    projectId: "carbon-poet-420015",
    storageBucket: "carbon-poet-420015.appspot.com",
    messagingSenderId: "568684683919",
    appId: "1:568684683919:web:b0d3129f3ee02e9cc8c6fa",
    measurementId: "G-BFP7KSW8NJ"
  };
initializeApp(firebaseConfig)

// Services & References
export const auth = getAuth()
export const dBase = getDatabase()
export const storage = getStorage()
export const USERS = "users/"
export const KEYS = "keys/"
export const authStateListener = onAuthStateChanged

// Logout Current User
export const logoutUser = async () => {
    await signOut(auth).then(() => {
        let currentPath = getValidRedirectLink()
        redirect(currentPath)
    })
}

// Get User-details by uid from Db
export const getUserDetails = async (uid) => {
    const userRef = child(ref(dBase), USERS + uid)
    try {
        const userCred = await get(userRef)
        return userCred.val()
    } catch (error) {
        return error.message
    }
}

// Unique Id (key) generetor/updater
export const keyTracker = async (key) => {
    const keyRef = ref(dBase, KEYS + key)
    try {
        const nextKeyRef = await get(keyRef)
        let nextKey = nextKeyRef.val()
        if (nextKey == null) nextKey = "01"
        set(keyRef, generateKey(nextKey))
        return nextKey
    } catch (error) {
        return error.message
    }
}

// Generate next key
export const generateKey = (value) => {
    let newid = value ? Number.parseInt(value) + 1 : 1
    return newid < 10 ? `0${newid}` : newid
}