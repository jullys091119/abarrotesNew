import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Input, Button, Icon, IconElement,Layout,  InputAccessory } from '@ui-kitten/components';
import { useMyContext } from '../appContext/appContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const UpdateUser = ({navigation}) => {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
   
  //const  {apellidoUser, direccionUser, telefonoUser, emailUser} = useMyContext()

  const getUser = async () => {
    try {
    const name_user = await AsyncStorage.getItem("@name")
    setName(name_user)
    const lastname_user = await AsyncStorage.getItem("@lastname")
    setLastname(lastname_user)
    const address_user = await AsyncStorage.getItem("@address")
    setAddress(address_user)
    const phone_user = await AsyncStorage.getItem("@phone")
    setPhone(phone_user)
    const email_user = await AsyncStorage.getItem("@email")
    setEmail(email_user)
  } catch (error) {
      console.log(error)
    }
  }

 
  const handleSave = () => {
   const options = {
      method: 'PATCH',
      url: 'http://abarrotes.msalazar.dev/user/1',
      params: {_format: 'json'},
      headers: {'Content-Type': 'application/json'},
      data: {
        field_nombre_usuario: [{value: name}],
        field_apellidos_usuario: [{value: lastname}],
        field_telefono_usuario: [{value: phone}],
        field_direccion_usuario: [{value: address}],
        field_email_usuario: [{value: email }],
      }
    }
   axios.request(options).then((response)=>{
     navigation.replace("MyTabs")
   }).catch((error)=>{console.log(error)})
  };

  useEffect(()=>{ 
    getUser()
  },[])
 
  return (
    <View style={styles.container}>
      <ScrollView>
        <Layout style={styles.input}>
          <Input
            label="Nombre"
            value={name}
            onChangeText={setName}
            placeholder="Ingrese su nombre"
          />
        </Layout>
        <Layout style={styles.input}>
          <Input
            label="Apellidos"
            value={lastname}
            onChangeText={setLastname}
            placeholder="Ingrese Apellidos"
          />
        </Layout>
        <Layout style={styles.input}>
          <Input
            label="Direccion :"
            value={address}
            onChangeText={setAddress}
            placeholder="Ingrese su direccion"
          />
        </Layout>
      
        <Layout style={styles.input}>
          <Input
            label="Email :"
            value={email}
            onChangeText={setEmail}
            placeholder="Ingrese su email"
          />
        </Layout>
        <Layout style={styles.input}>
          <Input
            label="Teléfono :"
            value={phone}
            onChangeText={setPhone}
            placeholer="Ingrese su teléfono"
          />
        </Layout>
        <Button style={styles.button} onPress={handleSave}>Guardar</Button>
      </ScrollView>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 30,
    backgroundColor: "white"
  },
  button: {
    backgroundColor: "#FF0000",
    width: "100%",
    alignSelf: "center",
    borderColor: "transparent",
    borderRadius: 13,
    marginVertical: 20
  },
  icon: {
    width: 32,
    height: 32,
  },
  input: {
    marginVertical: 10,
  }
});

export default UpdateUser;
