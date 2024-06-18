import { REDIRECT_EXCEPTIONS, clearImageBlob } from "./urls.js"


// Disable scrollbars
export const disableScrollBars = () => {

    // Hide & disable the scrollbar
    document.documentElement.style.overflow = "hidden"
    document.body.scroll = "no"

    // Disable TAB key to focus all 'a' tags
    document.querySelectorAll("a").forEach((element) => {
        element.tabIndex = "-1"
    })
}

// Enable scrollbars
export const enableScrollBars = () => {

    // Show & enable the scrollbar
    document.documentElement.style.overflow = "auto"
    document.body.scroll = "yes"

    // Enable TAB key to focus all 'a' tags
    document.querySelectorAll("a").forEach((element) => {
        element.tabIndex = "1"
    })
}

// Nav-bar Background Changer
export const header = document.querySelector("header")
export const navBackgroundChanger = () => {
    const HEAD_CLS = "scrolling"
    let hasClass = header.classList.contains(HEAD_CLS)
    if (window.scrollY > 0 && hasClass == false) {
        header.classList.add(HEAD_CLS)
    }
    else if (window.scrollY < 1 && hasClass) {
        header.classList.remove(HEAD_CLS)
    }
}

// Element Animator
export const ANIM = "animate"
export const startAnimation = (target, targetParent = null, scrollPos, viewPort = 0, posDeviation = 0) => {
    let elementOffset = target.offsetTop, offsetMax = 0
    if (targetParent) {
        elementOffset += targetParent.offsetTop
    }
    else {
        offsetMax += viewPort
    }
    offsetMax += elementOffset + ((posDeviation > 0) ? (-1 * posDeviation) : viewPort)
    if (offsetMax >= scrollPos && scrollPos >= elementOffset - viewPort) {
        if (target.classList[0] == "title") {
            return true
        }
        else if (target.classList.contains(ANIM) == false) {
            target.classList.add(ANIM)
            return true
        }
        return false
    }
}

// Active Header Animations
export const activateHeaderAnimations = () => {
    header.classList.add(ANIM)
    navBackgroundChanger()
    window.addEventListener("scroll", navBackgroundChanger)
}

// Main Title Keyword Changer
export const C_HIDE = "hide"
export const keywordChanger = (element) => {
    let wordIndex = 0
    const WORDS = ["REST", "BOOST", "RE-FILL", "CHARGE"]
    const duration = Number.parseFloat(window.getComputedStyle(element).animationDuration)
    const changer = setInterval(() => {
        if (window.innerWidth < 768) {
            clearInterval(changer)
            wordIndex = 2
        }
        element.classList.add(C_HIDE)
        setTimeout(() => {
            element.innerHTML = WORDS[wordIndex++]
            if (wordIndex >= WORDS.length) {
                wordIndex = 0
            }
            element.classList.remove(C_HIDE)
        }, duration * 500)
    }, duration * 1000)
}

// Stats Badge Animator
export const statsBadgeAnimator = (...params) => {
    const statsContent = document.querySelector(".about-container .stats-content")
    let classes = statsContent.classList
    if (startAnimation(...params) && classes.contains(ANIM)) {
        classes.remove(ANIM)
        statsContent.querySelectorAll(".badge .title").forEach(numberCounter)
    }
}
// Number Counter
const numberCounter = (title) => {
    const digit = Number.parseInt(title.innerHTML)
    const symbol = title.innerHTML.split(digit)[1]
    const DURATION = 2000, MULTIPLE = 0.1
    const interval = Math.floor(DURATION * MULTIPLE), incrementby = digit * MULTIPLE

    let count = 0
    const counter = setInterval(() => {
        title.innerHTML = Math.floor(++count * incrementby) + symbol
    }, interval)
    setTimeout(() => {
        title.innerHTML = digit + symbol
        clearInterval(counter)
    }, DURATION)
}

// Dropdown Show/Hide on Hover
export const C_SHOW = "show"
export const dropdownShow = (e, link = null) => {
    if (e) link = e.target
    link.querySelector(".dropdown-box").classList.add(C_SHOW)
    link.addEventListener("mouseleave", dropdownHide)
}
export const dropdownHide = (e, link = null) => {
    if (e) link = e.target
    link.querySelector(`.dropdown-box.${C_SHOW}`).classList.remove(C_SHOW)
    link.removeEventListener("mouseleave", dropdownHide)
}
// Dropdown Show/Hide on TAB key focus
export const toggleDropDownOnFocus = (event) => {
    let link = event.target
    let dropdown = header.querySelector(".dropdown-box.show")
    if (link.classList.contains("dropdown")) {
        dropdownShow(null, link)
    }
    else if (link.classList.contains("sub-link")) {
        dropdownShow(null, link.parentElement.parentElement)
    }
    else if (dropdown) {
        dropdownHide(null, dropdown.parentElement)
    }
}

