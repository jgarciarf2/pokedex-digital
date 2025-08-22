const campoBuscar = document.getElementById('campo-buscar');
const botonBuscar = document.getElementById('boton-buscar');
const botonAleatorio = document.getElementById('boton-aleatorio');
const botonAtras = document.getElementById('boton-atras');
const botonSiguiente = document.getElementById('boton-siguiente');
const imagen = document.getElementById('img-card');
const titulo = document.getElementById('title-card');
const idPokemon = document.getElementById('id-pokemon');
const movimiento = document.getElementById('movimientos');
const portada = document.getElementById('portada');
const cardContainer = document.getElementById('card-container');

let currentId = 1; // ID del Pokémon actual, comienza en 1

// Mostrar portada y ocultar tarjeta al inicio
window.addEventListener('DOMContentLoaded', () => {
    portada.style.display = 'flex';
    cardContainer.style.display = 'none';
});

// Boton de búsqueda
botonBuscar.addEventListener('click', () => {
    const pokemon = campoBuscar.value.toLowerCase();
    if (!pokemon) return alert('Por favor ingresa el nombre de un Pokémon');
    mostrarTarjeta();
    fetchPokemon(pokemon);
    campoBuscar.value = '';
});

// Botón de Aleatorio
botonAleatorio.addEventListener('click', () => {
    const randomId = Math.floor(Math.random() * 898) + 1; // hasta generación 8
    mostrarTarjeta();
    fetchPokemon(randomId);
});

// Botón Atras
botonAtras.addEventListener('click', () => {
    if (currentId > 1) {
        currentId--;
        fetchPokemon(currentId);
    }
});

// Botón Siguiente
botonSiguiente.addEventListener('click', () => {
    currentId++;
    fetchPokemon(currentId);
});

function mostrarTarjeta() {
    portada.style.display = 'none';
    cardContainer.style.display = 'flex';
}

// Función que hace petición a la PokeAPI
async function fetchPokemon(pokemon) {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('No encontrado');
        const data = await res.json();
        currentId = data.id;
        renderPokemon(data);
    } catch (err) {
        clearDisplay();
        alert('Pokémon no encontrado. Verifica el nombre o ID.');
        console.error(err);
    }
}

// Función que recibe el JSON y actualiza cada sección 
function renderPokemon(p) {
    imagen.src = p.sprites.other['official-artwork'].front_default || p.sprites.front_default;
    // Actualiza solo el nombre en el title-card
    const nombre = p.name.charAt(0).toUpperCase() + p.name.slice(1);
    if (titulo.querySelector('p')) {
        titulo.querySelector('p').textContent = nombre;
    } else {
        titulo.textContent = nombre;
    }
    // Actualiza el id en el div id-pokemon
    if (idPokemon.querySelector('p')) {
        idPokemon.querySelector('p').textContent = `#${p.id.toString().padStart(3, '0')}`;
    } else {
        idPokemon.textContent = `#${p.id.toString().padStart(3, '0')}`;
    }

    // Limpiar movimientos previos
    movimiento.innerHTML = '';

    // Mostrar movimientos
    p.moves.slice(0, 5).forEach(mov => {
        const li = document.createElement('li');
        li.textContent = mov.move.name;
        movimiento.appendChild(li);
    });
}

function clearDisplay() {
    imagen.src = '';
    titulo.textContent = '';
    idPokemon.textContent = '';
    movimiento.innerHTML = '';
}
