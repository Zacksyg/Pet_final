document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        localStorage.setItem('jwt', token);
    }

    const storedToken = localStorage.getItem('jwt');
    if (!storedToken) {
        alert('Usuário não autenticado. Redirecionando para login.');
        window.location.href = 'http://127.0.0.1:5000/cadastro_login.html';
        return;
    }

    const speciesSelect = document.getElementById('species');
    const breedSelect = document.getElementById('breed');
    const customBreedContainer = document.getElementById('customBreedContainer');
    const customBreedInput = document.getElementById('customBreed');

    const breeds = {
        gato: ['Siamês', 'Persa', 'Maine Coon', 'Sphynx', 'Vira-lata', 'Angorá', 'Ragdoll', 'Ashera', 'American-Shorthair', 'Exótico', 'Srd'],
        cachorro: ['Labrador', 'Poodle', 'Pastor Alemão', 'Bulldog', 'Vira-lata', 'Border-Collie', 'Pomerânia', 'Rottweiler', 'Golden-Retriever', 'Shih-tzu', 'Chihuahua', 'Pincher'],
        pássaro: ['Canário', 'Periquito', 'Papagaio', 'Calopsita', 'Pato', 'Codorna'],
        reptil: ['Iguana', 'Lagarto', 'Camaleão', 'Jabuti', 'Cobra'],
        peixe: ['Betta', 'Goldfish', 'Tetra Neon', 'Colisa', 'Platy', 'Paulistinha', 'Limpa-Vidro', 'Guppy', 'Peixe-Palhaço', 'Carpa'],
        cavalo: ['Puro Sangue', 'Árabe', 'Quarto de Milha', 'Appaloosa', 'Andaluz', 'Bretão', 'Crioulo', 'Manga-Larga', 'Pampa'],
        roedor: ['Hamster', 'Porquinho da Índia', 'Chinchila', 'Gerbil', 'Coelho', 'Rato']
    };

    speciesSelect.addEventListener('change', function () {
        const selectedSpecies = speciesSelect.value;

        breedSelect.innerHTML = '<option value="">Selecione a raça</option>';
        customBreedContainer.style.display = 'none';
        customBreedInput.value = '';

        if (selectedSpecies && breeds[selectedSpecies]) {
            breeds[selectedSpecies].forEach(function (breed) {
                const option = document.createElement('option');
                option.value = breed.toLowerCase();
                option.textContent = breed;
                breedSelect.appendChild(option);
            });

            const otherOption = document.createElement('option');
            otherOption.value = 'other';
            otherOption.textContent = 'Outra raça';
            breedSelect.appendChild(otherOption);
        }
    });

    breedSelect.addEventListener('change', function () {
        if (breedSelect.value === 'other') {
            customBreedContainer.style.display = 'block';
        } else {
            customBreedContainer.style.display = 'none';
            customBreedInput.value = '';
        }
    });

    document.getElementById('petForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        let breed = breedSelect.value;
        if (breed === 'other') {
            breed = customBreedInput.value.trim();
        }

        const petData = {
            name: document.getElementById('petName').value,
            species: speciesSelect.value,
            breed: breed,
            age: document.getElementById('age').value,
            weight: document.getElementById('weight').value,
            vaccinated: document.getElementById('vaccinated').value,
            additionalInfo: document.getElementById('additionalInfo').value
        };

        try {
            const response = await fetch('http://127.0.0.1:5001/cadastrar_pet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedToken}`
                },
                body: JSON.stringify(petData)
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                window.location.href = 'http://127.0.0.1:5000/home.html';
            } else {
                alert(result.error || 'Erro ao cadastrar o pet.');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro ao tentar cadastrar o pet.');
        }
    });
});
