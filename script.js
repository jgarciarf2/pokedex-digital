const campoBuscar = document.getElementById('campo-buscar');
const botonBuscar = document.getElementById('boton-buscar');
const botonAleatorio = document.getElementById('boton-aleatorio');
const botonAtras = document.getElementById('boton-atras');
const botonSiguiente = document.getElementById('boton-siguiente');
const imagen = document.getElementById('img-card');
const titulo = document.getElementById('title-card');
const idPokemon = document.getElementById('id-pokemon');
const movimiento = document.getElementById('movimientos');

let currentId = 1; // ID del Pokémon actual, comienza en 1

// Boton de búsqueda
botonBuscar.addEventListener('click', () => {
    const pokemon = campoBuscar.value.toLowerCase();
    if (!pokemon) return alert('Por favor ingresa el nombre de un Pokémon');
    fetchPokemon(pokemon);
    campoBuscar.value = '';
});

// Botón de Aleatorio
botonAleatorio.addEventListener('click', () => {
    const randomId = Math.floor(Math.random() * 898) + 1; // hasta generación 8
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

// Función que hace petición a la PokeAPI
async function fetchPokemon(pokemon) {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('No encontrado');
    const data = await res.json();
    currentId = data.id; // guardar ID actual
    renderPokemon(data);
  } catch (err) {
    clearDisplay();
    alert('Pokémon no encontrado. Verifica el nombre.');
    console.error(err);
  }
}

// Función que recibe el JSON y actualiza cada sección 
function renderPokemon(p) {
    imagen.src = p.sprites.front_default;
    titulo.textContent = p.name.charAt(0).toUpperCase() + p.name.slice(1);
    idPokemon.textContent = `#${p.id.toString().padStart(3, '0')}`;
    
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
