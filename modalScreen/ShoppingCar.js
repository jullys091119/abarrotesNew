import { FlatList } from "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { View } from "react-native-animatable";
import { Text, Button, Card } from "@ui-kitten/components";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMyContext } from "../appContext/appContext";
import { IconBackShopingProduct } from "../utils/helpers";
import { Divider } from "react-native-paper";
import { IconButton } from "react-native-paper";

const ShoppingCar = ({navigation}) => {
  const {setCounterSales, removeSale, counterSales, setUpdateSales} = useMyContext();

  const cancelSales = () => {
    removeSale()
    setCounterSales([])
    if(removeSale) {
      alert("elementos borrados")
    }
  }

  useEffect(() => {
    const loadSales = async () => {
      try {
        const ventasExistentes = await AsyncStorage.getItem("@VENTAS");
        if (ventasExistentes !== null) {
          setCounterSales(JSON.parse(ventasExistentes));
        }
      } catch (error) {
        console.error("Error al cargar las ventas desde AsyncStorage", error);
      }
    };
  
    loadSales();
  }, []);
  
 
  return (
    <View style={styles.container}>
      <IconBackShopingProduct />
      <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 6}}>
       <Text style={styles.title}>Mis Compras</Text>
       <Text style={{marginTop: 20, fontSize: 16, fontWeight: "800"}}>{counterSales.length}{" "}Productos</Text>
      </View>
      <Divider/>
      <FlatList
        data={counterSales}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.cartItem}>
              <Card style={styles.card}>
                <Image
                  source={{ uri: item.imagen }}
                  style={{
                    width: 50,
                    height: 50,
                    alignSelf: "center",
                  }}
                  resizeMode="contain"
                />
              </Card>
              <View style={styles.productSales}>
                <Text style={styles.nameProduct}>{item.nombreProducto}</Text>
                <Text tyle={styles.priceProduct}>Total: ${item.precioTotal}</Text>
                <View style={{display: "flex", flexDirection: "row"}}>
                  <IconButton
                    icon="plus"
                    iconColor="white"
                    size={10}
                    onPress={() => {setContador(contador + 1)}}
                    style={{backgroundColor: "red", borderRadius: 10}}
                  />
                  <IconButton
                    icon="minus"
                    iconColor="white"
                    size={10}
                    onPress={() => setContador(contador - 1)}
                    style={{backgroundColor: "red", borderRadius: 10,}}
                  />
                </View>
              </View>
            </View>
          );
        }}
      />
    
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => {
          cancelSales();
        }}
      >
        <Text style={styles.buttonText}>Cancelar Compra</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   paddingTop: 30
  },
  title: {
    fontFamily: "Bela",
    fontSize: 30,
    marginHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    marginTop: 20,
  },
  card: {
    width: 80,
    height: 70,
    backgroundColor: "#DFE2EA",
    borderRadius: 14
  },
  cartItem: {
    marginTop: 40,
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "row",
    gap:  10,
    justifyContent: "flex-start"
  //   backgroundColor: "red"
  },
  productSales: {
    width: "50%",
    paddingHorizontal: 20,
  },
  loginButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  nameProduct: {
    fontFamily: "Bela"
  },
  priceProduct: {
    fontFamily: "Bela",
  }

});

export default ShoppingCar;