// Toggle Scroll to Top button
export const toggleScrolltoTop = () => {
    const scrollPos = window.visualViewport.height * 0.2
    let scrollTopBtn = document.querySelector(".scroll-to-top")
    if (scrollTopBtn) {
        scrollTopBtn.hidden = window.scrollY < scrollPos
    }
    else if (window.scrollY > scrollPos) {

        // Creating Scroll-to-Top button
        scrollTopBtn = document.createElement("a")
        scrollTopBtn.classList.add("scroll-to-top")
        scrollTopBtn.setAttribute("tabindex", "1")
        scrollTopBtn.innerHTML = `&#11165;`
        scrollTopBtn.style.cursor = "pointer"
        scrollTopBtn.addEventListener("click", () => {
            document.documentElement.scrollTop = 0
        })
        // Showing on screen
        footer.before(scrollTopBtn)
    }
}

// Add Links for Manage-Bunks Page
export const addAdminUserLinks = (parent) => {
    let link = document.createElement("a")
    link.classList.add("link", "sub-link", "admin-link")
    link.setAttribute("tabindex", "1")
    link.setAttribute("href", `./${REDIRECT_EXCEPTIONS[3]}`)
    link.innerHTML = "Ev Bunk Details"
    parent.prepend(link)
}

// Start Progrees Animation
export const C_LOAD = "load"
export const startProgress = (data) => {
    const progressBar = header.querySelector(".progress")
    const progress = progressBar.querySelector(".slider")
    progressBar.classList.add(C_LOAD)
    let progressed = Object.keys(data).length
    let toProgress = progressed * 10
    const load = setInterval(() => {
        progress.style.width = `${Math.floor((progressed / toProgress) * 100)}%`
        progressed++
        toProgress++
    })
    return load
}

// Stop/Complete Progress Animation
export const stopProgress = (pid) => {
    const progressBar = header.querySelector(".progress")
    const progress = progressBar.querySelector(".slider")
    progress.style.width = "100%"
    setTimeout(() => {
        progressBar.classList.remove(C_LOAD)
        progress.style.width = "0%"
        clearInterval(pid)
    }, 100)
}

// Create Bunk Details as Card
export const createBunkCard = async (data, parent, card = null) => {
    if (card == null) {
        card = document.createElement("section")
        card.classList.add("card")
        card.addEventListener("click", () => {
            highLightBunkCard(card, parent)
        })
        parent.append(card)
    }
    card.innerHTML = `<div class="thumb" style="background-image:url('${data.imageUrl}')"></div>
                        <h2 class="overflow">${data.name}</h2>
                        <div class="details">
                            <p class="overflow">${data.city}<span class="slash">/</span>${data.country}</p>
                            <p class="slots">
                                <span class="available">${data.freeslots}</span><span class="slash">/</span><span class="total">${data.slots}</span>
                            </p>
                        </div>
                        <input type="hidden" class="b-id" value="${data.id}">`
    return card
}

// Highlight selected card
export const C_PREVIEW = "preview"
export const highLightBunkCard = (card, parent) => {
    let preCard = parent.querySelector(`.card.${C_PREVIEW}`)
    if (preCard && preCard != card) {
        preCard.classList.toggle(C_PREVIEW)
    }
    card.classList.toggle(C_PREVIEW)
}

// Upload, Preview & Change image file
export const openFilePicker = (e) => {
    let element = e.target
    if (element.tagName == "INPUT") element = element.parentElement
    let imgInput = element.querySelector(".b-image")
    imgInput.setAttribute("type", "file")
    imgInput.click()
    imgInput.value = ""
    element.style.backgroundImage = "none"
    imgInput.addEventListener("change", changeBunkImage)
}
const changeBunkImage = (e) => {
    clearImageBlob()
    let imgInput = e.target
    let bunkImage = imgInput.parentElement
    let imageUrl = URL.createObjectURL(imgInput.files[0])
    window.localStorage.setItem("newBlobImage", imageUrl)
    bunkImage.style.backgroundImage = `url("${imageUrl}")`
    bunkImage.removeEventListener("change", changeBunkImage)
}

export const counterBadge = document.querySelector(".stats-content .title")
export const missionContent = document.querySelector(".about-container .mission-content")
export const coverIcon = document.querySelector(".contact-container .bg-cover.right img")
export const footer = document.querySelector("footer")