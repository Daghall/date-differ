/* global document window */
/* eslint-disable no-alert */

const diffToString = require("../lib/diff-to-string.js");
const differ = require("../lib/differ.js");

const eventName = document.getElementById("event-name");
const eventDate = document.getElementById("date");
const addDateButton = document.getElementById("add-date");
const toggleDatePicker = document.getElementById("toggle-datepicker");
const error = document.getElementById("error");
const main = document.querySelector("main > table");
const tableTemplate = document.getElementById("table").content;

const dates = [];
const storedDates = window.localStorage.getItem("dates");

const deltaHelper = {
  nextMonthWithYear(months, years) {
    const nextMonth = months + 1;
    const to = `+${years}y${nextMonth}m`;
    const label = `${years} ${pluralize(years, "year")}, `
    + `${nextMonth} ${pluralize(nextMonth, "month")}`;

    return { to, label };
  },
  nextYear(years) {
    const to = `+${years + 1}y`;
    const label = `${years + 1} years`;

    return { to, label };
  },
  nextMonth(months) {
    const nextMonth = months + 1;
    const to = `+${nextMonth}m`;
    const label = `${nextMonth} ${pluralize(nextMonth, "month")}`;
    return { to, label };
  },
  oneYear() {
    const to = "+1y";
    const label = `1 ${pluralize(1, "year")}`;
    return { to, label };
  },
  nextHalfDecade(years) {
    const extraYears = years % 5 === 4 ? 5 : 0;
    const nextEvenFive = 5 - (years % 5) + extraYears;
    const to = `+${years + nextEvenFive}y`;
    const label = `${years + nextEvenFive} years`;
    return { to, label };
  },
};

if (storedDates) {
  dates.push(...JSON.parse(storedDates));

  renderDates();
} else {
  const h2 = document.createElement("h2");
  h2.textContent = "Add a date to get started";
  main.appendChild(h2);
}

document.addEventListener("keydown", (evt) => {
  if (evt.key === "Enter") {
    addDate();
  }
});

addDateButton.addEventListener("click", addDate);

toggleDatePicker.addEventListener("click", () => {
  const isDatePickerVisible = eventDate.type === "date";
  eventDate.type = isDatePickerVisible ? "text" : "date";
});

function renderDates() {
  clearTables();
  const today = new Date();

  createHeader();

  dates.forEach(({event, date}, index) => {
    const row = document.createElement("tr");
    const eventCell = createCell(event);
    eventCell.addEventListener("click", () => removeDate(index));
    row.appendChild(eventCell);
    row.appendChild(createCell(date));

    renderToday(date, today, row);
    const diff = differ(getDiffObject(date, today));

    const table = document.importNode(tableTemplate, true);
    const tableHeader = table.querySelector("tr");
    main.appendChild(table);

    const deltas = [];
    const years = diff.years ?? 0;
    const months = diff.months ?? 0;

    const isFutureDate = new Date(date) < today;
    if (isFutureDate) {
      if (years > 0) {
        deltas.push(deltaHelper.nextMonthWithYear(months, years));
        deltas.push(deltaHelper.nextYear(years));
      } else {
        deltas.push(deltaHelper.nextMonth(months));
        deltas.push(deltaHelper.oneYear());
      }

      deltas.push(deltaHelper.nextHalfDecade(years));
    }

    deltas.forEach(({label, to}) => {
      tableHeader.appendChild(createHeader(label));
      const newDate = diffToString({from: date, to});
      const diffObject = {from: today, to: newDate};
      const title = `In ${diffToString(diffObject)}`;
      const diffDays = diffToString({...diffObject, days: true});
      row.appendChild(createCell(newDate, title));
      row.appendChild(createCell(formatDays(diffDays), title));
    });

    main.appendChild(row);
    main.appendChild(document.createElement("tr"));
  });
}


function renderToday(date, today, row) {
  const isFutureDate = new Date(date) < today;
  const diffFromToday = diffToString(getDiffObject(date, today));
  const daysFromToday = diffToString(getDiffObject(date, today, true));

  row.appendChild(createCell(`${isFutureDate ? "" : "In "}${diffFromToday}`));
  row.appendChild(createCell(formatDays(daysFromToday)));
}

function getDiffObject(date, today, days = false) {
  const isPassedDate = new Date(date) < today;
  const diffObject =
  isPassedDate
    ? { from: date, to: today }
    : { from: today, to: date };
  if (days) {
    diffObject.days = true;
  }
  return diffObject;
}

function createHeader(label) {
  const header = document.createElement("th");
  header.textContent = label;
  header.colSpan = 2;
  return header;
}

function createCell(text, title) {
  const cell = document.createElement("td");
  cell.textContent = text;

  if (title) {
    cell.title = title;
  }

  return cell;
}

function removeDate(index) {
  if (!window.confirm(`Remove "${ dates.at(index).event}"?`)) return;

  dates.splice(index, 1);
  storeDates();
  renderDates();
}

function clearTables() {
  while (main.lastChild) {
    main.removeChild(main.lastChild);
  }
}

let errorTimeout;
function showError(message) {
  if (message === error.textContent) return;
  clearTimeout(errorTimeout);

  error.textContent = message;
  error.classList.remove("hidden");
  errorTimeout = setTimeout(() => {
    error.classList.add("hidden");
    error.addEventListener("transitionend", () => {
      error.textContent = "";
    }, { once: true });
  }, 3000);
}

function addDate() {
  if (!eventName.value || !eventDate.value) {
    showError("Please fill in both fields");
    return;
  }

  if (!validDate(eventDate.value)) {
    showError("Please enter a valid date");
    return;
  }

  dates.push({
    event: eventName.value,
    date: eventDate.value,
  });

  storeDates();
  clearForm();
  renderDates();
  eventName.focus();
}

function clearForm() {
  eventName.value = "";
  eventDate.value = "";
}

function storeDates() {
  window.localStorage.setItem("dates", JSON.stringify(dates));
}

function validDate(date) {
  return !isNaN(Date.parse(date));
}

// Groups thousands
function formatDays(days) {
  const daysNumber = parseInt(days) || 0;
  return new Intl.NumberFormat("sv-SE").format(Number(daysNumber));
}

function pluralize(count, word) {
  return count === 1 ? word : `${word}s`;
}
