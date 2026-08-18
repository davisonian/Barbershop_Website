// =========================
// File: js/calendar.js
// Dynamic Booking Calendar
// =========================
// ----- DOM Elements -----
const calendarGrid = document.getElementById("calendarGrid");
const calendarMonthLabel = document.getElementById("calendarMonthLabel");
const prevMonthBtn = document.getElementById("prevMonthBtn");
const nextMonthBtn = document.getElementById("nextMonthBtn");
const selectedDateText = document.getElementById("selectedDateText");
const timeSlots = document.getElementById("timeSlots");
const bookingForm = document.getElementById("bookingForm");
const customerName = document.getElementById("customerName");
const customerService = document.getElementById("customerService");
const selectedTimeInput = document.getElementById("selectedTimeInput");
const bookingMessage = document.getElementById("bookingMessage");

// ----- Calendar State -----
const today = new Date(); // 0-indexed months, so January is 0, February is 1, etc. Days of the week are also 0-indexed, so Sunday is 0, Monday is 1, etc.
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectedDate = null; // Value will be set when a user clicks on a date in the calendar.
let selectedTime = ""; // Will return in "00:00" format when a user clicks on a time slot. Some methods we will use only work on strings, so we will store the time as a string for now. We can convert it to a Date object later if needed.

// ----- Time Slot Data -----
const weekdaySlots = [ // hours open for appointments on weekdays (Monday to Friday)
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM"
];
const saturdaySlots = [ // hours open for appointments on Saturdays
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM"
];

// Example booked data for practice
const bookedAppointments = {
    "2026-03-28": ["10:00 AM", "2:00 PM"],
    "2026-03-29": [],
};

// ----- Helpers -----
const getMonthName = (monthIndex) => {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[monthIndex];
};

const formatDateKey = (year, month, day) => {
    const safeMonth = String(month + 1).padStart(2, "0"); // JavaScript's Date object uses 0-indexed months, so we add 1 to get the correct month number. This function expects a "human" month (1-12) as input, so we add 1 to the month index to get the correct month number. We also pad the month with a leading zero if it's a single digit.
    const safeDay = String(day).padStart(2, "0"); //Pads the string on the left with a leading zero if the day is a single digit. This ensures that the date key is always in the format "YYYY-MM-DD", which is important for consistency when storing and retrieving booked appointments from the bookedAppointments object.
    return `${year}-${safeMonth}-${safeDay}`;
};

const formatReadableDate = (year, month, day) => {
    const date = new Date(year, month, day);
    return date.toLocaleDateString("en-US", {
        weekday: "long", // full name of the day of the week (e.g., "Monday")
        month: "long", // full name of the month (e.g., "January")
        day: "numeric", // day of the month as a number (e.g., "1", "2", "3")
        year: "numeric" //full 4-digit year (e.g., "2026")
    });
}; // formatReadableDate() and new Date() use 0-indexed months.
// Internally, months are being passed around as 0-indexed to stay consistent with JavaScript's Date object, but when displaying the date to the user, we convert it to a human-readable format using toLocaleDateString().

const isPastDate = (year, month, day) => { // function used to determine which day buttons should be disabled in the calendar. It takes a year, month, and day as input and returns true if the date is in the past, and false if it's today or in the future.
    const compareDate = new Date(year, month, day);
    compareDate.setHours(0, 0, 0, 0); // Set the time to midnight for accurate comparison
    const todayOnly = new Date();
    todayOnly.setHours(0, 0, 0, 0);
    return compareDate < todayOnly; // returns a boolean value (true/false) for later functions or if statements to use.
};

const isClosedDay = (year, month, day) => { // used to add the disabled class to all Sundays buttons in later if else statements.
    const date = new Date(year, month, day);
    const weekday = date.getDay();
    if (weekday === 0) { // Sunday
        return true; // Closed on Sundays
    }
    return false; // Open on other days
};  

const getSlotsForDate = (year, month, day) => { // function used to determine which time slots should be displayed for a given date. It takes a year, month, and day as input and returns an array of available time slots for that date.
    const date = new Date(year, month, day);
    const weekday = date.getDay();
    if (weekday === 6) { // Saturday
        return saturdaySlots;
    }
    if (weekday === 0) {
        return []; // Closed on Sundays
    }
    return weekdaySlots; // Weekdays (Monday to Friday)
};

// ----- Render Calendar -----
const renderCalendar = () => {
    // The guard clause
    if (!calendarGrid || !calendarMonthLabel) return;
    // If the calendar is not (!) available, don't run!
    // if the monthLabel is not (!) available, don't run!

    // Update the label and clear old content
    calendarMonthLabel.textContent = `${getMonthName(currentMonth)} ${currentYear}`; // gets the month from the currentMonth variable as a number and passes it to the getMonthName function as an argument.
    calendarGrid.innerHTML = ""; // Clear the old calendar grid content before rendering the new one.

    // Figuring out the grid shape
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // not 0-indexed. currentMonth, 1 starts on the first day of the month.
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // 0-indexed.

    // Padding with empty cells
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.className = "calendar-empty";
        calendarGrid.appendChild(emptyCell);
    }

    // Building each day button
    for (let day = 1; day <= daysInMonth; day++) {
        const dayButton = document.createElement("button");
        dayButton.textContent = day;
        dayButton.className = "calendar-day";
        const dateKey = formatDateKey(currentYear, currentMonth, day); // formatDateKey() returns a string in the format "YYYY-MM-DD" for the given year, month, and day. This string is used as a key to check if there are any booked appointments for that date in the bookedAppointments object.

        // Conditionally adding classes (styling hooks based on state)
        if (
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        ) {
            dayButton.classList.add("is-today");
        }
    
    };
    
};