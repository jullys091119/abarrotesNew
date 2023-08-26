import React, {useContext, useEffect, useState} from 'react'
import { Text, StyleSheet, TouchableWithoutFeedback, View, TouchableOpacity, Linking} from 'react-native';
import { Layout,  Icon, Input, Button} from '@ui-kitten/components';
import axios from 'axios';
import {useMyContext} from '../appContext/appContext';
import HomeScreen from './HomeScreen';



const Login = ({navigation}) => {

  const [secureTextEntry, setSecureTextEntry] = React.useState(true);

  const {login, user, password, setUser, setpassword, getCredentials} = useMyContext()

  const loginBtn = async () => {
    let status = await login()
     if (status == 200) {
       navigation.navigate("MyTabs")
       navigation.navigate("MyDrawer")
       //etCredentials()
     }
    
  } 
  
  useEffect(()=> {

  })
  
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
            <Button style={styles.button} size='large' onPress={()=>{loginBtn()}}>
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


