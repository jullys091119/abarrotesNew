import React, {useContext, useEffect, useState} from 'react'
import { Text, StyleSheet, TouchableWithoutFeedback, View, TouchableOpacity, Linking} from 'react-native';
import { Layout,  Icon, Input, Button} from '@ui-kitten/components';
import axios from 'axios';
import {useMyContext} from '../appContext/appContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {

  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const [user,setUser] = useState("admin")
  const [password, setpassword] = useState("root")

  const login =  () => {
    axios.post('https://abarrotes.msalazar.dev/user/login?_format=json', {
     "name": user,
     "pass": password,
      headers : {
       "Content-Type" : "application/json",
      },
    })
    .then(async function (response) {
      console.log("Bienvenido logueado")
      setTokenLocalStorage(response.data.csrf_token)
      await AsyncStorage.setItem("@UID", response.data.current_user.uid)
      navigation.replace("MyTabs")
    })
    .catch(function (error) {
      console.log(error, "error de logueo")
    });
  }

  //colocando token
  const setTokenLocalStorage = async (token) => {
    await AsyncStorage.setItem("@token", token)
    console.log("se metio a la local storage el token")
  }
  
  return (
    <Layout style={styles.container}>
      <Layout>
        <Layout style={{ marginVertical: 30}}>
          <Text style={{textAlign: "center", color: "red", fontSize: 20, fontWeight: "600"}}>Inicia sesion</Text>
        </Layout>
        <Layout style={{marginTop: 0}}>
        <Input
            label="Usuario"
            placeholder=' Ingresa tu usuario'
            value={user}
            onChangeText={user => setUser(user)}
            style={styles.inputRadius}
            size='large'  
            placeholderTextColor='#FF3D71'
            textStyle={{ fontSize: 11 }}
          />
          
          <Input
            value={password}
            label='Contraseña'
            size='large'  
            placeholder='Ingresa tu contrasena'
            // caption={renderCaption}
            secureTextEntry={secureTextEntry}
            onChangeText={password => setpassword(password)}
            style={[styles.inputRadius, styles.input]}
            placeholderTextColor='#FF3D71'
            textStyle={{ fontSize: 11 }}
          />
           
          <Layout>
            <TouchableWithoutFeedback >
             <Text style={{textDecorationLine: "underline", textAlign: "center", paddingVertical: 20, color: "#FF3D71"}}>Olvidaste tu contrasena?</Text>
            </TouchableWithoutFeedback>
          </Layout>

          <Layout>
            <Button style={styles.button} size='large' onPress={login}>
              Iniciar sesion
            </Button>
          </Layout>

        </Layout>    
      </Layout>
    </Layout>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20
    },
    
    captionIcon: {
      width: 10,
      height: 10,
      marginRight: 5
    },
    captionText: {
      fontSize: 12,
      fontWeight: "400",
      // fontFamily: "opensans-regular",
      color: "#8F9BB3",
    },
    inputRadius: {
      borderRadius: 9,
      marginVertical: 4,
      backgroundColor: "#FFD6D9",
      fontSize: 9
    },
    button: {
      backgroundColor: "#FF0000",
      width: 200,
      alignSelf: "center",
      borderColor: "transparent",
      borderRadius: 13
    }
});
  

export default Login 


