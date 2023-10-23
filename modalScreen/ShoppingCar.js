import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Card } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMyContext } from '../appContext/appContext';
import { Divider } from 'react-native-paper';
import { IconButton } from 'react-native-paper';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'; // Importar SwipeListView
import { IconBackShopingProduct } from "../utils/helpers";
import { Box, FlatList, Pressable, HStack, Avatar, Icon} from "native-base";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const ShoppingCar = ({ navigation,myTabs }) => {
  const { setCounterSales, removeSale, counterSales, setUpdateSales, tokenLogout, setContador} = useMyContext();
  const [contadorActionSheet, setContadorActionSheet] = useState(0);
  const [precioTotal, setPrecioTotal] = useState({});
  const [totalVentas, setTotalVentas] = useState(0);
 
  

  const cancelSales = () => {
    removeSale();
    setCounterSales([]);
    if (removeSale) {
      alert('elementos borrados');
    }
  };


  const updateCounter = (itemId, value, initialCount, price) => {
    const updatedCount = (contadorActionSheet[itemId] || initialCount) + value;
    const updatedTotal = updatedCount * price;

    setContadorActionSheet((prevContador) => ({
      ...prevContador,
      [itemId]: updatedCount,
    }));

    setPrecioTotal((prevTotal) => ({
      ...prevTotal,
      [itemId]: updatedTotal,
    }));

    const updatedData = {
      contador: {
        ...contadorActionSheet,
        [itemId]: updatedCount,
      },
      precioTotal: {
        ...precioTotal,
        [itemId]: updatedTotal,
      },
    };
    AsyncStorage.setItem('@ContadorPrecioTotal', JSON.stringify(updatedData));
  };

  useEffect(() => {
    const loadDataFromStorage = async () => {
      try {
        const ventasExistentes = await AsyncStorage.getItem('@VENTAS');
        if (ventasExistentes !== null) {
          setCounterSales(JSON.parse(ventasExistentes));
        }

        const contadorPrecioTotalData = await AsyncStorage.getItem('@ContadorPrecioTotal');
        if (contadorPrecioTotalData !== null) {
          const { contador, precioTotal } = JSON.parse(contadorPrecioTotalData);
          setContadorActionSheet(contador);
          setPrecioTotal(precioTotal);
        }
      } catch (error) {
        console.error('Error al cargar las ventas desde AsyncStorage', error);
      }
    };

    loadDataFromStorage();
  }, []);


  const handleDelete = async (itemId, rowMap) => {

    AsyncStorage.getItem('@VENTA').then((data)=> {
    
       AsyncStorage.setItem('@VENTA',JSON.stringify(data -1) )
    })
  
    // Encuentra el índice del elemento a eliminar
    const itemIndex = counterSales.findIndex((item) => item.id === itemId);

    if (itemIndex !== -1) {
      // Copia la matriz de ventas y elimina el elemento en el índice encontrado
      const updatedCounterSales = [...counterSales];
      updatedCounterSales.splice(itemIndex, 1);

      // Actualiza el estado con la nueva matriz de ventas
      setCounterSales(updatedCounterSales);
      
      // Elimina el contador y precio total para el elemento eliminado en el estado
      const updatedContador = { ...contadorActionSheet };
      const updatedPrecioTotal = { ...precioTotal };
      delete updatedContador[itemId];
      delete updatedPrecioTotal[itemId];
      setContadorActionSheet(updatedContador);
      setPrecioTotal(updatedPrecioTotal);
      setContador(0)
     
      AsyncStorage.removeItem('@VENTAS').then(() => {
        // Actualiza AsyncStorage con los nuevos datos de contador y precioTotal
        const updatedData = {
          contador: updatedContador,
          precioTotal: updatedPrecioTotal,
        };
        AsyncStorage.setItem('@ContadorPrecioTotal', JSON.stringify(updatedData));
      });
    }
   
  };
  
  
  useEffect(() => {
    const sumaTotal = counterSales.reduce((total, item) => {
      const precio = precioTotal[item.id] || item.precioTotal;
      return total + precio;
    }, 0);

    setTotalVentas(sumaTotal);
  }, [counterSales, precioTotal]);

  const [listData, setListData] = useState(Array(20).fill('').map((_, i) => ({
    key: `${i}`,
    text: `item #${i}`
  })));

  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [...listData];
    const prevIndex = listData.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setListData(newData);
  };

  const onRowDidOpen = rowKey => {
    console.log('This row opened', rowKey);
  };

  const renderItem = ({
    item,
    index
  }) => <Box>
      <Pressable onPress={() => console.log('You touched me')} alignItems="center" bg="white" borderBottomColor="trueGray.200" borderBottomWidth={1} justifyContent="center" height={50} underlayColor={'#AAA'} _pressed={{
      bg: 'trueGray.200'
    }} py={8} style={{height:110, marginHorizontal: 5}}>
        <HStack width="100%" px={4}>
          <HStack space={2} alignItems="center">       
            <Box style={styles.card}>
              <Image source={{ uri: item.imagen }} style={styles.productImage} resizeMode="contain" />
              <View style={styles.productSales}>
                <Text style={styles.nameProduct}>{item.nombreProducto}</Text>
                <Text style={styles.priceProduct}>
                  Total: ${precioTotal[item.id] || item.precioTotal}
                </Text>
                <View style={styles.counterContainer}>
                  <IconButton
                    icon="minus"
                    iconColor="white"
                    size={10}
                    onPress={() => updateCounter(item.id, -1, item.contador, item.precio)}
                    style={styles.counterButton}
                  />
                  <Text style={styles.counterText}>{contadorActionSheet[item.id] || item.contador}</Text>
                  <IconButton
                    icon="plus"
                    iconColor="white"
                    size={10}
                    onPress={() => updateCounter(item.id, 1, item.contador, item.precio)}
                    style={styles.counterButton}
                  />
                </View>
              </View>
            </Box>
          </HStack>
        </HStack>
      </Pressable>
    </Box>;

    const renderHiddenItem = (data, rowMap) => <HStack flex={1} pl={2}>
    <Pressable px={4} ml="auto" cursor="pointer"  justifyContent="center" onPress={() =>  closeRow(rowMap, data.item.key)} _pressed={{
    opacity: 0
    }}>
      {/* <Icon as={<Ionicons name="close" />} color="white" /> */}
    </Pressable>
    <Pressable px={6} cursor="pointer" bg="red.500" justifyContent="center" onPress={() => handleDelete(data.item.id, rowMap)} _pressed={{
    opacity: 0.5
    }}>
      <Icon as={<MaterialIcons name="delete" />} size={7}  color="white" />
    </Pressable >
    </HStack>;

  return (
    <View style={styles.container}>
      <IconBackShopingProduct />
      <View style={styles.header}>
        <Text style={styles.title}>Mis Compras</Text>
        <Text style={styles.productCountText}>{counterSales.length} Productos</Text>
      </View>
      <Divider />
      <Box  safeArea flex={1} >
        <SwipeListView data={counterSales} renderItem={renderItem} renderHiddenItem={renderHiddenItem} rightOpenValue={-130} previewRowKey={'0'} previewOpenValue={-40} previewOpenDelay={3000} onRowDidOpen={onRowDidOpen} />
      </Box>
      <Text style={styles.totalText}>Cantidad Total: ${totalVentas.toFixed(2)}</Text>
      <TouchableOpacity style={styles.cancelButton}>
        <Text style={styles.buttonText} onPress={() => cancelSales()}>Siguiente</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.buyButton} onPress={() => sendSales()}>
        <Text style={styles.buttonText}>Comprar</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  title: {
    fontFamily: 'Bela',
    fontSize: 30,
    marginHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  productCountText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '800',
  },
  card: {
    marginHorizontal: 10,
    flexDirection: 'row',
  },
  productImage: {
    width: 90,
    height: 90,
  },
  productSales: {
    flex: 1,
    marginLeft: 10,
  },
  nameProduct: {
    fontFamily: 'Bela',
  },
  priceProduct: {
    fontFamily: 'Bela',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  counterButton: {
    backgroundColor: '#C5CEE0',
    borderRadius: 4,
    marginHorizontal: 5,
  },
  counterText: {
    marginTop: 0,
  },
  deleteButtonContainer: {
    flex: 1,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '800',
    marginLeft: 50,
    fontFamily: 'Poppins',
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 50
  },
  buyButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ShoppingCar;
