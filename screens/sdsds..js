const renderEquipoItem = ({ item }) => {
  return (
    <View style={styles.equipoItem}>
      <View style={styles.equipoInfo}>
        <Text style={styles.equipoName}>{item.nombre}</Text>
        
        {item.numero_serie && (
          <Text style={styles.detailText}>N° Serie: {item.numero_serie}</Text>
        )}
        
        {item.talla && (
          <Text style={styles.detailText}>Talla: {item.talla}</Text>
        )}
        
        {item.tipo && (
          <Text style={styles.detailText}>Tipo: {item.tipo}</Text>
        )}
        
        {item.fecha_asignacion && (
          <Text style={styles.detailText}>Asignado: {item.fecha_asignacion}</Text>
        )}
        
        {item.devuelto && (
          <Text style={[styles.detailText, styles.devueltoText]}>
            Estado: {item.devuelto === "NO" ? "Pendiente por devolver" : "Devuelto"}
          </Text>
        )}
      </View>
      <View style={styles.statusIndicator}>
        <Ionicons 
          name="checkmark-circle" 
          size={24} 
          color="#4CAF50" 
        />
        <Text style={styles.statusText}>ASIGNADO</Text>
      </View>
    </View>
  );
};

// Actualiza el useEffect para procesar correctamente los datos
useEffect(() => {
  const fetchEquipamiento = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'equipamiento'), 
        where('jugadorId.value', '==', jugadorId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        setEquipamiento(docData);
        
        const itemsAsignados = [];
        
        // Procesar equipamiento_asignado (array)
        if (docData.equipamiento_asignado && docData.equipamiento_asignado.length > 0) {
          docData.equipamiento_asignado.forEach(item => {
            itemsAsignados.push({
              nombre: item.label,
              numero_serie: getNumeroSerie(item.label, docData), // Función auxiliar
              talla: getTalla(item.label, docData), // Función auxiliar
              tipo: item.label.includes('JERSEY') ? docData.tipo_jersey : null,
              fecha_asignacion: item.fecha_asignacion,
              fecha_entrega: item.fecha_entrega,
              devuelto: docData.devuelto
            });
          });
        }
        
        // Procesar items booleanos individuales
        if (docData.casco) {
          itemsAsignados.push({
            nombre: 'Casco',
            numero_serie: docData.numero_serie_casco,
            talla: docData.talla_funda,
            fecha_asignacion: 'Fecha no especificada', // Puedes ajustar esto
            devuelto: docData.devuelto
          });
        }
        
        if (docData.hombreras_riddell_potros_24) {
          itemsAsignados.push({
            nombre: 'Hombreras Riddell Potros 24',
            numero_serie: docData.numero_serie_hombreras,
            fecha_asignacion: 'Fecha no especificada',
            devuelto: docData.devuelto
          });
        }
        
        if (docData.jersey) {
          itemsAsignados.push({
            nombre: 'Jersey',
            numero_serie: docData.numero_serie_jersey,
            talla: docData.talla_jersey,
            tipo: docData.tipo_jersey,
            fecha_asignacion: 'Fecha no especificada',
            devuelto: docData.devuelto
          });
        }
        
        // Agrega aquí otros items según sea necesario
        
        setAsignados(itemsAsignados);
      } else {
        setError('No se encontró registro de equipamiento');
      }
    } catch (err) {
      console.error('Error al obtener equipamiento:', err);
      setError('Error al cargar el equipamiento');
    } finally {
      setLoading(false);
    }
  };

  fetchEquipamiento();
}, [jugadorId]);

// Funciones auxiliares para obtener datos específicos
const getNumeroSerie = (itemName, data) => {
  if (itemName.includes('CASCO')) return data.numero_serie_casco;
  if (itemName.includes('HOMBRERAS')) return data.numero_serie_hombreras;
  if (itemName.includes('JERSEY')) return data.numero_serie_jersey;
  return 'N/A';
};

const getTalla = (itemName, data) => {
  if (itemName.includes('CASCO')) return data.talla_funda;
  if (itemName.includes('JERSEY')) return data.talla_jersey;
  return 'N/A';
};