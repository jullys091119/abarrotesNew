import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { useMyContext } from "../appContext/appContext";
import axios from "axios";

const ShoppingProduct = (props) => {
  const { setProducts, product, getCredentials } = useMyContext();
  const [productos, setProductos] = useState({});
  const [imagen, setImagen] = useState({});
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
        setImagen(response.data.field_imagen[0].url);
        setProductos(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getProducts();
    console.log(imagen)
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri:imagen.toString(),
          }}
          style={{
            width: 330,
            height: 290,
          }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 300,
  },
});

export default ShoppingProduct;
