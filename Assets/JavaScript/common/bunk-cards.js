import { OWNERID, getBunksByLocation, getBunksByOwnerId, collectBunkData } from "../fireBase/bunks.js"
import { getImgUrl } from "../fireBase/images.js"
import { createBunkCard, C_HIDE, C_SHOW, C_PREVIEW, highLightBunkCard, openFilePicker } from "./utils/animations.js"
import { switchFormState } from "./utils/form.js"


export const form = document.querySelector(".bunk-edit .edit-form")
export const bunkImage = form.querySelector(".details-content .thumb")
export const cardsDeck = document.querySelector(".cards-deck")
const loadMoreContainer = document.querySelector(".loadmore-container")
export const spinner = loadMoreContainer.querySelector(".spinner")
export const showMoreBtn = loadMoreContainer.querySelector(".show-more")
export const emptyInfo = loadMoreContainer.querySelector(".empty-info")
var bunksLoaded = []

// Close Bunk Preview button
form.querySelector(".close-btn").addEventListener("click", () => {
    let card = cardsDeck.querySelector(`.card.${C_PREVIEW}`)
    if (card) {
        highLightBunkCard(card, cardsDeck)
        revertFormToDefault(true)
    }
})

// Load Bunks to Show as Card
export const loadMoreBunk = async (filter, uid, count, reverse) => {
    spinner.classList.add(C_SHOW)
    const loadedBunks = (filter == OWNERID) ? await getBunksByOwnerId(uid, count, reverse) : await getBunksByLocation(filter)
    if (loadedBunks?.keysOrder?.length) {
        const { bunks, keysOrder } = loadedBunks
        let hasDuplicate = false
        keysOrder.forEach(async (key) => {
            if (bunksLoaded.indexOf(key) < 0) {
                let bunkData = bunks[key]
                bunkData.id = key
                bunkData.imageUrl = await getImgUrl(bunkData.imageUrl)
                await createBunkCard(bunkData, cardsDeck)
                spinner.classList.remove(C_SHOW)
                toggleEmptyDeck(count || keysOrder.length)
                if (count) trackLoadedBunks(keysOrder)
            }
            else hasDuplicate = true
        })
        return hasDuplicate
    }
    else {
        spinner.classList.remove(C_SHOW)
        emptyInfo.classList.add(C_SHOW)
    }
}

// Show/Hide Bunk Card Deck
export const toggleEmptyDeck = (count) => {
    const allBunks = cardsDeck.querySelectorAll(".card")
    const totalBunks = allBunks.length
    if (totalBunks > 0) {
        cardsDeck.previousElementSibling.children[1].classList.remove(C_SHOW)
        cardsDeck.classList.remove(C_HIDE)
        if (showMoreBtn && totalBunks > 1 && totalBunks == count) {
            showMoreBtn.classList.add(C_SHOW)
            emptyInfo.classList.remove(C_SHOW)
        }
        else if (showMoreBtn && totalBunks <= count && showMoreBtn.classList.contains(C_SHOW) === false) {
            emptyInfo.classList.add(C_SHOW)
        }
    }
    else {
        cardsDeck.previousElementSibling.children[1].classList.add(C_SHOW)
        cardsDeck.classList.add(C_HIDE)
        emptyInfo.classList.remove(C_SHOW)
    }
}

// Track loaded bunks
export const trackLoadedBunks = (data) => {
    if (data instanceof Array) {
        bunksLoaded = bunksLoaded.concat(data)
    }
    else if (data instanceof String) {
        bunksLoaded.push(data)
    }
}

// Preview Bunk full details
export const VIEW_MODE = "VIEW"
export const formTitle = form.querySelector(".title .grad-bg")
export const viewBunkDetails = (imgCallback = null) => {
    let card = cardsDeck.querySelector(`.card.${C_PREVIEW}`)
    let formIsPreviewMode = form.classList.contains(C_PREVIEW)
    if (card) {
        fillForm(card, form) // with the selected bunk card
        if (formIsPreviewMode === false) {
            switchFormState(form, openFilePicker, true, true)
            if (imgCallback) {
                bunkImage.removeEventListener("keypress", imgCallback)
            }
            formTitle.innerHTML = VIEW_MODE
            form.classList.add(C_PREVIEW)
        }
    }
    else if (formIsPreviewMode) revertFormToDefault(true, imgCallback)
}

// Fill form with selected card id
export const fillForm = async (card, form) => {
    let bunkId = card.querySelector(".b-id").value
    let data = await collectBunkData(bunkId)                // get data with id
    let imgUrl = getBgImage(card.querySelector(".thumb"))
    form.querySelector(".b-id").value = bunkId              // bunk id

    let imageInput = form.querySelector(".b-image")         // image input
    if (imageInput) {
        form.querySelector(".b-image-id").value = data.imageUrl // img id
        imageInput.setAttribute("type", "url")
        imageInput.value = imgUrl
    }
    // populate other fields
    form.querySelector(".b-name").value = data.name
    form.querySelector(".b-slots").value = data.slots
    form.querySelector(".b-free-slots").value = data.freeslots
    form.querySelector(".b-number").value = data.number
    form.querySelector(".b-email").value = data.email
    form.querySelector(".thumb").style.backgroundImage = `url("${imgUrl}")`
    form.querySelector(".b-address").value = data.address
    form.querySelector(".b-city").value = data.city
    form.querySelector(".b-country").value = data.country
}

// Background img of a HTML element
export const getBgImage = (element) => {
    return window.getComputedStyle(element).backgroundImage.slice(5, -2)
}

// Hide bunk preview
export const FORM_NAMES = ["ADD", "UPDATE"]
export const revertFormToDefault = (fullReset, imgCallback = null) => {
    switchFormState(form, openFilePicker, false, true)
    if (fullReset) {
        formTitle.innerHTML = imgCallback ? FORM_NAMES[0] : VIEW_MODE
        form.reset()
        bunkImage.style.backgroundImage = "none"
    }
    else {
        formTitle.innerHTML = FORM_NAMES[1]
    }
    form.classList.remove(C_PREVIEW)
    if (imgCallback) bunkImage.addEventListener("keypress", imgCallback)
}