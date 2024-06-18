import { header, ANIM, navBackgroundChanger, startAnimation, C_SHOW } from "./common/utils/animations.js"
import { collectFormData, highlightField, showInfo } from "./common/utils/form.js"
import { startProgress } from "./common/utils/animations.js"

// Active Page Animations
const pageAnimator = () => {

    // Header
    header.classList.add(ANIM)
    navBackgroundChanger()

    let scrollPos = window.scrollY, viewPort = window.visualViewport.height - header.offsetHeight
    startAnimation(formContainer.querySelector(".grad-bg"), formContainer, scrollPos, viewPort) // Form Gradient Heading
    startAnimation(contactForm, formContainer, scrollPos, viewPort) // Contact Form
}
const formContainer = document.querySelector("article.form-wrapper")
const contactForm = formContainer.querySelector("form")
window.addEventListener("DOMContentLoaded", pageAnimator)
window.addEventListener("scroll", pageAnimator)

// Form Submission
contactForm.addEventListener("submit", (e) => {
    e.preventDefault()
    let { data, sumtBtn } = collectFormData(e.target, false, false, "tel", true)
    if (data) {
        if (data.cmessage == "") {
            return highlightField(e.target.querySelector("textarea.c-message"), sumtBtn, true, false)
        }
        const progRef = startProgress(data)
        setTimeout(() => {
            showInfo("We got your message!", "complete", progRef, sumtBtn, true)
        }, 2000)
    }
})


// FAQ Show/Hide Script
const faqContainer = document.querySelector(".faqs-container")
faqContainer.querySelectorAll(".question").forEach((ques) => {
    ques.addEventListener("click", () => {
        let showingFAQ = faqContainer.querySelector(`.question.${C_SHOW}`)
        if (showingFAQ) {
            showingFAQ.classList.remove(C_SHOW)
        }
        ques.classList.add(C_SHOW)
    })
})