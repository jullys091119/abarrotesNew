import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  VirtualizedList,
  DrawerLayoutAndroid,
  Button,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Card, Layout, Input, Icon } from "@ui-kitten/components";
import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalBimbo from "../modalScreen/Bimbo";

//Context API
import { useMyContext } from "../appContext/appContext";
import { RenderProducts } from "./RenderProducts";


function HomeScreen({ navigation }) {
  const { productos, imagen, name, getCredentials, logout } = useMyContext();
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [index, setIndex] = useState("");
  const drawer = useRef(null);
  const [drawerPosition, setDrawerPosition] = useState('left');
  
    const logoutBtn =  async () => {
      const status = await logout()
      if(status === 200) {
        navigation.push("Login")
      }
    }
    


  const IconMenu = (props) => (
    <MaterialCommunityIcons
      name="menu-open"
      color="black"
      size={25}
      style={styles.iconMenu}
    />
  );

  const IconShopCar = (props) => (
    <MaterialCommunityIcons
      name="cart-outline"
      color="black"
      size={25}
      style={styles.iconMenu}
      onPress={()=> {logoutBtn()}}
    />
  );
  
  const SearchIcon = (props) => (
    <Icon style={styles.icon} fill="#8F9BB3" name="search-outline" />
    );
    
    const openProducts = (index) => {
      for (let i = 0; i < productos.length; i++) {
        if (index === i) {
          setSelectedCardIndex(index);
          setIndex(index);
        }
      }
    };
    
  useEffect(() => {
   getCredentials()
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View>
          <View style={styles.header}>
            <IconMenu onPress={()=> navigation.openDrawer()} />
            <IconShopCar />
          </View>
          <View style={styles.welcomeUser}>
            <Text
              style={{ fontFamily: "Bela", fontSize: 30, fontWeight: "100" }}
            >
              Hola, {name}
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
            <FlatList
              keyExtractor={(item) => item.id}
              data={productos}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => {
                return (
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Card
                      style={styles.card}
                      onPress={() => {
                        openProducts(index + 1);
                      }}
                    >
                      <Image
                        source={{
                          uri:
                            "https://abarrotes.msalazar.dev" +
                            imagen.included[index].attributes.uri.url,
                        }}
                        style={{
                          width: 70,
                          height: 49,
                          alignSelf: "center",
                        }}
                        resizeMode="contain"
                      />
                    </Card>
                  </View>
                );
              }}
            />
          </View>
        </View>
        <View style={styles.boxCard}>
          {selectedCardIndex === index && <RenderProducts />}
        </View>
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 70,
  },
  iconMenu: {
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  welcomeUser: {
    height: 90,
    paddingHorizontal: 30,
  },
  searchProduct: {
    height: 90,
    marginHorizontal: 30,
    marginVertical: 0,
  },
  icon: {
    width: 24,
    height: 24,
  },
  inputSearch: {
    borderRadius: 13,
  },
  navBarBox: {
    paddingHorizontal: 34,
    marginTop: -30,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 8,
    elevation: 3,
    marginRight: 20,
    height: 100,
    width: 100,
    padding: 10,
  },
  boxCard: {
    marginTop: 30,
    height: 300,
  },
});

export default HomeScreen;
