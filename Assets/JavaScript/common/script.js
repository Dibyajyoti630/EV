import { auth, authStateListener, logoutUser, getUserDetails } from "../fireBase/app.js"
import {
    disableScrollBars, C_LOAD, header, footer, enableScrollBars,
    dropdownShow, toggleDropDownOnFocus, C_SHOW, C_HIDE, toggleScrolltoTop,
    addAdminUserLinks
} from "./utils/animations.js"
import {
    getCurrentPath, linkDeactivator, REDIRECT_EXCEPTIONS,
    getValidRedirectLink, assignRedirectLink, clearImageBlob
} from "./utils/urls.js"
import { getRandItem } from "./utils/basic.js"
import { searchBoxSubmit } from "./utils/form.js"


// Loading Launcher & Disable Scrollbar
const LAUNCH = "launcher"
const isLaunched = window.sessionStorage.getItem(`${LAUNCH}`)
const launcher = document.querySelector(`.${LAUNCH}`)
if (isLaunched) {
    launcher.classList.remove(C_LOAD)
}
else {
    disableScrollBars()
}
// Loading contents
$("header").load("./common/header.html")
$("footer").load("./common/footer.html")

// Highlight & Deactivate current link
const currentPage = getCurrentPath()
const iMsec = 200
let iCount = iMsec
const hasLink = setInterval(() => {
    if ((header.children.length && (linkDeactivator(header) || REDIRECT_EXCEPTIONS.includes(currentPage))) || iCount > iMsec * 10) {
        initPageFunctions()
        clearInterval(hasLink)
    }
    iCount += iMsec
}, iMsec)


// Initiate Page Options
function initPageFunctions() {

    // Enable scrollbar
    if (isLaunched !== true) {
        window.sessionStorage.setItem(`${LAUNCH}`, true)
        enableScrollBars()
    }
    // Remove launcher
    launcher.remove()

    // Tracking for any Authentication state change
    trackAuthState(header)

    // Dropdown Hover
    const navLinks = header.querySelector(".nav-links")
    const dropdownLinks = navLinks.querySelectorAll(".dropdown")
    dropdownLinks.forEach((link) => {
        link.addEventListener("mouseenter", dropdownShow)
    })

    // Toggle dropdown on TAB key focus
    navLinks.addEventListener("focusin", toggleDropDownOnFocus)

    // Mobile Navigation Menu
    const mobPageTitle = header.querySelector(".page-title-mob")
    mobPageTitle.addEventListener("click", () => {
        mobPageTitle.classList.toggle(C_SHOW)
        document.querySelector(".bg-cover-mob").classList.toggle(C_SHOW)
    })

    // Login Link Redirect
    const loginLink = header.querySelector(".login-btn")
    loginLink.addEventListener("click", (e) => {
        if (getValidRedirectLink(currentPage) != null) {
            e.preventDefault()
            let goToLink = e.target.getAttribute("href")
            assignRedirectLink(goToLink, currentPage)
        }
    })

    // Copying Partner images for infinite scroll
    const marqueeBadges = document.querySelector(".marquee-badges")
    if (marqueeBadges) {
        marqueeBadges.querySelectorAll("img").forEach((badge) => {
            marqueeBadges.append(badge.cloneNode())
        })
    }

    // Random Social link Highligher
    const footerSocialIcons = footer.querySelectorAll("footer .social-links img")
    const randIcon = getRandItem(footerSocialIcons)
    if (randIcon) randIcon.classList.add("highlight")

    // Copyrights year
    const year = new Date().getFullYear()
    document.querySelector(".copyrights #year").innerHTML = year

    // Scroll to Top button
    window.addEventListener("scroll", toggleScrolltoTop)
    clearImageBlob()
}


// Track Authentication State to add Some elements
const trackAuthState = async (parent) => {
    const loginBtn = parent.querySelector(".login-btn")
    const logoutBtn = parent.querySelector(".logout-btn")
    const btnPlaceholder = parent.querySelector(".btn-placeholder")
    const searchBox = document.querySelector("#search-box")

    // On User Login/Logout
    authStateListener(auth, (user) => {
        if (user) {
            btnPlaceholder.classList.remove(C_SHOW)
            logoutBtn.classList.remove(C_HIDE)
            logoutBtn.addEventListener("click", logoutUser)
            loginBtn.remove()
            assignAuthLinks(user.uid, parent)
            if (searchBox) searchBox.addEventListener("submit", e => searchBoxSubmit(e, false))
        }
        else {
            btnPlaceholder.classList.remove(C_SHOW)
            loginBtn.classList.remove(C_HIDE)
            logoutBtn.remove()
            if (searchBox) searchBox.addEventListener("submit", e => searchBoxSubmit(e))
        }
    })
}

const assignAuthLinks = (userId, parent) => {
    let newLink = document.createElement("div")
    newLink.classList.add("link", "dropdown", "manage")
    newLink.setAttribute("tabindex", "1")
    newLink.innerHTML = `Manage&nbsp;<span class="sym">⌄</span>
                        <div class="dropdown-box">
                            <a class="link sub-link" href="/${REDIRECT_EXCEPTIONS[4]}" tabindex="1">Locate Charger</a>
                            <a class="link sub-link" href="/${REDIRECT_EXCEPTIONS[4]}?hasslots=true" tabindex="1">Slots Availability</a>
                            <hr class="separator">
                            <a class="link sub-link" href="/profile" tabindex="1">Profile</a>
                        </div>`
    newLink.addEventListener("mouseenter", dropdownShow)

    // Getting user details by uid to set special links for Admins
    getUserDetails(userId).then((userDetail) => {
        if (userDetail && userDetail.isAdmin) {
            addAdminUserLinks(newLink.querySelector(".dropdown-box"))
        }
        // Deactivate Page Link from nav
        linkDeactivator(header.querySelector(".manage"))
    }).catch(error => console.log(error))
    parent.querySelector(".link.about").after(newLink)
}