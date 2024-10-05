document.addEventListener('DOMContentLoaded', function () {
    const reservationForm = document.getElementById('reservationForm');
    const guestsInput = document.getElementById('guests');
    const capacityInfo = document.getElementById('capacityInfo');
    const giteSelect = document.getElementById('gite');
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');

    // Capacidades máximas dos gîtes
    const giteCapacities = {
        'chic-cosy': 2,  
        'studio-vert': 6 
    };

    // Atualizar o campo de capacidade máxima baseado na seleção do gîte
    function updateCapacityInfo() {
        const gite = giteSelect.value;
        const maxGuests = giteCapacities[gite];
        guestsInput.max = maxGuests;  
        guestsInput.value = maxGuests;  
        capacityInfo.textContent = `Capacité maximale : ${maxGuests} personnes.`;
    }

    // Verificar disponibilidade dos gîtes baseado nas datas de checkin e checkout
    function verificarDisponibilidade() {
        const checkin = checkinInput.value;
        const checkout = checkoutInput.value;

        if (checkin && checkout) {
            fetch('/verificar-disponibilidade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ checkin, checkout })
            })
            .then(response => response.json())
            .then(data => {
                giteSelect.innerHTML = '';  // Limpar as opções de gîtes atuais

                if (data.availableGites.length > 0) {
                    data.availableGites.forEach(gite => {
                        const option = document.createElement('option');
                        option.value = gite;
                        option.textContent = gite === 'chic-cosy' ? 'Chic et Cosy' : 'Studio au Vert';
                        giteSelect.appendChild(option);
                    });
                    giteSelect.disabled = false;
                    updateCapacityInfo();  
                } else {
                    const option = document.createElement('option');
                    option.textContent = 'Aucun gîte disponible';
                    giteSelect.appendChild(option);
                    giteSelect.disabled = true;  
                }
            })
            .catch(error => {
                console.error('Erro ao verificar disponibilidade:', error);
            });
        }
    }

    // Inicializar a capacidade ao carregar a página
    if (giteSelect) {
        giteSelect.addEventListener('change', updateCapacityInfo);
    }

    // Verificar disponibilidade sempre que as datas mudarem
    checkinInput.addEventListener('change', verificarDisponibilidade);
    checkoutInput.addEventListener('change', verificarDisponibilidade);

    // Verificar se o formulário de reserva de gîtes existe na página
    if (reservationForm) {
        reservationForm.addEventListener('submit', function (event) {
            event.preventDefault();  

            // Capturar valores dos campos do formulário
            const gite = giteSelect.value;
            const checkin = checkinInput.value;
            const checkout = checkoutInput.value;
            const guests = parseInt(guestsInput.value, 10);
            const name = document.getElementById('name').value;
            const telephone = document.getElementById('telephone').value;
            const email = document.getElementById('email').value;
            const observations = document.getElementById('observations') ? document.getElementById('observations').value : '';

            // Verificar se o número de convidados excede a capacidade do gîte
            if (guests > giteCapacities[gite]) {
                document.getElementById('errorMessage').textContent = `Le gîte ${gite} ne peut accueillir que ${giteCapacities[gite]} personnes au maximum.`;
                return; 
            }

            const reservationData = {
                "gite": gite,
                "checkin": checkin,
                "checkout": checkout,
                "guests": guests,
                "name": name,
                "telephone": telephone,
                "email": email,
                "observations": observations 
            };

            fetch('/reservar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservationData)
            })
            .then(response => response.json())
            .then(data => {
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
