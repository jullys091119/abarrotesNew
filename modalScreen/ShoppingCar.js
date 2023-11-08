import { Button, Dialog, Portal,Text } from 'react-native-paper';
import React, { useEffect, useState, version, useMemo } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {  Card } from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMyContext } from '../appContext/appContext';
import { Divider } from 'react-native-paper';
import { IconButton } from 'react-native-paper';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'; // Importar SwipeListView
import { IconBackShopingProduct } from "../utils/helpers";
import { Box, FlatList, Pressable, HStack, Avatar, Icon} from "native-base";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Select, Center, CheckIcon, Input, Stack, Checkbox } from "native-base";



const ShoppingCar = ({ navigation,myTabs }) => {
  const { setCounterSales, removeSale, counterSales, setUpdateSales, tokenLogout, setContador, sendSales, coord , setVenta} = useMyContext();
  const [contadorActionSheet, setContadorActionSheet] = useState(0);
  const [precioTotal, setPrecioTotal] = useState({});
  const [totalVentas, setTotalVentas] = useState(null);
  const [isNoSend, setIsNoSend] = useState(true)
  const [visible, setVisible] = useState(false);
  const hideDialog = () => setVisible(false);
  const [change, setChange] = useState("")
  const [money, setMoney] = useState(0);
  const [service, setService] = useState("complete"); 
  
 
  const cancelSales = () => {
    removeSale();
    setCounterSales([]);
    if (removeSale) {
      alert('elementos borrados');
    }
  };


  // useEffect(()=> {
  //   cancelSales()
  // },[])

  const sendingSales = (money) => {
    try {
      const venta = {
        items: counterSales, // La lista de elementos en el carrito
        total: totalVentas.toFixed(2),
        denominacion: service, // El total de la venta
        position: coord
        // Otros datos relevantes, como el cliente, la fecha, etc.
      };
      
      if(Object.keys(venta.items).length !== 0) {
        sendSales(venta.items,venta.total, venta.denominacion, venta.position)
        // Borrar el precio total de la local storage
        AsyncStorage.removeItem('@TotalVentas')
         setTotalVentas(0);
      } else {
        alert("No puedes enviar una venta sin productos")
      }      
    } catch (error) {
      console.log("Error al guardar totalcentas en AsyncStorage")
    }
    if(sendSales) {
      setVisible(!visible)
      navigation.push("MyDrawer")
    } 
  }
  
  const SelectDenomination = () => {
    const [money, setMoney] = useState(0);

    useEffect(() => {
      const gaveMoney = service - totalVentas.toFixed(2);
      if (Math.sign(gaveMoney) === -1) {
        console.error("Revisa tu denominacion")
        setMoney(0);
        setIsNoSend(false);
        setService("Cambio completo")

      } else {
        setMoney(parseFloat(gaveMoney));
        setIsNoSend(true);
      }
    }, [service, totalVentas]);
  
    return (
      <Box maxW="300">
        <Select selectedValue={service} minWidth="200" accessibilityLabel="Choose Service" placeholder="Selecciona  denominación" _selectedItem={{
        bg: "teal.600",
        endIcon: <CheckIcon size="5" />
      }} mt={1} onValueChange={itemValue => setService(itemValue)}>
       
        <Select.Item label="$20.00" value="20"/>
        <Select.Item label="$50.00" value="50" />
        <Select.Item label="$100.00" value="100" />
        <Select.Item label="$200.00" value="200" />
        <Select.Item label="$500.00" value="500" />
        <Select.Item label="Cambio completo" value="complete" />
       </Select>
       <Text variant="bodyMedium" style={{ fontFamily: "Poppins", marginVertical: 30 }}>
        Su Cambio será de: {money || 0}
       </Text>
      </Box>
    )
  };
  
  const DialogDenomination = () => {
    return (
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Content>
          <Text variant="bodyMedium" style={{fontFamily: "Poppins"}}>¿La denominación del pago?</Text>
          <SelectDenomination/>
        </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setVisible(!visible)}>Cancel</Button>
            <Button onPress={() => console.log('Ok')} onPress={()=>{sendingSales()}}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };
  
  const updateCounter = (itemId, value, initialCount, price) => {
    const currentCount = contadorActionSheet[itemId] || initialCount;
    const updatedCount = currentCount + value;
  
    if (updatedCount >= 0) {
      const updatedTotal = updatedCount * price;
  
      // Actualiza las ventas en el estado
      const updatedCounterSales = counterSales.map((item) => {
        if (item.id === itemId) {
          return { ...item, contador: updatedCount, precioTotal: updatedTotal };
        }
        return item;
      });
  
      // Calcula el nuevo total de ventas
      const newTotalVentas = updatedCounterSales.reduce((total, item) => {
        const precio = parseFloat(item.precioVerdura || item.precioTotal || 0);
        return total + precio;
      }, 0);
  
      // Actualiza el estado de totalVentas
      setTotalVentas(newTotalVentas);
  
      // Actualiza el estado de counterSales
      setCounterSales(updatedCounterSales);
  
      // Guarda las ventas actualizadas en AsyncStorage
      AsyncStorage.setItem('@VENTAS', JSON.stringify(updatedCounterSales));
      // Actualiza el total de ventas en AsyncStorage
      AsyncStorage.setItem('@TotalVentas', newTotalVentas.toString());
    }
  };
  
  
  
  const handleDelete = async (itemId, rowMap) => {

    AsyncStorage.getItem('@VENTA').then((data)=> {
    
       AsyncStorage.setItem('@VENTA',JSON.stringify(data - 1))
    })
     
    const newTotalVentas = sumaTotal - (precioTotal[itemId] || 0);
      // Actualiza el estado de totalVentas después de eliminar elementos
    setTotalVentas(newTotalVentas);  // Asegúrate de calcularlo según los elementos restantes
     
    removeSale(itemId);
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
 
  const sumaTotal = useMemo(() => {
    return counterSales.reduce((total, item) => {
      const precio = (typeof item.precioVerdura === 'number' ? item.precioVerdura : 0) + (typeof item.precioTotal === 'number' ? item.precioTotal : 0);
        return total + precio;
       
    }, 0);
  }, [counterSales]);

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

  useEffect(() => {
    const loadDataFromStorage = async () => {
      try {
        const ventasExistentes = await AsyncStorage.getItem('@VENTAS');
        if (ventasExistentes !== null) {
          // Actualiza el estado con los datos cargados desde AsyncStorage
          setCounterSales(JSON.parse(ventasExistentes));
  
          // Calcula el nuevo total de ventas
          const sumaTotal = JSON.parse(ventasExistentes).reduce((total, item) => {
            const precio = parseFloat(item.precioVerdura || item.precioTotal || 0);
            return total + precio;
          }, 0);
  
          // Actualiza el estado de totalVentas
          setTotalVentas(sumaTotal);
  
          // También debes actualizar contadorActionSheet y precioTotal si es necesario.
        }
      } catch (error) {
        console.error('Error al cargar las ventas desde AsyncStorage', error);
      }
    };
  
    loadDataFromStorage();
  }, []);
 
  useEffect(() => {
    const loadTotalVentas = async () => {
      try {
        const storedTotalVentas = await AsyncStorage.getItem('@TotalVentas');
        console.log('Stored Total Ventas:', storedTotalVentas);
        if (storedTotalVentas !== null) {
          // Si se encuentra un valor en AsyncStorage, conviértelo a número y asígnalo a totalVentas
          setTotalVentas(parseFloat(storedTotalVentas));
        } else {
          // Si no hay valor almacenado, inicializa totalVentas en 0
          setTotalVentas(0);
        }
      } catch (error) {
        console.error('Error al cargar totalVentas desde AsyncStorage', error);
      }
    };
  }, []);
  
  
  useEffect(() => {
    // Calculate the total sales whenever counterSales changes
    const newTotalVentas = counterSales.reduce((total, item) => {
      const precio = parseFloat(item.precioVerdura || item.precioTotal || 0);
      return total + precio;
    }, 0);

    // Update the total sales in state
    setTotalVentas(newTotalVentas);

    // Update the total sales in AsyncStorage
    AsyncStorage.setItem('@TotalVentas', newTotalVentas.toString());
  }, [counterSales]);



  const renderItem = ({
    item,
    index
  }) => <Box>
      <Pressable onPress={() => console.log('You touched me')} alignItems="center" bg="white" borderBottomColor="trueGray.200" borderBottomWidth={1} justifyContent="center" height={50} underlayColor={'#AAA'} _pressed={{
      bg: 'trueGray.200'
    }} py={8} style={{height: "auto", marginHorizontal: 5}}>
        <HStack width="100%" px={4}>
          <HStack space={2} alignItems="center">       
            <Box style={styles.card}>
              <Image source={{ uri: item.imagen }} style={styles.productImage} resizeMode="contain" />
              <View style={styles.productSales}>
                <Text style={styles.nameProduct}>{item.nombreProducto}</Text>
                <Text style={styles.priceProduct}>
                  Total: ${precioTotal[item.id] || item.precioTotal || item.precioVerdura}
                </Text>
                {!item.precioVerdura ? ( // Verifica si no es precioVerdura
                <View style={styles.counterContainer}>
                  <IconButton
                    icon="minus"
                    iconColor="white"
                    size={10}
                    onPress={() =>
                      updateCounter(item.id, -1, item.contador, item.precio)
                    }
                    style={styles.counterButton}
                  />
                  <Text style={styles.counterText}>
                    {contadorActionSheet[item.id] || item.contador}
                  </Text>
                  <IconButton
                    icon="plus"
                    iconColor="white"
                    size={10}
                    onPress={() =>
                      updateCounter(item.id, 1, item.contador, item.precio)
                    }
                    style={styles.counterButton}
                  />
                </View>
              ) : null}
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
        {counterSales.length > 0?
        (<SwipeListView data={counterSales} renderItem={renderItem} renderHiddenItem={renderHiddenItem} rightOpenValue={-130} previewRowKey={'0'} previewOpenValue={-40} previewOpenDelay={3000} onRowDidOpen={onRowDidOpen} />)
        :(<View style={{flex: 1, justifyContent:"center", alignItems: "center", marginHorizontal: 30}}>
           <Text style={{fontSize: 13, fontFamily: "Poppins"}}>¡Vamos! Aún no has agregado nada al carrito.</Text>   
          </View>
          )      
        }
      </Box>
      <Text style={styles.totalText}>
        Cantidad Total: ${totalVentas !== null ? totalVentas.toFixed(2) : 0}
      </Text>
      <TouchableOpacity style={styles.cancelButton} onPress={()=>setVisible(!visible)}>
        <Text style={styles.buttonText}>Comprar</Text>
      </TouchableOpacity>
      <DialogDenomination/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  title: {
    fontFamily: 'Poppins',
    fontSize: 30,
    fontWeight: "700",
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
    fontFamily: "Poppins"
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
    backgroundColor: 'red',
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
  
  visible: {
    display: 'flex', // or you can use 'null' to not set a specific style property
  },

  hidden: {
    display: 'none',
  },
});

export default ShoppingCar;
