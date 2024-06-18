import { activateHeaderAnimations } from "./utils/animations.js"
import { linkDeactivator } from "./utils/urls.js"


// Active Header Animations
activateHeaderAnimations()

// Filling the page Titles
const pageTitle = document.title.split(" |")[0]
const titlePlaceholders = document.querySelectorAll(".page-title")
titlePlaceholders.forEach((title) => {
    title.innerHTML = pageTitle
})

// Activate Related Navigation Link
const serviceContainer = document.querySelector(".service-container")
linkDeactivator(serviceContainer.querySelector(".suggestions-content .navigation"))


// Open/Close Video Player
const mediaPlayer = document.querySelector(".media-player")
const video = mediaPlayer.querySelector(".video"), AUTOPLAY = "autoplay=1"
var urlSymbol = "?"
serviceContainer.querySelector(".play-btn").addEventListener("click", () => {
    urlSymbol = video.src.indexOf(urlSymbol) > -1 ? "&" : urlSymbol
    video.src += urlSymbol + AUTOPLAY
    mediaPlayer.classList.add("open")
})
mediaPlayer.querySelector(".close-btn").addEventListener("click", () => {
    video.src = video.src.replace(urlSymbol + AUTOPLAY, "")
    mediaPlayer.classList.remove("open")
})
