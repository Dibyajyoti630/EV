import {
    missionContent, coverIcon, header, ANIM, counterBadge,
    navBackgroundChanger, startAnimation, keywordChanger, statsBadgeAnimator
} from "./common/utils/animations.js"


// Active Page Animations
const pageAnimator = () => {

    // Header
    header.classList.add(ANIM)
    navBackgroundChanger()

    let scrollPos = window.scrollY, viewPort = window.visualViewport.height
    if (startAnimation(topContainer, null, scrollPos, viewPort, header.offsetHeight)) { // Main Title
        keywordChanger(topContainer.querySelector(".green"))
    }
    startAnimation(missionContent, aboutContainer, scrollPos, viewPort) // Mission Container
    startAnimation(coverIcon, contactContainer, scrollPos, viewPort, header.offsetHeight) // Contact Cover Icon
    statsBadgeAnimator(counterBadge, aboutContainer, scrollPos, viewPort, counterBadge.scrollHeight)
}
const topContainer = document.querySelector(".top-container")
const aboutContainer = missionContent.parentElement
const contactContainer = coverIcon.parentElement.parentElement
window.addEventListener("DOMContentLoaded", pageAnimator)
window.addEventListener("scroll", pageAnimator)