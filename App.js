import 'react-native-gesture-handler';
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import * as eva from "@eva-design/eva";
import {
  ApplicationProvider,
  Layout,
  IconRegistry,
  Button,
  Icon,
} from "@ui-kitten/components";
import "react-native-gesture-handler";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { default as mapping } from "./mapping.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "./components/HomeScreen";
import Products from "./components/Products";
import Offert from "./components/Offert";
import Favorites from "./components/Favorites";
import MyAccount from "./components/MyAccount";
import ModalBimbo from "./modalScreen/Bimbo";
import Login from "./components/Login";
import UpdateUser from "./modalScreen/UpdateUser";
import { Register } from "./modalScreen/Register";
import { StateProvider, useMyContext } from "./appContext/appContext";
import { useFonts } from "expo-font";
import { Loading } from "./components/Loading";
import { RenderProducts } from "./components/RenderProducts";
import { Title } from "react-native-paper";
import { Context } from "./appContext/appContext";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useAppContext } from './appContext/appContext';


const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
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
        name="Productos"
        component={Products}
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
            <MaterialCommunityIcons
              name="shopping-search"
              color={color}
              size={30}
            />
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
      <Tab.Screen
        name="Mi Cuenta"
        component={MyAccount}
        options={({ navigation }) => ({
          headerStyle: {
            backgroundColor: "red",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          tabBarLabel: "Mi Cuenta",
          tabBarActiveTintColor: "gray",
          tabBarStyle: { backgroundColor: "white" },
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={30} />
          ),
          // headerRight: () => <IconRender />,
        })}
      />
    </Tab.Navigator>
  );
}



function Article() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Article Screen</Text>
    </View>
  );
}

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen 
       name="MyTabs"
       component={MyTabs}
      //  options={{
      //   headerShown: false,
      // }}
       />
      <Drawer.Screen name="Article" component={Article} />
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
    <StateProvider MyTabs={MyDrawer}>
      <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light} customMapping={mapping}>
          <NavigationContainer style={styles.container}>
            <Stack.Navigator>
              <Stack.Screen
                name="MyDrawer"
                options={{
                  headerShown: false,
                }}
                component={MyDrawer}
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
                options={({ navigation }) => ({
                  title: "  Bienvenido",
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
                name="HomeScreen"
                component={HomeScreen}
                options={{ headerShown: false }}
              />

              <Stack.Screen
                name="Register"
                component={Register}
                options={({ navigation }) => ({
                  title: "Registro",
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
