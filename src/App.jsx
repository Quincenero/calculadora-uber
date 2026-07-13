
export default function App() {
  // 1. Leemos la URL directamente al renderizar (¡chau useEffect!)
  const params = new URLSearchParams(window.location.search);
  const rawPrecio = params.get('p');      
  const rawDistancia = params.get('d');   

  let datos = { precio: 0, distancia: 0, xKm: 0, listo: false };

  // 2. Si existen los parámetros, hacemos la limpieza al toque
  // 2. Si existen los parámetros, hacemos una limpieza a prueba de balas
  if (rawPrecio && rawDistancia) {
    // Explicación: Nos quedamos SOLO con números, comas y puntos. Volamos $, "km", espacios, etc.
    const soloNumerosPrecio = rawPrecio.replace(/[^0-9.,]/g, '');
    const soloNumerosDistancia = rawDistancia.replace(/[^0-9.,]/g, '');

    // Para el precio (ej: "4.800,00"): volamos los puntos de miles y cambiamos la coma decimal por punto
    // Si viene sin puntos (ej: "4800,00"), igual funciona perfecto
    let precioLimpio = soloNumerosPrecio;
    if (precioLimpio.includes('.') && precioLimpio.includes(',')) {
      precioLimpio = precioLimpio.replace(/\./g, ''); // Saca puntos de miles
    }
    precioLimpio = precioLimpio.replace(',', '.'); // Coma a punto decimal

    // Para la distancia (ej: "6,5"): cambiamos la coma por punto para que JavaScript lo entienda
    const distanciaLimpia = soloNumerosDistancia.replace(',', '.');

    const precio = parseFloat(precioLimpio);
    const distancia = parseFloat(distanciaLimpia);

    if (!isNaN(precio) && !isNaN(distancia) && distancia > 0) {
      datos = {
        precio,
        distancia,
        xKm: Math.round(precio / distancia),
        listo: true
      };
    }
  }

  // 3. Si no hay datos válidos en la URL, mostramos el cartel de espera
  if (!datos.listo) {
    return (
      <div style={{ 
        height: '100vh', display: 'flex', justifyContent: 'center', 
        alignItems: 'center', color: '#fff', background: '#222', fontFamily: 'sans-serif' 
      }}>
        <h2>Esperando datos de la URL... Pegá el test en la barra de direcciones.</h2>
      </div>
    );
  }

  // 4. Si todo está bien, calculamos la rentabilidad y renderizamos el semáforo
  const esRentable = datos.xKm >= 800; // Piso de ganancia por km

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: esRentable ? '#1b5e20' : '#b71c1c', 
      color: 'white',
      fontFamily: 'sans-serif',
      transition: 'background-color 0.5s ease'
    }}>
      <h1 style={{ fontSize: '5rem', margin: '0' }}>${datos.xKm} / KM</h1>
      <p style={{ fontSize: '2rem', opacity: 0.8 }}>
        Viaje de ${datos.precio} en {datos.distancia} km
      </p>
      <div style={{
        marginTop: '20px',
        padding: '15px 30px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '10px',
        fontSize: '2.5rem',
        fontWeight: 'bold'
      }}>
        {esRentable ? '¡SÍ, AGARRALO!' : 'NO RINDE'}
      </div>
    </div>
  );
}