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

// ----- Services Data (array of objects) -----
const services = [
    {
        title: "Classic Haircut",
        description: "Timeless cuts with modern precision tailored to your style.",
        image: "assets/images/feature-1.jpg",
        alt: "Classic Haircut"
    },
    {
        title: "Beard Trim",
        description: "Shape and line up your beard for clean, sharp finish.",
        image: "assets/images/feature-2.jpg",
        alt: "Beard trim"
    },
    {
        title: "Straight Razor Shave",
        description: "Hot towel, smooth shave, and classic barbershop experience.",
        image: "assets/images/feature-3.jpg",
        alt: "Straight razor shave"
    }
];

// ----- Render Services using forEach -----
const renderFeatures = () => {
    if (!featureGrid) return; // if the featureGrid is not found, don't return an error, just exit the function
    services.forEach(service => {
        const card = document.createElement("article"); // creation of the article element for each service card
        card.classList.add("feature-card"); // adding a class to the article element
        card.innerHTML = `
            <img src="${service.image}" alt="${service.title}" class="feature-img"/>
            <h3 class="feature-title">${service.title}</h3>
            <p class="feature-description">${service.description}</p>
        `;
        featureGrid.appendChild(card); // In this example, appendChild() adds the newly created card to the bottom of the list of the featureGrid element in the DOM
    });
};

// ----- Helpers / Functions -----
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

renderFeatures(); // Call the function to render the features on page load
