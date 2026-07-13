import { useState } from 'react';

function App() {
  // 1. Capturamos los parámetros de la URL
  const params = new URLSearchParams(window.location.search);
  const rawPrecio = params.get('p');      // Ej: $4.800,00
  const rawDistancia = params.get('d');   // Ej: 6,5 km
  const rawTiempo = params.get('t');      // Ej: 15 min

  // Estado para el piso por km (si no hay nada guardado en el celu, arranca en 750)
  const [minPorKm, setMinPorKm] = useState(() => {
    const guardado = localStorage.getItem('minPorKm');
    return guardado ? parseInt(guardado, 10) : 750;
  });

  let datos = { listo: false };

  // 2. Limpieza de las variables de la URL
  if (rawPrecio && rawDistancia && rawTiempo) {
    const soloNumerosPrecio = rawPrecio.replace(/[^0-9.,]/g, '');
    const soloNumerosDistancia = rawDistancia.replace(/[^0-9.,]/g, '');
    const soloNumerosTiempo = rawTiempo.replace(/[^0-9]/g, '');

    let precioLimpio = soloNumerosPrecio;
    if (precioLimpio.includes('.') && precioLimpio.includes(',')) {
      precioLimpio = precioLimpio.replace(/\./g, '');
    }
    precioLimpio = precioLimpio.replace(',', '.');

    const distanciaLimpia = soloNumerosDistancia.replace(',', '.');

    const precio = parseFloat(precioLimpio);
    const distancia = parseFloat(distanciaLimpia);
    const tiempo = parseInt(soloNumerosTiempo, 10);

    if (!isNaN(precio) && !isNaN(distancia) && !isNaN(tiempo) && distancia > 0 && tiempo > 0) {
      datos = {
        precio,
        distancia,
        tiempo,
        xKm: Math.round(precio / distancia),
        xMin: Math.round(precio / tiempo),
        listo: true
      };
    }
  }

  // 3. Lógica de rentabilidad basada en el estado dinámico
  const esRentable = datos.listo && datos.xKm >= minPorKm;

  // Función para cambiar el mínimo y guardarlo en el teléfono
  const manejarCambioMinimo = (e) => {
    const valor = parseInt(e.target.value, 10) || 0;
    setMinPorKm(valor);
    localStorage.setItem('minPorKm', valor);
  };

  // 4. Renderizado en pantalla
  if (!datos.listo) {
    return (
      <div style={{ backgroundColor: '#4a4a4a', color: 'white', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontSize: '24px', fontFamily: 'sans-serif', gap: '20px' }}>
        <p>Esperando datos de Uber...</p>
        {/* Input también visible en la pantalla de espera por si querés cambiarlo antes de salir */}
        <div style={{ fontSize: '16px', textAlign: 'center' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Piso por Km actual:</label>
          <input 
            type="number" 
            value={minPorKm} 
            onChange={manejarCambioMinimo}
            style={{ width: '100px', padding: '8px', fontSize: '18px', textAlign: 'center', borderRadius: '5px', border: 'none' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: esRentable ? '#2ecc71' : '#e74c3c', 
      color: 'white', 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'space-between', // Distribuye para dejar el input abajo cómodo
      alignItems: 'center', 
      fontFamily: 'sans-serif',
      padding: '30px 20px',
      boxSizing: 'border-box'
    }}>
      {/* Bloque superior con los datos principales */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
        <h1 style={{ fontSize: '12vw', margin: '0 0 10px 0' }}>${datos.precio}</h1>
        <p style={{ fontSize: '6vw', margin: '5px 0' }}>📍 {datos.distancia} km ({datos.tiempo} min)</p>
        
        <div style={{ borderTop: '2px solid rgba(255,255,255,0.4)', width: '80vw', margin: '20px 0' }}></div>
        
        <h2 style={{ fontSize: '8vw', margin: '10px 0' }}>${datos.xKm} / km</h2>
        <h2 style={{ fontSize: '8vw', margin: '10px 0' }}>${datos.xMin} / min</h2>
        
        <p style={{ fontSize: '5vw', marginTop: '20px', fontWeight: 'bold', letterSpacing: '1px' }}>
          {esRentable ? '¡VIAJE RENTABLE! 🚀' : 'RECHAZAR VIAJE ❌'}
        </p>
      </div>

      {/* Control inferior para modificar el valor en la calle */}
      <div style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.2)', 
        padding: '12px 20px', 
        borderRadius: '10px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '15px',
        width: '90vw',
        justifyContent: 'center',
        boxSizing: 'border-box'
      }}>
        <span style={{ fontSize: '4vw' }}>Mínimo por Km: $</span>
        <input 
          type="number" 
          value={minPorKm} 
          onChange={manejarCambioMinimo}
          style={{ 
            width: '22vw', 
            padding: '6px', 
            fontSize: '5vw', 
            textAlign: 'center', 
            borderRadius: '5px', 
            border: 'none',
            fontWeight: 'bold',
            color: '#333'
          }}
        />
      </div>
    </div>
  );
}

export default App;