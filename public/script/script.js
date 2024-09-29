// script.js

document.getElementById('reservationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const guests = document.getElementById('guests').value;

    const reservationData = {
        "first_name": name.split(' ')[0],
        "last_name": name.split(' ')[1] || '',
        "booking_datetime": date,
        "covers": guests
    };

    fetch('https://api.popina.com/v1/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer SEU_TOKEN_DE_AUTENTICACAO'
        },
        body: JSON.stringify(reservationData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Réservation confirmée!');
    })
    .catch(error => {
        alert('Erreur lors de la réservation.');
        console.error('Error:', error);
    });
});
