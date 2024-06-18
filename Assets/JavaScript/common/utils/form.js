import { getCurrentPath, REDIRECT_EXCEPTIONS, redirect, toUrlParams } from "./urls.js"
import { header, stopProgress } from "./animations.js"


// Deactivate form submission
export const noSubmit = event => event.preventDefault()

// Search-Box Submit
export const searchBoxSubmit = (e, login = true) => {
    e.preventDefault()
    const currentPage = getCurrentPath()
    if (currentPage != REDIRECT_EXCEPTIONS[4]) {
        let { data } = collectFormData(e.target, false, false, "", true)
        if (data) {
            let goLink = REDIRECT_EXCEPTIONS[4]
            if (login) {
                data = { next: goLink, ...data }
                goLink = REDIRECT_EXCEPTIONS[0]
            }
            redirect(goLink, toUrlParams(data))
        }
    }
}

// Collect Form data
export const collectFormData = (form, hasSelect, includeClearanceOnScroll = false, except = "", noScroll = false) => {
    let data = null
    let isValid = validateForm(form, hasSelect, except)
    let sumtBtn = form.querySelectorAll("input[type=submit]")
    sumtBtn.forEach((btn) => {
        if (window.getComputedStyle(btn).display != "none") {
            sumtBtn = btn
        }
    })
    sumtBtn.disabled = true
    if (isValid[1]) {
        data = Object.fromEntries(new FormData(form).entries())
        form.reset()
    }
    else highlightField(isValid[0], sumtBtn, noScroll, includeClearanceOnScroll)
    return { data: data, sumtBtn: sumtBtn }
}

// Validate Empty Form Fields
const validateForm = (form, select, except) => {
    except = except != "" ? `:not([type=${except}])` : ""
    let inputs = form.querySelectorAll(`input:not([type=submit]):not([type=hidden])${except}`)
    for (let input of inputs) {
        if (input.value == "" || select && isPasswordField(input) && input.value.length < 7) {
            return [input, false]
        }
    }
    if (select) {
        let selectbox = form.querySelector("select")
        if (selectbox.value == "") return [selectbox, false]
    }
    return [null, true]
}
const isPasswordField = (input) => {
    return input.classList.contains("u-password")
}

// Highlight Input Field
export const C_EMPTY = "empty"
export const highlightField = (field, sumtBtn, noScroll, scrollOffset) => {
    let emptyField = field.type == "file" ? field.parentElement : field
    emptyField.classList.add(C_EMPTY)
    emptyField.focus()
    if (noScroll === false) {
        if (scrollOffset) scrollOffset = header.scrollHeight + field.offsetHeight
        document.documentElement.scrollTop = (field.offsetTop == 0 ? field.parentElement.offsetTop : field.offsetTop) - scrollOffset
    }
    field.oninput = () => {
        emptyField.classList.remove(C_EMPTY)
        field.oninput = null
        sumtBtn.disabled = false
    }
}

// Show Success/Error status
const popup = document.querySelector("#pop-up")
export const showInfo = (message, status, progRef, sumtBtn, delay = null) => {
    stopProgress(progRef)
    let tag = status == "complete" ? "success" : "error"
    let element = popup.querySelector(`.info.${tag} .text`)
    element.innerHTML = message
    popup.classList.add(status)
    if (delay) {
        setTimeout(() => {
            popup.classList.remove(status)
            element.innerHTML = ""
            if (sumtBtn) sumtBtn.disabled = false
        }, 3000)
    }
}

export const switchFormState = (form, inputCallback, readonly, textarea = null, select = null) => {
    const focusIn = readonly ? -1 : 1
    let inputs = form.querySelectorAll("input:not([type=submit]):not([type=button])")
    for (let input of inputs) {
        if (input.hidden) {
            input = input.parentElement
            readonly ? input.removeEventListener("click", inputCallback) : input.addEventListener("click", inputCallback)
        }
        else input.readOnly = readonly
        input.tabIndex = focusIn
    }
    if (select) {
        select = form.querySelector("select")
        select.readOnly = readonly
        select.tabIndex = focusIn
    }
    if (textarea) {
        textarea = form.querySelector("textarea")
        textarea.readOnly = readonly
        textarea.tabIndex = focusIn
    }
}