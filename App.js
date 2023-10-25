import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import * as eva from "@eva-design/eva";
// import { Image } from "react-native-animatable";
import {
  ApplicationProvider,
  Layout,
  IconRegistry,
  Button,
  Icon,
} from "@ui-kitten/components";
import 'react-native-gesture-handler';
import { DefaultTheme, Divider, Provider as PaperProvider } from 'react-native-paper';
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { default as mapping } from "./mapping.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "./components/HomeScreen";
import Products from "./components/Products";
import Offert from "./components/Offert";
import Favorites from "./components/Favorites";
import ModalBimbo from "./modalScreen/Bimbo";
import Login from "./components/Login";
import UpdateUser from "./modalScreen/UpdateUser";
import { Register } from "./modalScreen/Register";
import { StateProvider, useMyContext } from "./appContext/appContext";
import { useFonts } from "expo-font";
import { Loading } from "./components/Loading";
import { RenderProducts } from "./components/RenderProducts";
import { Context } from "./appContext/appContext";
import { createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";
import { logout, IconPower } from "./utils/helpers";
import UserInfo from "./modalScreen/UserInfo";
import ShoppingCar from "./modalScreen/ShoppingCar";
import ShoppingProduct from "./components/ShoppingProduct";
import { NativeBaseProvider, Box, Center } from "native-base";
import { EmailUser, NameUser, ImagePerfil} from "./utils/helpers";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const  MyTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        // tabBarActiveTintColor: '', // Color de la pestaña activa
        // tabBarInactiveTintColor: 'red', // Color de la pestaña inactiva
        tabBarStyle: {
          backgroundColor: '#f5f5f5', // Color de fondo de la barra de navegación
        },
    }}
    >
      <Tab.Screen
        name="Tiendita de la Esquina"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={30} />
          ),
        }}
      />

      <Tab.Screen
        name="Ofertas"
        component={Offert}
        options={{
          headerStyle: {
            backgroundColor: "red",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          tabBarLabel: "Productos",
          tabBarActiveTintColor: "gray",
          tabBarStyle: { backgroundColor: "white" },
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="tag" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="Favoritos"
        component={Favorites}
        options={{
          headerStyle: {
            backgroundColor: "red",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          tabBarLabel: "Productos",
          tabBarActiveTintColor: "gray",
          tabBarStyle: { backgroundColor: "white" },
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="heart" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );

}


function CustomDrawerContent({ navigation }) {
  return (
    <DrawerContentScrollView>
      {/* Agregar contenido personalizado aquí */}
        <ImagePerfil/>
        <EmailUser/>
        <Divider/>
        <NameUser/>
        <IconPower/>
    </DrawerContentScrollView>
  );
}



function MyDrawer() {
  return (
    <Drawer.Navigator  drawerContent={props => <CustomDrawerContent {...props}  initialRouteName="MyTabs" />}>
      <Drawer.Screen 
        name="MyTabs"
        component={MyTabs}
        options={{
         headerShown: false,
        }}
      /> 

    </Drawer.Navigator>
  );

}


export default function App() {
  console.log("app")
  const [fontLoaded] = useFonts({
    Bela: require("./assets/fonts/Belanosima-SemiBold.ttf"),
    BelaRegular: require("./assets/fonts/Belanosima-Regular.ttf"),
    Poppins: require("./assets/fonts/Poppins-Light.ttf"),
  });
  if (!fontLoaded) return null;
  return (
    <StateProvider>
      <NativeBaseProvider>
      <PaperProvider>
        <>
          <IconRegistry icons={EvaIconsPack} />
          <ApplicationProvider {...eva} theme={eva.light} customMapping={mapping}>
            <NavigationContainer style={styles.container}>
              <Stack.Navigator>
                <Stack.Screen
                  name="MyDrawer"
                  component={MyDrawer}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Loading"
                  component={Loading}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="MyTabs"
                  component={MyTabs}
                  options={{ headerShown: false }}
                />
  
                <Stack.Screen
                  name="RenderProducts"
                  component={RenderProducts}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="HomeScreen"
                  component={HomeScreen}
                  options={{ headerShown: false }}
                />

                <Stack.Screen
                  name="Register"
                  component={Register}
                  options={{
                    headerShown:false,
                    title: "Registro"
                  }}
                />

                <Stack.Screen
                  name="UserInfo"
                  component={UserInfo}
                  options={{
                    headerShown:false,
                    title: "Registro"
                  }}
                />

                <Stack.Screen    
                  name="ShoppingCar"
                  component={ShoppingCar}
                  options={{
                    headerShown:false,
                  
                  }}
                />

                <Stack.Screen
                  name="ModalBimbo"
                  component={ModalBimbo}
                  options={({ navigation }) => ({
                    title: "Bimbo",
                    headerStyle: {
                      backgroundColor: "red",
                    },
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                      fontWeight: "bold",
                    },
                    headerLeft: () => (
                      <Icon
                        style={styles.icon}
                        fill="#fff"
                        name="arrow-back-outline"
                        onPress={() => {
                          navigation.navigate("MyTabs");
                        }}
                      />
                    ),
                  })}
                />
                <Stack.Screen
                  name="UpdateUser"
                  component={UpdateUser}
                  options={({ navigation }) => ({
                    title: "Actualizar Datos",
                    headerStyle: {
                      backgroundColor: "red",
                    },
                    headerTintColor: "#fff",
                    headerTitleStyle: {
                      fontWeight: "bold",
                    },
                    headerLeft: () => (
                      <Icon
                        style={styles.icon}
                        fill="#fff"
                        name="arrow-back-outline"
                        onPress={() => {
                          navigation.navigate("MyTabs");
                        }}
                      />
                    ),
                  })}
                ></Stack.Screen>
              </Stack.Navigator>
              <StatusBar style="auto" />
            </NavigationContainer>
          </ApplicationProvider>
        </>
      </PaperProvider>
      </NativeBaseProvider>
    </StateProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 32,
    height: 32,
  },
});
