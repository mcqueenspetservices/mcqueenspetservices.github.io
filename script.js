const calendarBody = document.querySelector('.calendar-body');
const monthYear = document.querySelector('.month-year');
const prevMonthButton = document.querySelector('.button:first-child');
const nextMonthButton = document.querySelector('.button:last-child');

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

fetch('bookings.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(nonAvailabilityDates => {
    createCalendar(currentYear, currentMonth, nonAvailabilityDates);
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
    calendarBody.innerHTML = '<p>Failed to load calendar data.</p>';
  });

function createCalendar(year, month, nonAvailabilityDates) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    let html = '<table><tr>';
    daysOfWeek.forEach(day => {
        html += `<th>${day}</th>`;
    });
    html += '</tr><tr>';

    for (let i = 0; i < firstDay; i++) {
        html += '<td></td>';
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dayOfWeek = (firstDay + i - 1) % 7;
        let status = nonAvailabilityDates[year] && nonAvailabilityDates[year][month] && nonAvailabilityDates[year][month][i] ? nonAvailabilityDates[year][month][i] : '';
        if (dayOfWeek === 2 || dayOfWeek === 3) { // Tuesday or Wednesday
            status = status || "Not Available"; // Mark as Booked if no other status
        }
        let className = '';
        if (status === "Booked") className = 'booked';
        else if (status === "Holiday" || status === "Christmas Eve" || status === "Christmas Day") className = 'holiday';
        else if (status === "Not Available") className = 'not-available';

        html += `<td class="${className}"><div class="date">${i}</div> <div class="status">${status}</div></td>`;
        if ((i + firstDay) % 7 === 0) {
            html += '</tr><tr>';
        }
    }

    const remainingDays = 7 - (daysInMonth + firstDay) % 7;
    if (remainingDays < 7) {
        for (let i = 0; i < remainingDays; i++) {
            html += '<td></td>';
        }
    }

    html += '</tr></table>';
    calendarBody.innerHTML = html;
    monthYear.textContent = `${new Date(year, month).toLocaleString('default', { month: 'long' })} ${year}`;
}

function changeMonth(offset) {
    currentMonth += offset;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    createCalendar(currentYear, currentMonth);
}

prevMonthButton.addEventListener('click', () => changeMonth(-1));
nextMonthButton.addEventListener('click', () => changeMonth(1));
