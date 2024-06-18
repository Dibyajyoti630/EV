import { auth } from "../fireBase/app.js"
import { activateHeaderAnimations } from "./utils/animations.js"
import { noSubmit, collectFormData } from "./utils/form.js"
import {
    REDIRECT_EXCEPTIONS, toUrlParams, redirect,
    getParam, getValidRedirectLink
} from "./utils/urls.js"
import { sFormater } from "./utils/basic.js"
import { registerUser, loginUser } from "../fireBase/users.js"


// Active Header Animations
activateHeaderAnimations()

const formContainer = document.querySelector(".auth-container")
const form = formContainer.querySelector(".auth-form")
form.addEventListener("submit", noSubmit)

// Filling the Form Title
const pageTitle = document.title.split(" |")[0].toLowerCase()
const isRegister = pageTitle == "register"

// Redirect page if user is Authenticated
auth.operations.then(() => {
    if (auth.currentUser) {
        redirect(REDIRECT_EXCEPTIONS[2], toUrlParams({ code: 400 }))
    }
    else form.addEventListener("submit", formSubmission)
})

// Login/Register Form Submission
const formSubmission = (e) => {
    e.preventDefault()
    let redirectLink = getValidRedirectLink(getParam("next"), REDIRECT_EXCEPTIONS.slice(3))
    let { data, sumtBtn } = collectFormData(form, isRegister)
    if (data) {
        if (isRegister) {
            data = {
                name: sFormater(data.name),
                email: sFormater(data.email),
                isAdmin: sFormater(data.type, true) == "bunk manager",
                password: sFormater(data.password)
            }
            registerUser(data, redirectLink, sumtBtn)
        }
        else {
            data = {
                email: sFormater(data.email),
                password: sFormater(data.password)
            }
            loginUser(data, redirectLink, sumtBtn)
        }
    }
}

// Filling the Form Title
const formTitle = formContainer.querySelector(".form-heading")
formTitle.innerHTML = pageTitle.toUpperCase()
formTitle.classList.remove("placeholder")

// Removing Unwanted Form Fields
const nameField = form.querySelector(".u-name")
const typeField = form.querySelector(".u-type")
const pwdField = form.querySelector(".u-password")
const otherOption = formContainer.querySelector(".other-option")
if (isRegister === false) {
    nameField.remove()
    typeField.remove()
    otherOption.innerHTML = `Don't have an account?&ensp;<a class="link" href="/register">Register</a>`
}
else {
    otherOption.innerHTML = `Already have an account?&ensp;<a class="link" href="/login">Login</a>`
}

// Show/Hide Password
const tPWD = "password", tText = "text"
const pwdEye = form.querySelector(".eye")
pwdEye.addEventListener("click", () => {
    let currentState = pwdField.type
    let newState = currentState == tPWD ? tText : tPWD
    pwdField.type = newState
    pwdField.focus()
})