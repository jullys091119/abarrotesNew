import { ScrollView, StyleSheet, Text, View, Image, FlatList } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card, Layout, Input, Icon } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";

//Context API
import { useMyContext } from "../appContext/appContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

function HomeScreen({ navigation }) {
  const [token, setToken] = useState("");
   
  const {nameUser, productos, imagen} = useMyContext()
  //let inventario = Object.values(productosInventory)
  //console.log(imagen.included[0].attributes.uri.url)
   
  const IconMenu =(props)=>(
    <MaterialCommunityIcons name="menu-open" color="black" size={25}  style={styles.iconMenu}/>
  )
  
  const IconShopCar =(props)=>(
    <MaterialCommunityIcons name="cart-outline" color="black" size={25}  style={styles.iconMenu}/>
  )

  const SearchIcon =(props)=>(
    <Icon
      style={styles.icon}
      fill='#8F9BB3'
      name='search-outline'
   />
  )


  useEffect(() => {}, []);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View>
            <View style={styles.header}>
              <IconMenu />
              <IconShopCar />
            </View>
            <View style={styles.welcomeUser}>
              <Text
                style={{ fontFamily: "Bela", fontSize: 30, fontWeight: "100" }}
              >
                Hola, {nameUser}
              </Text>
              <Text style={{ fontFamily: "BelaRegular", color: "gray" }}>
                Es hora de encontrar tu producto!
              </Text>
            </View>
            <View style={styles.searchProduct}>
              <Input
                style={styles.inputSearch}
                placeholder="Buscar Producto"
                accessoryLeft={<SearchIcon />}
                onChangeText={(nextValue) => setValue(nextValue)}
              />
            </View>
            <View style={styles.navBarBox}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View>
                  <FlatList
                    style={styles.navBar}
                    keyExtractor={(item) => item.id}
                    data={productos}
                    renderItem={({ item, index }) => {
                      return (
                        <Card>
                          <Image
                            source={{
                              uri:
                                "https://abarrotes.msalazar.dev" +
                                imagen.included[index].attributes.uri.url,
                            }}
                            style={{
                              width: 120,
                              height: 100,
                              alignSelf: "center",
                              borderRadius: 10,
                              marginVertical: 10,
                            }}
                            resizeMode="contain"
                          />
                        </Card>
                      );
                    }}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    flex: 1
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 70
  },
  iconMenu: {
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  welcomeUser: {
    height: 90,
    paddingHorizontal: 30
  },
  searchProduct: {
    height: 90,
    marginHorizontal: 30,
    marginVertical: 0
  },
  icon: {
    width: 24,
    height: 24
  },
  inputSearch: {
    borderRadius: 13,
  },
  navBarBox: {
    paddingHorizontal: 34,
    marginTop: -30
  },
  navBar: {
   display: "flex",
   flexDirection: "row",
   gap: 15,
   overflow:"hidden",
  }
})


export default HomeScreen;
