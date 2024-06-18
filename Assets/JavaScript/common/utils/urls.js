
// Get current page link
export const getCurrentPath = () => {
    let path = window.location.pathname
    if (path == "/") {
        return path
    }
    return path.startsWith("/") ? path.slice(1) : path
}

// Deactivate the current page Link in passed in Element
export const C_ACTIVE = "active"
export const linkDeactivator = (element) => {
    let currentPath = getCurrentPath().split("-").join(" ").replace(".html", "")
    let deactivated = false
    const HOMEPAGES = ["/", "index"]
    const EXCEPTIONS = ["contact", "manage", "locate"]
    const authNavLinks = {
        "manage bunks": "ev bunk details",
        "locate charger": "slots availability",
    }
    const isLocateCharger = Object.keys(authNavLinks).indexOf(currentPath) == 1
    const hasFilter = getParam("hasslots") == "true"

    element.querySelectorAll("a.link").forEach((link) => {
        let pageLink = link.innerHTML.toLowerCase()
        if ((isLocateCharger === false || isLocateCharger && hasFilter === false) && pageLink == currentPath
            || HOMEPAGES.indexOf(currentPath) >= 0 && pageLink == "home"
            || EXCEPTIONS[0] == currentPath && pageLink.startsWith(EXCEPTIONS[0])
            || element.classList.contains(EXCEPTIONS[1]) &&
            (authNavLinks[currentPath] == pageLink && isLocateCharger === false || authNavLinks[currentPath] == pageLink && isLocateCharger && hasFilter)) {
            link.classList.add(C_ACTIVE)
            link.removeAttribute("href")
            if (link.parentElement.classList.contains("dropdown-box")) {
                link.parentElement.parentElement.classList.add(C_ACTIVE)
            }
            deactivated = true
        }
    })
    return deactivated
}

// Validate redirect Link
export const REDIRECT_EXCEPTIONS = ["login", "register", "error", "manage-bunks", "locate-charger", "profile"]
export const getValidRedirectLink = (link = null, except = null) => {
    if (link == null) link = getCurrentPath()
    if (except && except.indexOf(link) >= 0 || REDIRECT_EXCEPTIONS.includes(link) === false) {
        return link
    }
    return null
}

// Set redirect link
export const assignRedirectLink = (goLink, rLink) => {
    if (goLink.startsWith("./")) {
        goLink = goLink.slice(2)
    }
    let data = { next: rLink }
    window.location.assign(`${goLink}?${toUrlParams(data)}`)
}

// Generate search parameters
export const toUrlParams = (data) => {
    return new URLSearchParams(data).toString()
}

// Get search parameters
export const getParam = (key, onlyValue = true) => {
    let value = new URLSearchParams(window.location.search).get(key)
    if (onlyValue === false) {
        if (value != null) {
            value = `${key}=${value}`
        }
        else value = ""
    }
    return value
}

// Redirect to path with/without search queries
export const HOME = "/"
export const redirect = (to, sQuery = "") => {
    if (to == null) {
        to = HOME
    }
    sQuery = sQuery != "" ? `?${sQuery}` : sQuery
    window.location.assign(to + sQuery)
}

// Clear Blob image url from localstorage & its reference
export const K_BLOBIMG = "newBlobImage"
export const clearImageBlob = (blobUrl) => {
    blobUrl = (blobUrl == null) ? window.localStorage.getItem(K_BLOBIMG) : blobUrl
    if (blobUrl != null && blobUrl != "") {
        URL.revokeObjectURL(blobUrl)
        window.localStorage.removeItem(K_BLOBIMG)
    }
}