import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { useMyContext } from "../appContext/appContext";
import { IconButton, MD3Colors } from 'react-native-paper';
import axios from "axios";
import { IconStar } from "../utils/helpers";
import { AnimatedFAB } from 'react-native-paper';
import { Badge } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";



const ShoppingProduct = (props, {visible,style,animateFrom}) => {
  const { setProducts, product, getCredentials } = useMyContext();
  const [productos, setProductos] = useState({});
  const [imagen, setImagen] = useState({});
  const [contador, setContador] = useState(0)
  const [nombreProducto, setNombreProducto] = useState("")
  const [nombreProveedor, setNombreProveedor] = useState("")
  const [precio, setPrecio] = useState(0)
  const [venta, setVenta] = useState(0)
  const [ventaStorage, setVentaStorage] = useState(0)

   
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
        setPrecio(response.data.field_precio_venta[0].value)
        showTextNameProveedor(response.data.field_proveedor[0].value)
        setImagen(response.data.field_imagen[0].url);
        setNombreProducto(response.data.field_nombre[0].value)
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  
  const showTextNameProveedor = (op) => {
    if (op === "sellorojo") {
      setNombreProveedor("Sello Rojo");
    } else if (op === "Cocacola") {
    } else if (op === "Lala") {
      setNombreProveedor("Lala");
    } else if (op === "maria") {
      setNombreProveedor("Maria")
    } else if (op === "Bimbo") {
      setNombreProveedor("Bimbo")
    }
  };
 
  const setSale = async () => {  
    console.log(venta, "newsales")
    await AsyncStorage.setItem("@VENTA", JSON.stringify(venta + 1))
    setVenta(venta + 1)
  }

  const getSale = async () => {
    let sales = await AsyncStorage.getItem("@VENTA")
    if (sales !== null) {
      setVenta(parseInt(sales)); // o parseFloat si el valor puede ser decimal
    } else {
      setVenta(0); // Establece un valor predeterminado si no hay ningún valor almacenado.
    }
  
  }
  
  
  const removeSale = async () => {
     await AsyncStorage.removeItem("@VENTA")
   }
  
  const fabStyle = { [animateFrom]: 16 };
 
  useEffect(() => {
    getProducts()
    //removeSale()
  },[getSale()]);
  
  return (
    <View style={styles.container}>
      <View style={{display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
        <Badge style={styles.badge}>{venta}</Badge>
        <IconButton
          icon="cart-plus"
          iconColor="gold"
          size={30}
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
        <View style={styles.cantidad}>
          <IconButton
            icon="minus"
            iconColor="white"
            size={20}
            onPress={() => setContador(contador - 1)}
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
        <View style={styles.textInformationBox}>
          <Text style={styles.nombreProveedor}>{nombreProveedor}</Text>
          <View style={styles.precioBox}>
           <Text style={styles.nombreProducto}>{nombreProducto}</Text>
           <Text style={styles.precio}>${precio*contador}</Text>
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
              setSale()
            }}
            visible={visible}
            animateFrom={'right'}
            iconMode={'static'}
            style={[styles.fabStyle, style, fabStyle]}
         />
        </View>
      </View>
    </View>
    
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
