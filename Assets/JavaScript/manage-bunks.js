import { auth, getUserDetails } from "./fireBase/app.js"
import {
    activateHeaderAnimations, startProgress, createBunkCard,
    header, C_SHOW, C_PREVIEW, openFilePicker
} from "./common/utils/animations.js"
import { noSubmit, collectFormData, showInfo } from "./common/utils/form.js"
import {
    REDIRECT_EXCEPTIONS, getCurrentPath, assignRedirectLink,
    toUrlParams, redirect, clearImageBlob
} from "./common/utils/urls.js"
import { OWNERID, addUpdateBunk, deleteBunk } from "./fireBase/bunks.js"
import {
    form, cardsDeck, bunkImage,
    toggleEmptyDeck, viewBunkDetails, revertFormToDefault, formTitle, FORM_NAMES,
    trackLoadedBunks, loadMoreBunk, getBgImage,
    showMoreBtn, spinner, emptyInfo
} from "./common/bunk-cards.js"
import { getImgUrl } from "./fireBase/images.js"


// Active Header Animations
activateHeaderAnimations()

// Reset & disable form
form.reset()
form.addEventListener("submit", noSubmit)

// Redirect page if user is not Admin
auth.operations.then(() => {
    let user = auth.currentUser
    if (user != null) {
        getUserDetails(user.uid)
            .then(async (userDetail) => { // Checking auth user is admin
                if (userDetail && userDetail.isAdmin) {
                    form.addEventListener("submit", formSubmission) // activate form

                    // Loading 3 bunk data as cards
                    const maxCardCount = 3
                    loadMoreBunk(OWNERID, user.uid, maxCardCount, true)
                    let moreCount = maxCardCount
                    showMoreBtn.addEventListener("click", async () => {
                        showMoreBtn.classList.remove(C_SHOW)
                        let hasDuplicate = await loadMoreBunk(OWNERID, user.uid, moreCount, false)
                        if (hasDuplicate) {
                            setTimeout(() => {
                                spinner.classList.remove(C_SHOW)
                                emptyInfo.classList.add(C_SHOW)
                            }, maxCardCount * 100)
                        }
                        else {
                            showMoreBtn.classList.add(C_SHOW)
                            moreCount += maxCardCount
                        }
                    })
                }
                else throw null
            })
            .catch(_ => redirect(REDIRECT_EXCEPTIONS[2], toUrlParams({ code: 403 })))
    }
    else assignRedirectLink(REDIRECT_EXCEPTIONS[0], getCurrentPath())
})

// Showing Empty card Deck
toggleEmptyDeck()

// Form Submission
const formSubmission = async (e) => {
    e.preventDefault()
    let { data, sumtBtn } = collectFormData(e.target, false, true)
    if (data) {
        // Removing old image
        bunkImage.style.backgroundImage = "none"

        let formName = formTitle.innerHTML
        if (FORM_NAMES.indexOf(formName) >= 0) {
            const progRef = startProgress(data)
            insertBunkData(data, progRef, sumtBtn, formName == FORM_NAMES[0])
        }
        else {
            let confimation = window.confirm("After you delete a bunk data, it's permanently deleted. Bunk data can't be recovered")
            if (confimation) {
                const progRef = startProgress(data)
                await deleteBunk(data.bunkid).then(() => {
                    showInfo("Bunk Deleted", "complete", progRef, sumtBtn, true)
                    cardsDeck.querySelector(`.card.${C_PREVIEW}`).remove()
                    revertFormToDefault(true)
                    toggleEmptyDeck(1)
                    if (showMoreBtn) showMoreBtn.click()
                }).catch(() => showInfo("Something Went Wrong", "incomplete", progRef, sumtBtn, true))
            }
        }
    }
}

// Add/Update bunk data & loading the new data
const insertBunkData = async (data, progRef, sumtBtn, asNew) => {
    let message = `Bunk ${asNew ? "Added" : "Updated"}`
    let selectedCard = cardsDeck.querySelector(`.card.${C_PREVIEW}`)

    // Add/Update bunk data
    await addUpdateBunk(auth.currentUser.uid, data, asNew).then(async (bunkData) => {
        showInfo(message, "complete", progRef, sumtBtn, true)
        bunkData.imageUrl = await getImgUrl(bunkData.imageUrl)

        // Create/Replace Bunk card
        setTimeout(async () => {
            selectedCard = await createBunkCard(bunkData, cardsDeck, selectedCard)
            trackLoadedBunks(bunkData.id)
            clearImageBlob(getBgImage(bunkImage))
            asNew ? toggleEmptyDeck(1) : viewBunkDetails(openFilePickerOnEnter)
            document.documentElement.scrollTop = selectedCard.offsetTop - header.scrollHeight
        }, 1000)
    }).catch((error) => {
        console.log(error)
        showInfo("Something Went Wrong", "incomplete", progRef, sumtBtn, true)
    })
}

// Add & Preview Bunk Image
bunkImage.addEventListener("click", openFilePicker)
const openFilePickerOnEnter = (e) => {
    if (e.key == "Enter") {
        openFilePicker(e)
    }
}
bunkImage.addEventListener("keypress", openFilePickerOnEnter)

// Preview Bunk full details
cardsDeck.addEventListener("click", () => {
    viewBunkDetails(openFilePickerOnEnter)
})

// Edit Bunk Preview Button
form.querySelector(".submit-btn.edit").addEventListener("click", () => revertFormToDefault(false))