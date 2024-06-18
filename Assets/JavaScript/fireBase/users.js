import { dBase, auth, USERS } from "./app.js"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"
import { ref, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
import { startProgress } from "../common/utils/animations.js"
import { showInfo } from "../common/utils/form.js"
import { getParam, redirect } from "../common/utils/urls.js"


const ERR_KEYWORDS = ["email-already-in-use", "user-not-found", "wrong-password"]

// Register User
export const registerUser = (newData, redirectLink, sumtBtn) => {
    const progRef = startProgress(newData)
    createUserWithEmailAndPassword(auth, newData.email, newData.password)
        .then((creds) => {
            delete newData.password
            createUser(creds.user.uid, newData, redirectLink, progRef, sumtBtn)
        })
        .catch((error) => {
            let errCode = error.code
            if (errCode.endsWith(ERR_KEYWORDS[0])) {
                showInfo("User Already Exists", "incomplete", progRef, sumtBtn, true)
            }
            else console.log(error.message)
        })
}

// Create new user
const createUser = (uid, newData, redirectLink, progRef, sumtBtn) => {
    let newUserRef = ref(dBase, USERS + uid)
    set(newUserRef, newData)
        .then(() => {
            showInfo("Registered", "complete", progRef, sumtBtn)
            setTimeout(() => {
                redirect(redirectLink, getParam("searchfor", false))
            }, 1000)
        })
        .catch(error => console.log(error))
}

// Login User
export const loginUser = (newData, redirectLink, sumtBtn) => {
    const progRef = startProgress(newData)
    signInWithEmailAndPassword(auth, newData.email, newData.password)
        .then(() => {
            redirect(redirectLink, getParam("searchfor", false))
        })
        .catch((error) => {
            let errCode = error.code
            if (errCode.endsWith(ERR_KEYWORDS[1]) || errCode.endsWith(ERR_KEYWORDS[2])) {
                showInfo("Invalid Credentials", "incomplete", progRef, sumtBtn, true)
            }
            else console.log(error.message)
        })
}