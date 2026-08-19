// =========================
// File: js/main.js
// Vintage Barbershop Project
// =========================
// ----- DOM Elements -----
const yearE1 = document.getElementById("year");
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const ctaBtn = document.getElementById("ctaBtn");
const callBtn = document.getElementById("callBtn");
const phoneLink = document.getElementById("phoneLink"); // we won't be using an actual phone feature
const heading = document.getElementById("heroHeading");
const featureGrid = document.getElementById("featureGrid");
const nav = document.getElementById("nav");
const siteHeader = document.querySelector(".site-header");

// ----- Services Data (array of objects) -----
const services = [
    {
        title: "Classic Haircut",
        text: "Timeless cuts with modern precision tailored to your style.",
        image: "assets/images/feature-1.jpg",
        alt: "Classic Haircut"
    },
    {
        title: "Beard Trim",
        text: "Shape and line up your beard for clean, sharp finish.",
        image: "assets/images/feature-2.jpg",
        alt: "Beard trim"
    },
    {
        title: "Straight Razor Shave",
        text: "Hot towel, smooth shave, and classic barbershop experience.",
        image: "assets/images/feature-3.jpg",
        alt: "Straight razor shave"
    }
];

// ----- Navigation Data (Array of Objects) -----
const navLinks = [
    { label: "Home", href: "#hero" },
    { label: "Services", href: "#features" },
    { label: "Book", href: "#cta" },
    { label: "Contact", href: "#footer" }
]; // #'s are placeholders since we don't have anywhere for these links to go

// ----- Render Services using forEach -----
// const renderFeatures = () => {
//     if (!featureGrid) return; // if the featureGrid is not found, don't return an error, just exit the function
//     services.forEach(service => {
//         const card = document.createElement("article"); // creation of the article element for each service card
//         card.classList.add("feature-card"); // adding a class to the article element
//         card.innerHTML = `
//             <img src="${service.image}" alt="${service.title}" class="feature-img"/>
//             <h3 class="feature-title">${service.title}</h3>
//             <p class="feature-text">${service.text}</p>
//         `;
//         featureGrid.appendChild(card); // In this example, appendChild() adds the newly created card to the bottom of the list of the featureGrid element in the DOM
//     });
// };

// Breakdown:
// array.forEach(item => { ... }) is a method that executes a provided function once for each array element. In this case, for each service in the services array, we create a new article element, add a class to it, set its inner HTML to include the service's image, title, and description, and then append it to the featureGrid element in the DOM.

// ----- Render Features using map() -----
const renderFeaturesMap = () => {
    const cardsHTML = services.map((service) => {
        return `
            <article class="feature-card">
            <img src="${service.image}" alt="${service.title}" class="feature-img"/>
            <h3 class="feature-title">${service.title}</h3>
            <p class="feature-text">${service.text}</p>
            </article>
        `;
    }).join(""); // takes the items of an array and joins them together into a single string, with no separator between them ("")

    featureGrid.innerHTML = cardsHTML;
}; // innerHTML removes the quotation marks and renders the HTML in the DOM, instead of just displaying it as text

// Breakdown:
// array.map(item => { ... }) is a method that creates a new array populated with the results of calling a provided function on every element in the calling array. In this case, for each service in the services array, we return a string of HTML representing the service card. The join("") method is then used to concatenate all the strings into one single string without any separators. Finally, we set the innerHTML of the featureGrid element to this concatenated string, effectively rendering all the service cards in the DOM.

// ----- Render Navigation using map() -----
const renderNavigation = () => {
    // Desktop Navigation Links
    if (nav) {
        const navHTML = navLinks.map((link) => {
            return `
                <a href="${link.href}" class="nav-link">${link.label}</a>
            `;
        }).join("");

        nav.innerHTML = navHTML;
    }

    // Mobile Navigation Links
    if (mobileMenu) {
        const mobileHTML = navLinks.map((link) => {
            return `
                <a href="${link.href}" class="mobile-link">${link.label}</a>
            `;
        }).join("");

        mobileMenu.innerHTML = mobileHTML;
    }
};

// What we just learned:
// Skills               Concept
//
// Object Arrays        Data Structure
// forEach()            Iteration
// map()                Transforms Data
// Template Literals    Dynamic HTML
// DOM Rendering        UI Generation

// ----- Helpers / Functions -----

const handleHeaderOnScroll = () => {
    if (!siteHeader) return;
    if (window.scrollY > 10) {
        siteHeader.classList.add("is-scrolled");
    } else {
        siteHeader.classList.remove("is-scrolled");
    }
};

// Update footer year automatically
const setCurrentYear = () => {
    const now = new Date();
    yearE1.textContent = now.getFullYear();
};

// Toggle mobile menu open/close
let isMenuOpen = false;
const toggleMobileMenu = () => {
    if (!mobileMenu) return;
    if (isMenuOpen === false) {
        mobileMenu.classList.add("is-open");
        isMenuOpen = true;
    } else {
        mobileMenu.classList.remove("is-open");
        isMenuOpen = false;
    }
};

// Close mobile menu (used when a link is clicked)
const closeMobileMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("is-open");
    isMenuOpen = false;
};

//Reusable function with parameters (practice pattern)
const updateHeadingText = (newText) => {
    if (!heading) return;
    heading.textContent = newText;
};

// ----- Event Listeners -----
// 1) Set year on page load
setCurrentYear();

// 2) Hamburger menu toggle
if (menuBtn) {
    menuBtn.addEventListener("click", () => { // adding eventListeners to the toggleMobileMenu()
        toggleMobileMenu();
    });
}

// 3) Close mobile menu when a mobile link is clicked (event delegation)
if (mobileMenu) {
    mobileMenu.addEventListener("click", (event) => { // adding eventListeners to the closeMobileMenu()
        // If they clicked an <a> inside the menu, close it
        if (event.target.tagName === "A") { // event represents the event that was triggered, target is what was triggered, tagName is the specific element name that was targeted and returns a capital letter(s), 
            closeMobileMenu();
        }
    });
}

// 4) CTA Button: "Book Now" (placeholder behavior)
if (ctaBtn) {
    ctaBtn.addEventListener("click", () => {
        updateHeadingText("Booking coming next - great choice!");
    });
}

// 5) Call Button: try to use the phone number in the footer
if (callBtn) {
    callBtn.addEventListener("click", () => {
        // If you later set phoneLink href to tel:, this will work perfectly.
        // For now, this is a beginner-friendly placeholder.
        if (phoneLink) {
            updateHeadingText("Call us at " + phoneLink.textContent);
        } else {
            updateHeadingText("Call feature coming next!");
        }
    });
}

// 6) Changes header behavior on scroll
window.addEventListener("scroll", handleHeaderOnScroll);

// Function Calls -----
// renderFeatures(); // Call the function to render the features on page load
renderFeaturesMap(); // Call the function to render the features on page load using map()
renderNavigation(); // Call the function to render the navigation links on page load using map()
handleHeaderOnScroll(); // Runs once on page load in case the user refreshes the page while scrolled down, so the header is styled correctly