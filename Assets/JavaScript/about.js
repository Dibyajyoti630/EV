import {
    coverIcon, header, ANIM, navBackgroundChanger,
    startAnimation, statsBadgeAnimator, counterBadge
} from "./common/utils/animations.js"
import { getRandItem } from "./common/utils/basic.js"


// Active Page Animations
const pageAnimator = () => {

    // Header
    header.classList.add(ANIM)
    navBackgroundChanger()

    let scrollPos = window.scrollY, viewPort = window.visualViewport.height
    startAnimation(introImgContainer.querySelector(".note"), introImgContainer, scrollPos, header.offsetHeight) // Intro Image Quote
    startAnimation(discoverContainer.querySelector(".bg-cover.image"), discoverContainer, scrollPos, viewPort)
    startAnimation(coverIcon, contactContainer, scrollPos, viewPort, header.offsetHeight) // Contact Cover Icon
    statsBadgeAnimator(counterBadge, aboutContainer, scrollPos, viewPort, counterBadge.scrollHeight)
}
const aboutContainer = document.querySelector(".about-container")
const discoverContainer = document.querySelector(".discover-container")
const introImgContainer = aboutContainer.querySelector(".intro-content .img-contain")
const contactContainer = coverIcon.parentElement.parentElement
window.addEventListener("DOMContentLoaded", pageAnimator)
window.addEventListener("scroll", pageAnimator)


// Assign random service link to 'a' tag
const learnMoreBtn = discoverContainer.querySelector(".site-btn")
setTimeout(() => {
    const serviceLinks = header.querySelectorAll(".dropdown a.link")
    const randLink = getRandItem(serviceLinks)
    if (randLink) learnMoreBtn.setAttribute("href", randLink.getAttribute("href"))
}, 2000)
