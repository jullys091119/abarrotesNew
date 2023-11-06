import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { useMyContext } from "../appContext/appContext";
import { IconButton, MD3Colors } from 'react-native-paper';
import axios from "axios";
import { IconStar } from "../utils/helpers";
import { AnimatedFAB } from 'react-native-paper';
import { Badge } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import ShoppingCar from "../modalScreen/ShoppingCar";
import { Select, Box, CheckIcon, Center } from "native-base";

const ShoppingProduct = (props, {visible,style,animateFrom}) => {
  const { 
    setProducts,
    product,
    getCredentials,
    setNombreProducto,
    nombreProducto,
    setContador,
    contador,
    setCounterSales,
    setUpdateSales,
    precio,
    setPrecio,
    setAddSales,
    venta,
    setVenta
  } = useMyContext();


  const [productos, setProductos] = useState({});
  const [imagen, setImagen] = useState({});
  const [addProductCar, setAddProductCar] = useState([])
  const navigation = useNavigation()
  const [ventas, setVentas] = useState([]);
  const [idProduct, setIdProduct] = useState("")
  const [isSalesExisted, setIsSaledExisted] = useState(true)
  const [nombreProveedor, setNombreProveedor] = useState("")
  const [service, setService] =useState("");

  const getProducts = () => {
    axios
      .get(
        "https://abarrotes.msalazar.dev/node/" +
          props.idProduct +
          "?_format=json",
        {
          headers: {
            "Content-Type": "application/json",
            "Content-Length": "0",
            Authorization: "Basic Og==",
          },
        }
      )
      .then(function (response) {
        setIdProduct(props.idProduct)
        setPrecio(response.data.field_precio_venta[0].value)
        setNombreProveedor(response.data.field_proveedor[0].value)
        setImagen(response.data.field_imagen[0].url);
        setNombreProducto(response.data.field_nombre[0].value)
      })
      .catch(function (error) {
        console.log(error);
      });
  };
   
 
  const SelectVegetables = () => {
    const selectItems = []
    for(let i=100; i<=1000; i+=100 ) {
      selectItems.push(
        <Select.Item 
        label={`${i} gramos - Precio: $${(precio/1000 * i).toFixed(2)}`}
        value={(precio/1000 * i).toFixed(2)}
        key={i} />
      );
    }
    return <Center>
        <Box maxW="300">
          <Select selectedValue={service} minWidth="200" accessibilityLabel="Cantidad en gramos" placeholder="Cantidad en gramos" _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon size="5" />
        }} mt={1} onValueChange={itemValue => setService(itemValue)}>
          
          {selectItems}
          </Select>
        </Box>
      </Center>;
  };



  const getSale = async () => {
    let sales = await AsyncStorage.getItem("@VENTA")
    if (sales !== null) {
      setVenta(parseInt(sales)); // o parseFloat si el valor puede ser decimal
    } else {
      setVenta(0); // Establece un valor predeterminado si no hay ningún valor almacenado.
    }
  }

  openShopCar = () => {
    navigation.replace("ShoppingCar")
  }

  const addSales = async () => {
    setContador(0)
    const nuevaVenta = {
      id: idProduct,
      nombreProducto,
      precio: precio,
      contador: contador,
      precioTotal: precio * contador,
      ventas: venta + 1,
      imagen: imagen.toString(),
      precioVerdura: service
    };
    // Obtener las ventas existentes de AsyncStorage
    const ventasExistentes = await AsyncStorage.getItem("@VENTAS");
    let ventasActualizadas = [];
    
    
    if (ventasExistentes !== null) {
      ventasActualizadas = JSON.parse(ventasExistentes);
    }
    let isExist = false

    for (const ventaActual of ventasActualizadas) {
      if(ventaActual.id === nuevaVenta.id) {
        isExist = true
        break;
      } 
    }

    if(isExist) {
      alert("No puedes agregar un producto que ya existe")
    }else {
      ventasActualizadas.push(nuevaVenta)
      setVenta(venta + 1)
      alert("Se agregó el producto a la lista de ventas");
      await AsyncStorage.setItem("@VENTA", JSON.stringify(venta + 1))
    }
    
    await AsyncStorage.setItem("@VENTAS", JSON.stringify(ventasActualizadas));
      
    // Actualizar el estado local
    setCounterSales(ventasActualizadas);


  }
 
  const fabStyle = { [animateFrom]: 16 };

  const subtractFromCounter = () => {
    if (contador > 0) {
      setContador(contador - 1);
    }
  }
  
  useEffect(() => {
    getProducts()
  },[getSale()]);

  return (
    <>
      <View style={styles.container}>
        <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
          <Badge style={styles.badge}>{venta}</Badge>
          <IconButton
            icon="cart-plus"
            iconColor="gold"
            size={30}
            onPress={()=> {openShopCar()}}
          />
        </View>
        <View style={styles.header}>
          <Image
            source={{
              uri:imagen.toString(),
            }}
            style={{
              width: 200,
              height: 200,
              alignSelf: "center"
            }}
            resizeMode="contain"
          />

          {
            nombreProveedor !== "maria"?(
              <View style={styles.cantidad}>
                <IconButton
                  icon="minus"
                  iconColor="white"
                  size={20}
                  onPress={() => {subtractFromCounter}}
                  style={{backgroundColor: "red", borderRadius: 10, marginHorizontal: 25}}
                />
                
                {
                  Math.sign(contador) === -1?
                  (<Text style={styles.counter}>{setContador(0)}</Text>):(<Text style={styles.counter}>{contador}</Text>)
                }
              
                <IconButton
                  icon="plus"
                  iconColor="white"
                  size={20}
                  onPress={() => {setContador(contador + 1)}}
                  style={{backgroundColor: "red", borderRadius: 10, marginHorizontal: 25}}
                />
              </View>
            ): (
             <>
              <SelectVegetables/>
             </>
            )
          }
          <View style={styles.textInformationBox}>
            <Text style={styles.nombreProveedor}>{nombreProveedor}</Text>
            <View style={styles.precioBox}>
            <Text style={styles.nombreProducto}>{nombreProducto}</Text>
            <Text style={styles.precio}>${precio*contador || service || 0}</Text>
          </View>
          <View style={{display: "flex", flexDirection: "row", marginTop: 10}}>
              <IconStar/>
              <IconStar/>
              <IconStar/>
              <IconStar/>
              <IconStar/>
            </View>
            <AnimatedFAB
              icon={'shopping-outline'}
              label={'Label'}
              color="white"
              // extended={isExtended}
              onPress={() =>{
              addSales()
              }}
              visible={visible}
              animateFrom={'right'}
              iconMode={'static'}
              style={[styles.fabStyle, style, fabStyle]}
            />
          </View>
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  fabStyle: {
    bottom: -90,
    right: 0,
    position: 'absolute',
    backgroundColor: "gold"
  },
  container: {
    flex: 1,
    paddingTop: 10
  },
  header: {
    height: 300,
    padding: 20
  },
  cantidad: {
    display: "flex",
    flexDirection: "row",
    justifyContent:"center",
    marginTop: 30
  },
  counter: {
    fontSize: 20,
    marginTop: 9,
    fontWeight: "800"
  },
  textInformationBox: {
    marginVertical: 50
  },
  nombreProducto: {
    fontSize:30,
    fontFamily: "BelaRegular",
    fontWeight: "300",
  },
  nombreProveedor: {
    fontSize: 20,
    color: "gray",
    fontFamily: "Poppins",
  },
  precioBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  precio: {
    fontFamily: "Poppins",
    fontSize: 20,
    fontWeight: "800"
  },
  badge: {
    position: "absolute",
    right: 10,
    top: -4
  }
 
});

export default ShoppingProduct;
