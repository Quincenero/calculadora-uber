
function App() {
  // 1. Capturamos los parámetros de la URL
  const params = new URLSearchParams(window.location.search);
  const rawPrecio = params.get('p');      // Ej: $4.800,00
  const rawDistancia = params.get('d');   // Ej: 6,5 km
  const rawTiempo = params.get('t');      // Ej: 15 min

  let datos = { listo: false };

  // 2. Limpieza a prueba de balas para las tres variables
  if (rawPrecio && rawDistancia && rawTiempo) {
    const soloNumerosPrecio = rawPrecio.replace(/[^0-9.,]/g, '');
    const soloNumerosDistancia = rawDistancia.replace(/[^0-9.,]/g, '');
    const soloNumerosTiempo = rawTiempo.replace(/[^0-9]/g, '');

    // Formateo de precio (coma a punto decimal)
    let precioLimpio = soloNumerosPrecio;
    if (precioLimpio.includes('.') && precioLimpio.includes(',')) {
      precioLimpio = precioLimpio.replace(/\./g, '');
    }
    precioLimpio = precioLimpio.replace(',', '.');

    // Formateo de distancia
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

  // 3. Lógica de rentabilidad (¡Filtro ÚNICO por kilómetro!)
  // El color depende SOLO de que pague $750 o más por cada km recorrido
  const esRentable = datos.listo && datos.xKm >= 750;

  // 4. Renderizado en pantalla
  if (!datos.listo) {
    return (
      <div style={{ backgroundColor: '#4a4a4a', color: 'white', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', fontFamily: 'sans-serif' }}>
        Esperando datos de Uber...
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
      justifyContent: 'center', 
      alignItems: 'center', 
      fontFamily: 'sans-serif',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ fontSize: '12vw', margin: '0 0 10px 0' }}>${datos.precio}</h1>
      <p style={{ fontSize: '6vw', margin: '5px 0' }}>📍 {datos.distancia} km ({datos.tiempo} min)</p>
      
      <div style={{ borderTop: '2px solid rgba(255,255,255,0.4)', width: '80%', margin: '20px 0' }}></div>
      
      <h2 style={{ fontSize: '8vw', margin: '10px 0' }}>${datos.xKm} / km</h2>
      <h2 style={{ fontSize: '8vw', margin: '10px 0' }}>${datos.xMin} / min</h2>
      
      <p style={{ fontSize: '4vw', marginTop: '30px', opacity: 0.8 }}>
        {esRentable ? '¡VIAJE RENTABLE! 🚀' : 'RECHAZAR VIAJE ❌'}
      </p>
    </div>
  );
}

export default App;