import React, { useEffect, useState } from "react";
import { Text, Image, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useMyContext } from "../appContext/appContext";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";
import { View } from "react-native-animatable";
import { Icon } from "@ui-kitten/components";

export const RenderProducts = (props) => {

  const {setProducts, product, getCredentials} = useMyContext()
  const [productos, setProductos] = useState({});
  const [imagen, setImagen] = useState({});
  let productsRender = Object.values(productos, imagen);
  let imagenRender = Object.values(imagen);

  const getProducts = () => {
    axios
      .get("https://abarrotes.msalazar.dev/jsonapi/node/productos?filter[field_proveedor]=" + props.proveedor + "&include=field_imagen", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        setImagen(response.data);
        setProductos(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const IconViewShop = (props) => (
    <MaterialCommunityIcons
      name="storefront"
      color="white"
      size={25}
      style={styles.iconMenu}
    />
  );
  useEffect(() => {
    if (props.proveedor) {
      getProducts(); // Llamar a la función solo si props.proveedor está presente
    }
  }, [props.proveedor]);// se verifica de entrada si esta variable es

  return (
    <FlatList
      style={styles.cardProduct}
      numColumns={2}
      keyExtractor={(item, index) => index.toString()}
      data={productsRender}
      renderItem={({ item, index }) => {
        return (
          <Card style={styles.card} key={index}>
            <Text style={{ fontFamily: "Poppins", fontWeight: "600" }}>
              {item.attributes.field_nombre}
            </Text>
            <Image
              source={{
                uri:
                  `https://abarrotes.msalazar.dev` +
                  imagenRender[2][0].attributes.uri.url,
              }}
              style={{
                width: 90,
                height: 90,
                borderRadius: 10,
                marginVertical: 10,
              }}
            />
            <View style={styles.IconShopCar}>
              <IconViewShop />
            </View>
          </Card>
        );
      }}
    />
  );
};

styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    width: 160,
    height: 180,
    marginHorizontal: 10,
    marginVertical: 10,
    position: "relative",
    overflow: "hidden",
    padding: 10,
    paddingTop: 20,
  },

  IconShopCar: {
    backgroundColor: "#87cd79",
    position: "absolute",
    right: -20,
    bottom: -30,
    height: 50,
    width: 60,
    borderTopLeftRadius: 17,
    paddingLeft: 15,
    paddingTop: 13,
  },
});
