
import React,{useState} from 'react'
import { Text,View,TextInput, SafeAreaView, StyleSheet} from 'react-native'
import { Input, Layout, Button, Icon } from '@ui-kitten/components';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
export const Register = ({navigation}) => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password,setPassword] =  useState("")
  const [user,setUser] =  useState("")

  const handleSave = () => {
    const options = {
      method: 'POST',
      url: 'https://abarrotes.msalazar.dev/user/register?_format=json',
      params: {_format: 'json'},
      headers: {'Content-Type': 'application/json'},
      data: {
        name: [{ value: user }],
        pass: [{ value: password }],  
        mail: [{ value: email }],  
        field_nombre_usuario: [{ value: name }], 
        field_apellidos_usuario: [{ value: lastName }], 
        field_direccion_usuario: [{ value: address }], 
        field_telefono_usuario:  [{ value: phone }], 
      }
     }
    axios.request(options).then((response)=>{
      console.log(response)
      alert("Usiario registrado")
      navigation.replace("MyTabs")
    }).catch((error)=>{
      console.log(error)
    })
  };

  const IconUser = () => {
    return( 
    <MaterialCommunityIcons name="account" color={"#FF0000"} size={25} />
    )
  }

  const IconPassword = () => {
    return( 
    <MaterialCommunityIcons name="key" color={"#FF0000"} size={25} />
    )
  }

  const IconEmail = () => {
    return( 
    <MaterialCommunityIcons name="email" color={"#FF0000"} size={25} />
    )
  }

  const IconPhone = () => {
    return( 
    <MaterialCommunityIcons name="phone" color={"#FF0000"} size={25} />
    )
  }
  
  const IconAddress = () => {
    return( 
    <MaterialCommunityIcons name="map-marker-radius" color={"#FF0000"} size={25} />
    )
  }
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView>

          <Layout style={styles.input}>
            <Input
              label="Usuario"
              value={user}
              onChangeText={setUser}
              placeholder="Ingrese Usuario"
              style={styles.inputRadius}
              accessoryRight={(props) => <IconUser {...props} />}
            />
            </Layout>
            
          <Layout style={styles.input}>
            <Input
              label="Contrasena"
              value={password} 
              onChangeText={setPassword}
              placeholder="Ingrese su contrasena"
              textContentType='password'
              style={styles.inputRadius}
              accessoryRight={(props) => <IconPassword {...props} />  }
            />
          </Layout>

          <Layout style={styles.input}>
            <Input
              label="Email :"
              value={email}
              onChangeText={setEmail}
              placeholder="Ingrese su email"
              style={styles.inputRadius}
              accessoryRight={(props) => <IconEmail {...props} />}
            />
          </Layout>

          <Text style={styles.datosPersonales}>Datos personales</Text>

          <Layout style={styles.input}>
            <Input
              label="Nombre"
              value={name}
              onChangeText={setName}
              placeholder="Ingrese su nombre"
              style={styles.inputRadius}
              accessoryRight={(props) => <IconUser {...props} />}
            />
          </Layout>
        
          <Layout style={styles.input}>
            <Input
              label="Apellidos"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Ingrese Apellidos"
              style={styles.inputRadius}
            />
          </Layout>

          <Layout style={styles.input}>
            <Input
              label="Direccion :"
              value={address}
              onChangeText={setAddress}
              placeholder="Ingrese su direccion"
              style={styles.inputRadius}
              accessoryRight={(props)=> <IconAddress {...props}  />}
            />
            
          </Layout>
          
          <Layout style={styles.input}>
            <Input
              label="Teléfono :"
              value={phone}
              onChangeText={setPhone}
              placeholder="Ingrese su teléfono"
              style={styles.inputRadius}
              accessoryRight={(props)=> <IconPhone {...props}  />}
            />
          </Layout>

          <Button style={styles.button}  onPress={handleSave}>Resgistrate</Button>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    display: "flex",
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "white",
    paddingHorizontal: 30,
    paddingVertical: 30
  },
 
  input: {
    marginVertical: 15
  },

  button: {
    backgroundColor: "#FF0000",
    width: "100%",
    alignSelf: "center",
    borderColor: "transparent",
    borderRadius: 13,
    marginVertical: 20
  },

  datosPersonales: {
    fontSize: 18,
    fontWeight: "900",
    marginVertical: 30,
    color: "#FF0000"
  },

})