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
            dayButton.classList.add("today"); // gives the current day button a beige outline
        }

        if (
            isPastDate(currentYear, currentMonth, day) ||
            isClosedDay(currentYear, currentMonth, day)
        ) {
            dayButton.classList.add("disabled"); // greys out the buttons for past days and Sundays when closed
        }
        
        if (
            selectedDate &&
            selectedDate.year === currentYear &&
            selectedDate.month === currentMonth &&
            selectedDate.day === day
        ) {
            dayButton.classList.add("selected"); // highlights the button for the currently selected date
        }
        
        // The click handler (a closure)
        dayButton.addEventListener("click", () => {
            if (isPastDate(currentYear, currentMonth, day)) return; // Guard clause to prevent selecting past dates
            if (isClosedDay(currentYear, currentMonth, day)) return; // Guard clause to prevent selecting closed days (Sundays)
            selectedDate = { //fills in the key/value pairs based on the date selected by the user
                year: currentYear, // 2026
                month: currentMonth, // August
                day: day, // 18
                key: dateKey, // "2026-08-18" format
            }; // this object is used to store the appointments and prevent double-booking (lines 280-290)
            selectedTime = "";
            selectedTimeInput.value = "";
            selectedDateText.textContent = formatReadableDate( // 0-indexed
                currentYear, 
                currentMonth, 
                day,
            ); // updates the text above the time slots to show the selected date in a human-readable format
            renderCalendar(); // re-renders the calendar to update the selected date button's styling
            renderTimeSlots(); // re-renders the time slots to show the available slots for the newly selected date
            bookingMessage.textContent = ""; // clears any previous booking messages when a new date is selected
            bookingMessage.className = "booking-message";
        });
        calendarGrid.appendChild(dayButton); // where all buttons are added to the calendar grid
    }    
};

// ----- Render Time Slots -----
const renderTimeSlots = () => { // fills in the time-slot buttons for whatever date the user picked
    if (!timeSlots) return; // Guard clause to ensure timeSlots and selectedDate are available
    timeSlots.innerHTML = "";
    if (!selectedDate) { // catches if the date wasn't selected first, forces date selection before timeslot
        timeSlots.innerHTML = `<p class="selected-date-text">Choose a date first.</p>`
        return;
    }
    const slots = getSlotsForDate( // passes available hours for the day against date selected by user
        selectedDate.year,
        selectedDate.month,
        selectedDate.day,
    );
    const bookedForDay = bookedAppointments[selectedDate.key] || []; // looks up what time are already booked for this specific date. Returns undefined if nothing's been booked yet. Undefined is falsy and we can't return undefined because the.includes() we use with this later in the code would crash, so we use the || operator to substitute for an empty array []; instead.
    // checks if there are previous bookings for the selected date and if not, returns an empty array
    if (slots.length === 0) {
        timeSlots.innerHTML = `<p class="selected-date-text">No appointments available for this date.</p>`; // a redundancy just in case the CSS class(disabled) or JS Guard gets loosened later by another dev (real-world thinking)
        return; // shows a "no appointments available" message and exits early, skipping the loop that would try to render time slot buttons
    } // important distinction slots = shop's hours that day (empty on Sundays), bookedForDay = which of those hours are already taken (used later to disable specific buttons for time slots already booked)
    for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];
        const slotBtn = document.createElement("button");
        slotBtn.type = "button";
        slotBtn.textContent = slot;
        slotBtn.className = "time-slot-btn";
        if (bookedForDay.includes(slot)) {
            slotBtn.classList.add("disabled");
            slotBtn.disabled = true;
            slotBtn.textContent = `{slot} - Booked`;
        }
        if (selectedTime === slot) {
            slotBtn.classList.add("selected");
        }
        slotBtn.addEventListener("click", () => {
            selectedTime = slot;
            selectedTimeInput.value = slot;
            renderTimeSlots();
        });
        timeSlots.appendChild(slotBtn);
    }
};   

// ----- Month Navigation -----
if (prevMonthBtn) {
    prevMonthBtn.addEventListener("click", () => {
        currentMonth--; // decrements the month by 1 on click
        if (currentMonth < 0) { // handles year boundary
            currentMonth = 11; // if month is Jan(0) and is decremented it doesn't go to -1 but 11 (Dec)
            currentYear--; // decrements the year by 1    
        }
        renderCalendar(); // re-runs renderCalendar() 
    });
}
if (nextMonthBtn) {
    nextMonthBtn.addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) { 
            currentMonth = 0; 
            currentYear++;    
        }
        renderCalendar(); // re-runs renderCalendar() 
    });
}

// ----- Booking Submit -----
if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
        event.preventDefault(); // prevents default behaviors for all events
        const nameValue = customerName.value.trim(); // trim() strips whitespace around a string (e.g. " Tyler " becomes "Tyler") prevents copy and paste spaces from being inclused as part of their name
        const serviceValue = customerService.value;
        const timeValue = selectedTimeInput.value;
        if (
            nameValue === "" ||
            serviceValue === "" ||
            !selectedDate ||
            timeValue === ""
        ) {
            bookingMessage.textContent =
                "Please choose a date, time, name, and service.";
            bookingMessage.className = "booking-message error"
            return;
        }
        if (!bookedAppointments[selectedDate.key]) { // reads as "if there's no array yet for this date..."
            bookedAppointments[selectedDate.key] = []; // ... then create one
        }
        if (bookedAppointments[selectedDate.key].includes(timeValue)) {
            bookingMessage.textContent =
                "That time was just taken. Please choose another.";
            bookingMessage.className = "booking-message error";
            renderTimeSlots();
            return;
        }
        bookedAppointments[selectedDate.key].push(timeValue); // push() adds the time selected to the end of the booked appointments array
        bookingMessage.textContent = `${nameValue}, your ${serviceValue} appointment is booked for ${formatReadableDate(
            selectedDate.year,
            selectedDate.month,
            selectedDate.day,
        )} at ${timeValue}.`;
        bookingMessage.className = "booking-message success";
        bookingForm.reset();
        selectedTime = "";
        selectedTimeInput.value = "";
        renderTimeSlots();
    });
}

// ----- App Start -----
renderCalendar();
renderTimeSlots();