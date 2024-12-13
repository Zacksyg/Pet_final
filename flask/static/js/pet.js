document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const petId = urlParams.get('pet_id');

    if (token) {
        localStorage.setItem('jwt', token);
    }

    const storedToken = localStorage.getItem('jwt');
    if (!storedToken) {
        alert('Usuário não autenticado. Redirecionando para login.');
        window.location.href = '/cadastro_login.html';
        return;
    }

    if (!petId) {
        alert('ID do pet não fornecido. Redirecionando para lista de pets.');
        window.location.href = '/pets';
        return;
    }

    const headers = { 'Authorization': `Bearer ${storedToken}` };

    // Função para buscar informações do pet
    async function fetchPetInfo() {
        try {
            const response = await fetch(`http://127.0.0.1:5001/api/pet/${petId}`, { headers });

            if (response.ok) {
                const result = await response.json();
                const pet = result.pet;

                document.getElementById('petName').textContent = pet.name || 'Sem nome';
                document.getElementById('petSpecies').textContent = `Espécie: ${pet.species || 'Desconhecida'}`;
                document.getElementById('ownerName').textContent = `Raça: ${pet.breed || 'Indisponível'}`;
                document.getElementById('petAge').textContent = `Idade: ${pet.age || 'Desconhecida'} Ano(s)`;
                document.getElementById('petWeight').textContent = `Peso: ${pet.weight || 'Desconhecido'} kg`;

                if (pet.image_url) {
                    document.getElementById('petImage').src = pet.image_url;
                }

                await fetchVaccines();
                await fetchExams();
            } else {
                alert('Nenhum pet encontrado. Redirecionando para lista de pets.');
                window.location.href = '/pets';
            }
        } catch (error) {
            console.error('Erro ao carregar informações do pet:', error);
            alert('Erro ao carregar informações do pet.');
        }
    }

    // Função para buscar vacinas
    async function fetchVaccines() {
        try {
            const response = await fetch(`http://127.0.0.1:5001/api/pet/${petId}/vacinas`, { headers });
            if (response.ok) {
                const data = await response.json();
                const vaccineList = document.getElementById('vaccineList');
                vaccineList.innerHTML = '';
                data.forEach(vaccine => {
                    const li = document.createElement('li');
                    li.textContent = `${vaccine.name} - ${vaccine.date} às ${vaccine.time}`;
                    vaccineList.appendChild(li);
                });
            } else {
                throw new Error('Erro ao buscar vacinas');
            }
        } catch (error) {
            console.error('Erro ao buscar vacinas:', error);
            alert('Erro ao carregar vacinas do pet.');
        }
    }

    // Função para buscar exames
    async function fetchExams() {
        try {
            const response = await fetch(`http://127.0.0.1:5001/api/pet/${petId}/exames`, { headers });
            if (response.ok) {
                const data = await response.json();
                const examList = document.getElementById('examList');
                examList.innerHTML = '';
                data.forEach(exam => {
                    const li = document.createElement('li');
                    li.textContent = `${exam.name} - ${exam.date} às ${exam.time}`;
                    examList.appendChild(li);
                });
            } else {
                throw new Error('Erro ao buscar exames');
            }
        } catch (error) {
            console.error('Erro ao buscar exames:', error);
            alert('Erro ao carregar exames do pet.');
        }
    }

    // Submeter o formulário de edição
    document.getElementById('editForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const data = {
            name: document.getElementById('editName').value,
            species: document.getElementById('editSpecies').value,
            age: document.getElementById('editAge').value,
            weight: document.getElementById('editWeight').value,
        };

        try {
            const response = await fetch(`http://127.0.0.1:5001/api/pet/${petId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert('Informações do pet atualizadas com sucesso!');
                location.reload();
            } else {
                alert('Erro ao atualizar informações do pet.');
            }
        } catch (error) {
            console.error('Erro ao atualizar informações do pet:', error);
        }
    });

    // Submeter o formulário de upload de imagem
    document.getElementById('uploadImageForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('petImage', document.getElementById('petImageUpload').files[0]);

        try {
            const response = await fetch(`http://127.0.0.1:5001/upload_image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                },
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                alert('Imagem atualizada com sucesso!');
                document.getElementById('petImage').src = result.image_url;
            } else {
                alert('Erro ao atualizar imagem.');
            }
        } catch (error) {
            console.error('Erro ao fazer upload da imagem:', error);
            alert('Erro ao fazer upload da imagem.');
        }
    });

    // Função para adicionar vacina
    document.getElementById('addVaccineForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const vaccineData = {
            name: document.getElementById('vaccineName').value,
            date: document.getElementById('vaccineDate').value,
            time: document.getElementById('vaccineTime').value
        };

        try {
            const response = await fetch(`http://127.0.0.1:5001/api/pet/${petId}/vacinas`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(vaccineData)
            });

            if (response.ok) {
                alert('Vacina adicionada com sucesso!');
                fetchVaccines(); // Atualiza a lista de vacinas
            } else {
                alert('Erro ao adicionar vacina.');
            }
        } catch (error) {
            console.error('Erro ao adicionar vacina:', error);
        }
    });

    // Função para adicionar exame
    document.getElementById('addExamForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const examData = {
            name: document.getElementById('examName').value,
            date: document.getElementById('examDate').value,
            time: document.getElementById('examTime').value
        };

        try {
            const response = await fetch(`http://127.0.0.1:5001/api/pet/${petId}/exames`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${storedToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(examData)
            });

            if (response.ok) {
                alert('Exame adicionado com sucesso!');
                fetchExams(); // Atualiza a lista de exames
            } else {
                alert('Erro ao adicionar exame.');
            }
        } catch (error) {
            console.error('Erro ao adicionar exame:', error);
        }
    });

    // Inicializar ao carregar a página
    await fetchPetInfo();
});