document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token'); // O token de autenticação

    if (!token) {
        window.location.href = '/pages/login.html'; // Redireciona para o login se não estiver autenticado
        return;
    }
    
    const calendarEl = document.getElementById('calendar');

    // Inicializando o FullCalendar
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth', // Modo de visualização
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: function(fetchInfo, successCallback, failureCallback) {
            // Fetching events from the server
            fetch('/admin/calendar', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                // Transformando os dados de reserva em eventos para o calendário
                const events = data.map(reservation => ({
                    title: `Reserva #${reservation.id}`,
                    start: reservation.checkin,
                    end: reservation.checkout,
                    color: reservation.status === 'confirmed' ? 'green' : 'red' // Cor depende do status
                }));
                successCallback(events);
            })
            .catch(error => {
                console.error('Erro ao carregar eventos:', error);
                failureCallback(error);
            });
        }
    });

    calendar.render(); // Renderiza o calendário na página
// Função para carregar e exibir reservas na tabela
function loadReservations() {
    fetch('/api/admin/reservations', { // Atualize este endpoint conforme o necessário
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('formulaire-reservation-gites').querySelector('tbody');
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

// Função para cancelar reservas
function cancelReservation(id) {
    fetch(`/api/admin/reservations/${id}`, { // Atualize este endpoint
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(() => loadReservations());
}

});
