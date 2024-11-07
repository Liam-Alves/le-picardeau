document.addEventListener('DOMContentLoaded', function () {
    const reservationForm = document.getElementById('reservationForm');
    const guestsInput = document.getElementById('guests');
    const capacityInfo = document.getElementById('capacityInfo');
    const giteSelect = document.getElementById('gite');
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    const errorMessage = document.getElementById('errorMessage');

    // Atualiza a capacidade máxima com base no gîte selecionado
    function updateCapacityInfo() {
        const selectedOption = giteSelect.options[giteSelect.selectedIndex];
        const maxGuests = selectedOption ? parseInt(selectedOption.getAttribute('data-capacity')) : 0;
        guestsInput.max = maxGuests;
        guestsInput.value = maxGuests;
        capacityInfo.textContent = `Capacité maximale : ${maxGuests} personnes.`;
    }

    // Função para verificar a disponibilidade dos gîtes
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
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro do servidor: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                giteSelect.innerHTML = ''; // Limpa as opções atuais de gîtes

                if (data.availableGites && data.availableGites.length > 0) {
                    data.availableGites.forEach(gite => {
                        const option = document.createElement('option');
                        option.value = gite.id;
                        option.textContent = gite.nome;
                        option.setAttribute('data-capacity', gite.capacidade); // Adiciona a capacidade como um atributo
                        giteSelect.appendChild(option);
                    });
                    giteSelect.disabled = false;
                    updateCapacityInfo(); // Atualiza a capacidade ao selecionar o gîte
                } else {
                    const option = document.createElement('option');
                    option.textContent = 'Aucun gîte disponible';
                    option.disabled = true;
                    giteSelect.appendChild(option);
                    giteSelect.disabled = true;
                }
            })
            .catch(error => {
                console.error('Erro ao verificar disponibilidade:', error);
                errorMessage.textContent = 'Erreur lors de la vérification de la disponibilité. Veuillez réessayer plus tard.';
            });
        }
    }

    // Inicializa a verificação de disponibilidade ao alterar as datas de checkin e checkout
    checkinInput.addEventListener('change', verificarDisponibilidade);
    checkoutInput.addEventListener('change', verificarDisponibilidade);

    // Atualiza a capacidade de convidados ao mudar o gîte selecionado
    if (giteSelect) {
        giteSelect.addEventListener('change', updateCapacityInfo);
    }

    // Submissão do formulário de reserva
    if (reservationForm) {
        reservationForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const giteId = giteSelect.value;
            const checkin = checkinInput.value;
            const checkout = checkoutInput.value;
            const guests = parseInt(guestsInput.value, 10);
            const name = document.getElementById('name').value;
            const telephone = document.getElementById('telephone').value;
            const email = document.getElementById('email').value;
            const observations = document.getElementById('observations') ? document.getElementById('observations').value : '';

            // Validação de capacidade do gîte
            const selectedOption = giteSelect.options[giteSelect.selectedIndex];
            const maxGuests = selectedOption ? parseInt(selectedOption.getAttribute('data-capacity')) : 0;

            if (guests > maxGuests) {
                errorMessage.textContent = `Le gîte sélectionné ne peut accueillir que ${maxGuests} personnes au maximum.`;
                return;
            }

            // Validação do email e telefone
            if (!validateEmail(email)) {
                errorMessage.textContent = 'Veuillez saisir une adresse e-mail valide.';
                return;
            }

            if (!validatePhone(telephone)) {
                errorMessage.textContent = 'Veuillez saisir un numéro de téléphone valide.';
                return;
            }

            const reservationData = {
                "giteId": giteId,
                "checkin": checkin,
                "checkout": checkout,
                "guests": guests,
                "name": name,
                "telephone": telephone,
                "email": email,
                "observations": observations
            };

            // Envia os dados de reserva para o backend
            fetch('/reservar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reservationData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro ao reservar: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                alert(data.message || 'Réservation confirmée!');
            })
            .catch(error => {
                console.error('Erro ao reservar:', error);
                alert('Erreur lors de la réservation. Veuillez réessayer plus tard.');
            });
        });
    }

    // Função de validação de email
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Função de validação de telefone
    function validatePhone(phone) {
        const re = /^[0-9]{10,15}$/;
        return re.test(phone);
    }
});
