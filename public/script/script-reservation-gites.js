document.addEventListener('DOMContentLoaded', function () {
    const reservationForm = document.getElementById('reservationForm');
    const guestsInput = document.getElementById('guests');
    const capacityInfo = document.getElementById('capacityInfo');
    const giteSelect = document.getElementById('gite');

    // Capacidades máximas dos gîtes
    const giteCapacities = {
        'chic-cosy': 2,  // Gîte Chic et Cosy pode acomodar até 2 pessoas
        'studio-vert': 6 // Studio au Vert pode acomodar até 6 pessoas
    };

    // Atualizar o campo de capacidade máxima baseado na seleção do gîte
    function updateCapacityInfo() {
        const gite = giteSelect.value;
        const maxGuests = giteCapacities[gite];
        guestsInput.max = maxGuests;  // Definir o valor máximo permitido no campo
        guestsInput.value = maxGuests;  // Preencher automaticamente o valor máximo
        capacityInfo.textContent = `Capacité maximale : ${maxGuests} personnes.`;
    }

    // Inicializar a capacidade ao carregar a página
    if (giteSelect) {
        updateCapacityInfo();
        giteSelect.addEventListener('change', updateCapacityInfo);
    }

    // Verificar se o formulário de reserva de gîtes existe na página
    if (reservationForm) {
        reservationForm.addEventListener('submit', function (event) {
            event.preventDefault();  // Prevenir envio padrão do formulário

            // Capturar valores dos campos do formulário
            const gite = giteSelect.value;
            const checkin = document.getElementById('checkin').value;
            const checkout = document.getElementById('checkout').value;
            const guests = parseInt(guestsInput.value, 10);
            const name = document.getElementById('name').value;
            const telephone = document.getElementById('telephone').value;
            const email = document.getElementById('email').value;
            const observations = document.getElementById('observations') ? document.getElementById('observations').value : '';

            // Verificar se o número de convidados excede a capacidade do gîte
            if (guests > giteCapacities[gite]) {
                document.getElementById('errorMessage').textContent = `Le gîte ${gite} ne peut accueillir que ${giteCapacities[gite]} personnes au maximum.`;
                return; // Interrompe o envio do formulário
            }

            // Dados da reserva a serem enviados
            const reservationData = {
                "gite": gite,
                "checkin": checkin,
                "checkout": checkout,
                "guests": guests,
                "name": name,
                "telephone": telephone,
                "email": email,
                "observations": observations // Campo de observações adicionado
            };

            // Enviar dados via POST para o servidor
            fetch('/reservar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservationData)
            })
            .then(response => response.json())
            .then(data => {
                // Exibir mensagem de sucesso
                if (data.message) {
                    alert(data.message);
                } else {
                    alert('Réservation confirmée!');
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert('Erreur lors de la réservation.');
            });
        });
    }
});
