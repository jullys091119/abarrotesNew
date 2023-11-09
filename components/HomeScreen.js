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
import { Card, Layout, Input, Icon, Avatar } from "@ui-kitten/components";
import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalBimbo from "../modalScreen/Bimbo";
import { Badge } from "react-native-paper";

//Context API
import { useMyContext } from "../appContext/appContext";
import { RenderProducts } from "./RenderProducts";
import { Value } from "react-native-reanimated";


function HomeScreen({ navigation }) {
  const { searchProduct,
    value,
    setValue,
    productos,
    imagen,
    name,
    getCredentials,
    logout,
    setProducts,
    products,
    counterHome,
    counterHomeScreen,
    miniPerfil,
    productSearch ,
    productCoincidences
    
  } = useMyContext();
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [index, setIndex] = useState("");
  const drawer = useRef(null);
  const [currentProveedor,setCurrentProveedor] = useState("")
  const [drawerPosition, setDrawerPosition] = useState('left');
   

  const renderShoppingCar = () => {
    navigation.push("ShoppingCar")
  }

  const IconMenu = (props) => (
    <MaterialCommunityIcons
      name="cart-outline"
      color="black"
      size={25}
      style={styles.iconMenu}
      onPress={()=>{renderShoppingCar()}}
    />
  );

  const IconViewShop = (props) => (
    <MaterialCommunityIcons
      name="storefront"
      color="white"
      size={25}
      style={styles.iconMenu}
    />
  );

  const MiniImagePerfil = () => (
    <Avatar
      source={{ uri: `https://abarrotes.msalazar.dev` + miniPerfil }}
      style={{
        marginVertical:-10,
        width: 50,
        height: 50,
        borderWidth:10,
      }}
  />
  )
  const SearchIcon = (props) => (
    <Icon style={styles.icon} fill="#8F9BB3" name="search-outline"  />
    );
    const openProducts = (index, proveedor) => {
      for (let i = 0; i <productos.length; i++) {
        setSelectedCardIndex(index);
        setIndex(index);
        setCurrentProveedor(proveedor)
      }
    };
    
    useEffect(() => {
    getCredentials()
    }, [counterHomeScreen()]);


    const ShowProductCoincidences = ( ) => {
      return (
        <>
          <FlatList
            style={styles.cardProduct}
            numColumns={2}
            keyExtractor={(item) => item.id}
            data={productCoincidences}
            renderItem={({ item, index }) => {
              return (
                <Card
                  style={styles.cardCoincidences}
                  onPress={() => {
                    // actionSheetOpenProduct(item.attributes.drupal_internal__nid);
                  }}
                >
                  <Text style={{ fontFamily: "Poppins", fontWeight: "600" }}>
                    {item.nombre}
                  </Text>
                  {item.imagen && (
                    <Image
                      source={{
                        uri:
                         `https://abarrotes.msalazar.dev` + item.imagen,
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
          {/* <ActionSheet ref={actionSheetRef}>
           <View  style={styles.containerSheet}>
              <ShoppingProduct idProduct={idProduct}  CloseSheetModal={CloseSheetModal}/>
            </View>
          </ActionSheet> */}
        </>
      );
    }
   
    useEffect(()=> {

    }, [productCoincidences])
    const handleReactiveText = ( value ) =>  {
      const regex = new RegExp('\\b' + value + '\\b', 'i');
      setValue(value)
      let coincidences = []
      for (let i = 0; i < productSearch.length; i++) {
        const product = productSearch[i];
        if (regex.test(product)) {
           coincidences.push(product)
        }
      }
     
      if(value.length <= 0) {
        coincidences = []
      } else if (coincidences.length !== []) {
        searchProduct(coincidences)
      }
    }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View>
          <View style={styles.header}>
            {/* <IconPower/> */}
            <IconMenu />
            <Badge style={styles.badge}>{counterHome==null?0:counterHome}</Badge>
          </View>
          <View style={styles.welcomeUser}>
            <Text
              style={{ fontFamily: "Bela", fontSize: 30, fontWeight: "100", color: "#000" }}
            >
              Hola, <Text>{name}</Text>
            </Text>
            <View style={styles.miniPerfil}>
             <MiniImagePerfil/>
            </View>
            <Text style={{ fontFamily: "BelaRegular", color: "gray" }}>
              Es hora de encontrar tu producto!
            </Text>
          </View>



          <View style={styles.searchProduct}>
            <Input
             value={value}
              style={styles.inputSearch}
              placeholder="Buscar Producto"
              accessoryLeft={<SearchIcon />}
              onChangeText={handleReactiveText}
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
                        openProducts(index + 1, item.attributes.field_nombre_proveedor);
                      }}
                    >
                      <Image
                        source={{
                          uri:
                            "https://abarrotes.msalazar.dev" +
                            imagen.included[index].attributes.uri.url
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
          {currentProveedor && <RenderProducts proveedor={currentProveedor}/>}
          {productCoincidences &&  <ShowProductCoincidences/>}
         
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
    justifyContent: "flex-end",
    height: 70,
    marginTop: 40,
    paddingRight: 10
  },
  iconMenu: {
    paddingHorizontal: 5,
    
  },
  welcomeUser: {
    height: 90,
    paddingHorizontal: 10,
  },
  searchProduct: {
    height: 90,
    marginHorizontal: 10,
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
    paddingHorizontal: 10,
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
  cardCoincidences: {
    backgroundColor: "white",
    borderRadius:20,
    width: 164,
    height: 190,
    marginHorizontal: 7,
    marginVertical: 10,
    position: "relative",
    overflow: "hidden",
    padding: 10,
    paddingTop: 0,
  },
  boxCard: {
    marginTop: 0,
    height: 300,
  },
  badge: {
    position: "absolute",
    right: 8,
    top: -12
  }, 
  ImagePerfil: {
     height: 10
  },
  miniPerfil: {
    alignSelf: "flex-end",
    marginTop: -30
  },
  IconShopCar: {
    backgroundColor: "gold",
    position: "absolute",
    right: -26,
    bottom: -12,
    height: 50,
    width: 60,
    borderTopLeftRadius: 17,
    paddingLeft: 7,
    paddingTop: 13,
  },
});

export default HomeScreen;
