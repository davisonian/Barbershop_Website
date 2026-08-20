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
const heroSubtext = document.getElementById("heroSubtext");
const ctaText = document.getElementById("ctaText");
const hoursList = document.getElementById("hoursList");

// ----- Modal Elements -----
const serviceModal = document.getElementById("serviceModal");
const serviceModalOverlay = document.getElementById("serviceModalOverlay");
const serviceModalClose = document.getElementById("serviceModalClose");
const serviceModalTitle = document.getElementById("serviceModalTitle");
const serviceModalPrice = document.getElementById("serviceModalPrice");
const serviceModalList = document.getElementById("serviceModalList");

// ----- Services Data (Array of Objects) -----
const services = [
    {
        id: 1,
        title: "Classic Haircut",
        image: "assets/images/feature-7.jpg",
        alt: "Classic Haircut",
        description: "Timeless cuts with modern precision-tailored to your style.",
        price: 25,
        popular: true,
        details: [
            "Consultation with your barber before the cut begins.",
            "Hair sectioning and shape-up based on your preferred style.",
            "Professional clippers, trimmers, and shears used for precision.",
            "Neckline cleanup and finishing touches included.",
            "Light styling product applied for a clean final look.",
        ],
    },
    {
        id: 2,
        title: "Beard Trim",
        image: "assets/images/feature-4.jpeg",
        alt: "Beard Trim",
        description: "Shape, line-up, and refine your beard for a clean finish.",
        price: 15,
        popular: false,
        details: [
            "Beard assessment and shaping based on facial structure.",
            "Line-up around cheeks, jawline, and neckline.",
            "Trimmers and detail tools used for crisp edges.",
            "Conditioning beard product may be applied for softness.",
            "Final symmetry check for a polished finish.",
        ],
    },
    {
        id: 3,
        title: "Straight Razor Shave",
        image: "assets/images/feature-3.jpg",
        alt: "Straight Razor Shave",
        description: "Hot towel, smooth shave, and classic barbershop experience.",
        price: 30,
        popular: true,
        details: [
            "Hot towel prep to soften facial hair and open pores.",
            "Premium shaving cream or lather applied to protect the skin.",
            "Straight razor shave performed with careful detailing.",
            "Second hot towel may be used for comfort and cleanup.",
            "Aftershave or soothing skin product applied after service.",
        ],
    },
    {
        id: 4,
        title: "Fade & Style",
        image: "assets/images/feature-2.jpg",
        alt: "Fade Haircut",
        description: "A clean fade with finishing detail for a sharp, modern look.",
        price: 35,
        popular: false,
        details: [
            "Style consultation before clipper work begins.",
            "Fade blended to your preferred level and finish.",
            "Detailing around temples, neckline, and beard area if needed.",
            "Scissors and clipper-over-comb may be used for texture.",
            "Styling product added to complete the final look.",
        ],
    },
    {
        id: 5,
        title: "Kids Cut",
        image: "assets/images/feature-5.jpg",
        alt: "Kids Haircut",
        description: "Clean, comfortable haircut service for younger clients.",
        price: 20,
        popular: false,
        details: [
            "Simple consultation with child and parent if needed.",
            "Age-appropriate haircut with comfort in mind.",
            "Careful clipper and scissor work for a clean finish.",
            "Light cleanup around the neckline and ears.",
            "Styled neatly before leaving the chair.",
        ],
    },
    {
        id: 6,
        title: "Head Shave",
        image: "assets/images/feature-6.jpg",
        alt: "Head Shave",
        description: "Smooth head shave with classic barbershop treatment.",
        price: 28,
        popular: true,
        details: [
            "Scalp prep with warm towel treatment.",
            "Protective shave product applied before razor work.",
            "Close shave performed for a smooth finish.",
            "Scalp cleaned and checked for even consistency.",
            "Moisturizing scalp product applied after the shave.",
        ],
    },
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
// const renderFeaturesMap = () => {
//     const cardsHTML = services.map((service) => {
//         return `
//             <article class="feature-card">
//             <img src="${service.image}" alt="${service.title}" class="feature-img"/>
//             <h3 class="feature-title">${service.title}</h3>
//             <p class="feature-text">${service.text}</p>
//             </article>
//         `;
//     }).join(""); // takes the items of an array and joins them together into a single string, with no separator between them ("")

//     featureGrid.innerHTML = cardsHTML;
// }; // innerHTML removes the quotation marks and renders the HTML in the DOM, instead of just displaying it as text

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

const renderServices = () => {
    if (!featureGrid) return;
    const servicesHTML = services.map((service) => {
        const badgeHTML = service.popular ? `<p class="service-badge">Popular Choice</p>`: `<p class="service-badge alt-badge">Barber Favorite</p>`;
        return `
        <article class="feature-card">
        <img
        src="${service.image}"
        alt="${service.alt}"
        class="feature-img"
        />
        <h3 class="feature-title">${service.title}</h3>
        <p class="feature-text">${service.description}</p>
        ${badgeHTML}
        <p class="service-price">$${service.price}</p>
        <div class="service-actions">
        <button
        class="service-details-btn"
        type="button"
        data-service-id="${service.id}"
        >
        View Details
        </button>
        </div>
        </article>
        `;
    })
    .join("");
    featureGrid.innerHTML = servicesHTML;
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

const updateSubText = (newText) => {
    if (!heroSubtext) return;
    heroSubtext.textContent = newText;
};

// ----- Modal Logic -----
const openServiceModal = (serviceId) => {
    if (
        !serviceModal ||
        !serviceModalTitle ||
        !serviceModalPrice ||
        !serviceModalList
    )
        return;

        // find() iterates through the array and grabs the first matching object based on the id number
    const selectedService = services.find(
        (service) => service.id === Number(serviceId), // Number() takes the string that is returned from the serviceId and converts it back to a number
    );
    if (!selectedService) return;
    serviceModalTitle.textContent = selectedService.title;
    serviceModalPrice.textContent = `$${selectedService.price}`;
    serviceModalList.innerHTML = selectedService.details.map((detail) => `<li>${detail}</li>`)
        .join("");
    serviceModal.classList.add("is-open");
    serviceModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
};
const closeServiceModal = () => {
    if (!serviceModal) return;
    serviceModal.classList.remove("is-open");
    serviceModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
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
// renderFeaturesMap(); // Call the function to render the features on page load using map()
renderNavigation(); // Call the function to render the navigation links on page load using map()
handleHeaderOnScroll(); // Runs once on page load in case the user refreshes the page while scrolled down, so the header is styled correctly
renderServices();
// renderHours();
// renderContactInfo();
// checkIfOpen();