import { activateHeaderAnimations } from "./utils/animations.js"
import { getParam } from "./utils/urls.js"


// Active Header Animations
activateHeaderAnimations()

const statusCode = getParam("code")
const errorContainer = document.querySelector("#error-container")
if (statusCode) {
    errorContainer.querySelector("#error #code").innerHTML = statusCode
    const errorMessage = errorContainer.querySelector("#error #message")
    const eShortNote = errorContainer.querySelector("#short-note")
    const eBriefNote = errorContainer.querySelector("#brief-note")
    if (statusCode == 400) {
        errorMessage.innerHTML = "Bad Request"
        eShortNote.innerHTML = "Duplicate Authentication Attempt Detected"
        eBriefNote.innerHTML = `You are not allowed to register/login multiple user while one user is authenticated <br class="line-break">First you need to logout user to perform such task.`
    }
    else if (statusCode == 403) {
        errorMessage.innerHTML = "Forbidden"
        eShortNote.innerHTML = "Page Access Restricted"
        eBriefNote.innerHTML = `You don't have the required permissions to view/access this page as well as its contents <br class="line-break">Probably you might not be a admin user to authenticate this page.`
    }
    document.title = `Error - ${statusCode} ${errorMessage.innerHTML} | e-Fill`
}