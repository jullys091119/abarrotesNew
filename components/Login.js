import React, { useState } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, StyleSheet,TouchableWithoutFeedback } from 'react-native';
import { Input,Icon } from '@ui-kitten/components';
import axios from 'axios';
import {useMyContext} from '../appContext/appContext';
import HomeScreen from './HomeScreen';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Dialog, Portal } from "react-native-paper";

const Login = ({navigation}) => {
  const {login, user, password, setUser, setPassword, getCredentials} = useMyContext()
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [visible, setVisible] = useState(false);
  const [msgError, setMsgError] = useState({})
  const [statusError, setStatusError] = useState("")


  const handleLogin = async () => {
    let status = await login()
    setStatusError(status)
    console.log(status, "status")
    if(status !== 200) {
      validate()
    }
    if (status == 200) {
      navigation.navigate("MyTabs")
      navigation.navigate("MyDrawer")
      //etCredentials()
    } 
  };
 
  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = () => (
    <TouchableOpacity onPress={toggleSecureEntry} style={styles.icon}>
     <MaterialCommunityIcons name={secureTextEntry ? 'eye-off' : 'eye'} size={24} color="gray" />
    </TouchableOpacity>
  )

  const renderIconPerson = () => (
    <Icon
    style={styles.icon}
    fill='#8F9BB3'
    name='person-outline'
    color="black"
  />
  )

  const handleRegister =()=> {
    navigation.replace("Register")
  }


  const hideDialog = () => setVisible(false);
  const showDialog= () => setVisible(true)
  
  const DialogValidationRegister=(props)=> (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Icon icon="alert"  color='red' size={40}/>
        <Dialog.Title style={styles.title}>Error</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium" style={styles.title}>{props.msgError}</Text>
        </Dialog.Content>
      </Dialog>
    </Portal>
  )

  const validate = () => {
    const msgErrors = {
      errorEmptyFields: "Complete todos los campos",
      blockedUser: "Usuario bloqueado temporalmente",
      passwordIncorrect: "Credenciales incorrectas",
      noInternet: "Problemas al conectar internet"
    }
    if([user,password].includes("")) {
      setMsgError(msgErrors.errorEmptyFields)
      showDialog()
    }
    if(statusError == 403) {
      setMsgError(msgErrors.blockedUser)
      showDialog()
    }

    if(statusError == 400) {
      setMsgError(msgErrors.passwordIncorrect)
      showDialog()
    }

    if(statusError == 500) {
      setMsgError(msgErrors.noInternet)
      showDialog()
    }

  }

  return (
    <View style={styles.container}>
      <View style={{marginTop:  130}}>
      <Text style={styles.welcomeText}>Hola.</Text>
        <Text style={styles.welcomeText}>Bienvenido</Text>
      </View>
      <View style={styles.formContainer}>
    
        <Input
          value={user}
          label="Usuario"
          style={styles.input}
          onChangeText={user => setUser(user)}
          accessoryRight={renderIconPerson}
        />
        <Input
          value={password}
          style={styles.input}
          label="Contraseña"
          secureTextEntry={secureTextEntry}
          value={password}
          onChangeText={password => setPassword(password)}
          accessoryRight={renderIcon}
          onBlur={false}
        />
        <View style={styles.resetPassword}>
        <TouchableWithoutFeedback >
          <Text style={styles.resetText}>Olvidaste la Contraseña?</Text>
        </TouchableWithoutFeedback>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
        <TouchableWithoutFeedback style={styles.resetPassword} onPress={()=>{handleRegister()}}>
          <Text style={styles.createAccount}>Crear Cuenta</Text>
        </TouchableWithoutFeedback>
      </View>
      <DialogValidationRegister msgError={msgError}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    width: '80%',
    alignSelf: "center",
    marginVertical: 80
  },

  input: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    backgroundColor: "none",
    borderColor: "gray",
    marginVertical: 15,
    borderRadius: 0
  },
  welcomeText: {
    fontFamily: "BelaRegular",
    fontSize: 40,
    marginHorizontal: 30,
    fontWeight: "900"
  },
  loginButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 70
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  resetText: {
    fontSize: 12,
    textAlign: "right",
    fontFamily: "BelaRegular",
    lineHeight: 30,
    fontWeight: "900"
  },
  createAccount: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Poppins",
    fontWeight: "900",
    marginTop: -30
  },
  label: {
   backgroundColor: "green"
  },
  icon: {
    width: 32,
    height: 32,
  },
  title: {
    textAlign: "center"
  }
});

export default Login;
