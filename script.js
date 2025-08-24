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
const etiquetas = document.getElementById('etiquetas');
const estadisticas = document.getElementById('estadisticas');

let currentId = 1; // ID del Pokémon actual, comienza en 1

// Botón para las etiquetas 
etiquetas.addEventListener('click', async (e) => {
  if (e.target.tagName === 'SPAN') {
    const type = e.target.getAttribute('data-type');
    mostrarTarjeta();
    if (type === "all") {
      // Mostrar un Pokémon aleatorio si eliges "Todos"
      const randomId = Math.floor(Math.random() * 898) + 1;
      fetchPokemon(randomId);
    } else {
      fetchByType(type);
    }
  }
});

// Función para obtener Pokémon por tipo
async function fetchByType(type) {
  const url = `https://pokeapi.co/api/v2/type/${type}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const lista = data.pokemon;

    // Ejemplo: mostrar uno aleatorio de ese tipo
    const randomIndex = Math.floor(Math.random() * lista.length);
    const pokeName = lista[randomIndex].pokemon.name;
    fetchPokemon(pokeName);
  } catch (err) {
    console.error("Error cargando tipo:", err);
  }
}


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

  mostrarEstadisticas(p.stats);
  getMoves(p.name);
}

async function getMoves(pokemonName) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
  const data = await response.json();

  const movesContainer = document.getElementById("movimientos");
  movesContainer.innerHTML = "";

  const moves = data.moves.slice(0, 4);

  for (let moveInfo of moves) {
    const moveResponse = await fetch(moveInfo.move.url);
    const moveData = await moveResponse.json();

    const moveDiv = document.createElement("div");
    moveDiv.classList.add("move-card");

    // Calcular porcentajes para las barras
    const powerPercent = moveData.power ? Math.min((moveData.power / 150) * 100, 100) : 0;
    const accuracyPercent = moveData.accuracy ? moveData.accuracy : 0;

    moveDiv.innerHTML = `
      <div class="move-type">${moveData.type.name.charAt(0).toUpperCase() + moveData.type.name.slice(1)}</div>
      <h3>${moveData.name.charAt(0).toUpperCase() + moveData.name.slice(1).replace(/-/g, ' ')}</h3>
      <div class="move-stats">
        <div class="move-stat-row">
          <span class="move-stat-name">Potencia:</span>
          <div class="move-stat-bar">
            <div class="move-stat-fill power-fill" style="width: ${powerPercent}%"></div>
          </div>
          <span class="move-stat-value">${moveData.power ?? "—"}</span>
        </div>
        <div class="move-stat-row">
          <span class="move-stat-name">Precisión:</span>
          <div class="move-stat-bar">
            <div class="move-stat-fill accuracy-fill" style="width: ${accuracyPercent}%"></div>
          </div>
          <span class="move-stat-value">${moveData.accuracy ?? "—"}${moveData.accuracy ? '%' : ''}</span>
        </div>
      </div>
    `;
    movesContainer.appendChild(moveDiv);
  }
}


function mostrarEstadisticas(stats) {
  const traducciones = {
    hp: 'Vida',
    attack: 'Ataque',
    defense: 'Defensa',
    'special-attack': 'Ataque Esp.',
    'special-defense': 'Defensa Esp.',
    speed: 'Velocidad'
  };
  const estadisticasUl = document.getElementById('estadisticas');
  estadisticasUl.innerHTML = '';
  stats.forEach(stat => {
    const nombre = traducciones[stat.stat.name] || stat.stat.name;
    const valor = stat.base_stat;
    const porcentaje = Math.min((valor / 200) * 100, 100); // Max stat ~200

    const li = document.createElement('li');
    li.innerHTML = `
      <span class="nombre-stat">${nombre}</span>
      <div class="stat-bar-container">
        <div class="stat-bar">
          <div class="stat-bar-fill" style="width: ${porcentaje}%"></div>
        </div>
        <span class="valor-stat">${valor}</span>
      </div>
    `;
    estadisticasUl.appendChild(li);
  });
}

function clearDisplay() {
  imagen.src = '';
  titulo.textContent = '';
  idPokemon.textContent = '';
  movimiento.innerHTML = '';
}
