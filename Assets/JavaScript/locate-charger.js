import { auth } from "./fireBase/app.js"
import { activateHeaderAnimations, startProgress, stopProgress, C_SHOW } from "./common/utils/animations.js"
import { noSubmit, collectFormData, showInfo, highlightField } from "./common/utils/form.js"
import { REDIRECT_EXCEPTIONS, getCurrentPath, assignRedirectLink, getParam } from "./common/utils/urls.js"
import {
    form, cardsDeck, toggleEmptyDeck, viewBunkDetails, revertFormToDefault,
    loadMoreBunk, spinner, emptyInfo
} from "./common/bunk-cards.js"


// Active Header Animations
activateHeaderAnimations()

// Reset & disable form
const searchBox = document.querySelector("#search-box")
form.reset()
form.addEventListener("submit", noSubmit)

// Redirect page if user is not Auth
auth.operations.then(() => {
    if (auth.currentUser != null) {
        searchBox.addEventListener("submit", searchFormSubmission) // activate searchbox
        let searchfor = getParam("searchfor"), hasslots = getParam("hasslots")
        if (searchfor) {
            searchBox.querySelector("input[name=searchfor]").value = searchfor
        }
        if (hasslots) {
            searchBox.querySelector("input[name=hasslots]").value = hasslots
        }
        if (searchfor || hasslots) searchBox.querySelector(".submit-btn").click()
    }
    else assignRedirectLink(REDIRECT_EXCEPTIONS[0], getCurrentPath())
})

// Showing Empty card Deck
toggleEmptyDeck()

const searchFormSubmission = async (e) => {
    e.preventDefault()
    cardsDeck.innerHTML = ""
    revertFormToDefault(true)
    toggleEmptyDeck()
    let { data, sumtBtn } = collectFormData(e.target, false, true, "text")
    if (data && data.hasslots == "true" || data.searchfor != "") {
        const progRef = startProgress(data)
        await loadMoreBunk(data).then(async () => {
            stopProgress(progRef)
            sumtBtn.disabled = false
            document.documentElement.scrollTop = document.querySelector(".top-container").scrollHeight
            setTimeout(() => {
                spinner.classList.remove(C_SHOW)
                let message = `Showing results for "${data.searchfor}"`
                if (data.searchfor != "" && data.hasslots != "") {
                    message += " with minimum 2 freeslots"
                }
                else if (data.hasslots) {
                    message = "Showing results of all bunks with minimum 2 freeslots"
                }
                emptyInfo.innerHTML = message
                emptyInfo.classList.add(C_SHOW)
            }, 1000)
        }).catch(() => showInfo("Something Went Wrong", "incomplete", progRef, sumtBtn, true))
    }
    else highlightField(e.target.querySelector("input[name=searchfor]"), sumtBtn, true, false)
}

// Preview Bunk full details
cardsDeck.addEventListener("click", () => viewBunkDetails())