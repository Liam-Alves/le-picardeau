document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: '/admin/calendar',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    calendar.render();

    function loadReservations() {
        fetch('/admin/reservations', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('reservations-table').querySelector('tbody');
            tableBody.innerHTML = '';
            data.forEach(reservation => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${reservation.id}</td>
                    <td>${reservation.checkin}</td>
                    <td>${reservation.checkout}</td>
                    <td>${reservation.guests}</td>
                    <td>${reservation.status}</td>
                    <td><button onclick="cancelReservation(${reservation.id})">Cancelar</button></td>
                `;
                tableBody.appendChild(row);
            });
        });
    }

    function cancelReservation(id) {
        fetch(`/admin/reservations/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(() => loadReservations());
    }

    loadReservations();
});
