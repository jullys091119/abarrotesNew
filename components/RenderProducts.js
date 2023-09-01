import React, { useEffect, useState,useRef } from "react";
import { Text, Image, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useMyContext } from "../appContext/appContext";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";
import { View } from "react-native-animatable";
import { Icon } from "@ui-kitten/components";
import { SheetProvider } from "react-native-actions-sheet";
import ActionSheet from "react-native-actions-sheet";
import ShoppingProduct from "./ShoppingProduct";

export const RenderProducts = (props) => {
  const { setProducts, product, getCredentials } = useMyContext();
  const [productos, setProductos] = useState({});
  const [imagen, setImagen] = useState({});
  const [idProduct, setIdProduct] = useState()
  let inventoryBimbo = Object.values(productos);

  const getProducts = () => {
    axios
      .get(
        "https://abarrotes.msalazar.dev/jsonapi/node/productos?filter[field_proveedor]=" +
          props.proveedor +
          "&include=field_imagen",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
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

  const actionSheetRef = useRef();
  const actionSheetOpenProduct = (vidProduct) => {
    console.log(vidProduct, "vidprodict")
    setIdProduct(vidProduct)
    actionSheetRef.current?.show();
  };

  const CloseSheetModal = () => {
    actionSheetRef.current?.hide();
  };

  useEffect(() => {
    if (props.proveedor) {
      getProducts(); // Llamar a la función solo si props.proveedor está presente
    }
  }, [props.proveedor]);

  return (
    <>
      <FlatList
        style={styles.cardProduct}
        numColumns={2}
        keyExtractor={(item) => item.id}
        data={inventoryBimbo}
        renderItem={({ item, index }) => {
          return (
            <Card
              style={styles.card}
              onPress={() => {
                actionSheetOpenProduct(item.attributes.drupal_internal__nid);
              }}
            >
              <Text style={{ fontFamily: "Poppins", fontWeight: "600" }}>
                {item.attributes.field_nombre}
              </Text>
              {imagen.included && imagen.included[index] && (
                <Image
                  source={{
                    uri:
                      `https://abarrotes.msalazar.dev` +
                      imagen.included[index].attributes.uri.url,
                  }}
                  style={{
                    width: 130,
                    height: 100,
                    borderRadius: 10,
                    marginVertical: 10,
                  }}
                  resizeMode="contain"
                />
              )}
              <View style={styles.IconShopCar}>
                <IconViewShop />
              </View>
              <View
                style={{
                  height: 40,
                  width: 110,
                  transform: [{ rotate: "30deg" }],
                  backgroundColor: "red",
                  position: "absolute",
                  left: -40,
                  bottom: -45,
                }}
              ></View>
            </Card>
          );
        }}
      />
      <ActionSheet ref={actionSheetRef}>
       <View  style={styles.containerSheet}>
          <ShoppingProduct idProduct={idProduct}/>
        </View>
      </ActionSheet>
    </>
  );
};

styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    width: 160,
    height: 190,
    marginHorizontal: 10,
    marginVertical: 10,
    position: "relative",
    overflow: "hidden",
    padding: 10,
    paddingTop: 20,
  },

  IconShopCar: {
    backgroundColor: "gold",
    position: "absolute",
    right: -20,
    bottom: -30,
    height: 50,
    width: 60,
    borderTopLeftRadius: 17,
    paddingLeft: 15,
    paddingTop: 13,
  },
  containerSheet: {
    height: 900
  }
});
