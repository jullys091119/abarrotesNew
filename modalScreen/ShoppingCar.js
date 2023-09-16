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

const ShoppingCar = ({ navigation }) => {
  const { setCounterSales, removeSale, counterSales, setUpdateSales } =
    useMyContext();
  const [contador, setContador] = useState(0);
  const [counterId, setCounterId] = useState();
  const [precioTotal, setPrecioTotal] = useState({});

  const cancelSales = () => {
    removeSale();
    setCounterSales([]);
    if (removeSale) {
      alert("elementos borrados");
    }
  };

  const updateCounter = (itemId, value, initialCount, price) => {
    const updatedCount = (contador[itemId] || initialCount) + value;
    const updatedTotal = updatedCount * price;

    setContador((prevContador) => ({
      ...prevContador,
      [itemId]: updatedCount,
    }));

    // Aquí, actualizamos el precio total del producto en el estado si es necesario
    setPrecioTotal((prevTotal) => ({
      ...prevTotal,
      [itemId]: updatedTotal,
    }));
  };

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
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 6,
        }}
      >
        <Text style={styles.title}>Mis Compras</Text>
        <Text style={{ marginTop: 20, fontSize: 16, fontWeight: "800" }}>
          {counterSales.length} Productos
        </Text>
      </View>
      <Divider />
      <FlatList
        data={counterSales}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          return (
            <>
              <Image
                source={{ uri: item.imagen }}
                style={{
                  width: 90,
                  height: 90,
                  alignSelf: "center",
                  position: "absolute",
                  top: 25,
                  left: 10,
                  zIndex: 100
                }}
                resizeMode="contain"
                
              />

              <View style={styles.cartItem}>
                <Card style={styles.card}></Card>
                <View style={styles.productSales}>
                  <Text style={styles.nameProduct}>{item.nombreProducto}</Text>
                  <Text style={styles.priceProduct}>
                    Total: ${precioTotal[item.id] || item.precioTotal}
                  </Text>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <IconButton
                      icon="minus"
                      iconColor="white"
                      size={10}
                      onPress={() =>
                        updateCounter(item.id, -1, item.contador, item.precio)
                      }
                      style={{ backgroundColor: "red", borderRadius: 10 }}
                    />
                    <Text style={{ marginTop: 9 }}>
                      {contador[item.id] || item.contador}
                    </Text>
                    <IconButton
                      icon="plus"
                      iconColor="white"
                      size={10}
                      onPress={() =>
                        updateCounter(item.id, 1, item.contador, item.precio)
                      }
                      style={{ backgroundColor: "red", borderRadius: 10 }}
                    />
                  </View>
                </View>
              </View>
            </>
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
    paddingTop: 30,
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
    width: 70,
    height: 65,
    backgroundColor: "#DFE2EA",
    borderRadius: 14,
    position: "relative",
  },
  cartItem: {
    marginTop: 40,
    paddingHorizontal: 20,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-start",
    //   backgroundColor: "red"
  },
  productSales: {
    width: "50%",
    paddingHorizontal: 20,
  },
  loginButton: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  nameProduct: {
    fontFamily: "Bela",
  },
  priceProduct: {
    fontFamily: "Bela",
  },
});

export default ShoppingCar;
