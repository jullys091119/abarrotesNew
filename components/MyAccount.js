import { Button,Layout, Icon, Avatar, Divider } from '@ui-kitten/components';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios';
import { useEffect, useState, Image } from 'react';
import { useMyContext } from '../appContext/appContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import UpdateUser from '../modalScreen/UpdateUser';

function MyAccount({navigation}) {
  
  const [token, setToken] = useState()
  const [image, setImage] = useState(null);
  const [uid, setUid] = useState(null)
  const [nombreUser, setNombreUser] =  useState("")
  const [apellidoUser, setApellidoUser] =  useState("")
  const [direccionUser, setDireccionUser] = useState("")
  const [telefonoUser,setTelefonoUser] = useState()
  const [emailUser, setEmailUser] = useState("")

  const {tokenDelete, userRemove, logout} = useMyContext()

  const logoutBtn =  async () => {
    const status = await logout()
    if(status === 200) {
      navigation.push("Login")
    }
  }
  

  useEffect(()=>{
  },[])

  return (
    <View style={{ flex: 1, flexDirection: "row", backgroundColor: "white",paddingTop: 50}}>
      <Layout style={styles.perfil}>
        {image?(
          <Avatar
            style={[styles.avatar,styles.avatarPerfil]}
            size='tiny'
            source={{uri: image}} 
          />
        ):(
          <Avatar
            style={[styles.avatar,styles.avatarPerfil]}
            size='tiny'
            source={{uri: 'https://placehold.co/600x400.png'}} 
          />
        )
        }
        {/* <Text style={styles.textAvatar}  onPress={()=>pickImage()} >Cambiar foto de perfil</Text> */}
        <Text style={styles.infoContactTextTitle}>Información del Contacto</Text>
        <Layout style={{ }}>
          <Text style={styles.infoContactText}>Nombre:{"  "}<Text style={styles.contactInfo}>{token?nombreUser:null}</Text></Text>
          <Text style={styles.infoContactText}>Apellidos:{" "}<Text style={styles.contactInfo}>{token?apellidoUser:null}</Text></Text>
          <Text style={styles.infoContactText}>Teléfono:{" "}<Text style={styles.contactInfo}>{token?telefonoUser:null}</Text></Text>
          <Text style={styles.infoContactText}>Dirección: {" "}<Text style={styles.contactInfo}>{token?direccionUser:null}</Text></Text>
          <Text style={styles.infoContactText}>Email: {" "}<Text style={styles.contactInfo}>{token?emailUser:null}</Text></Text>
        </Layout>
       
          <>
            <Button style={[styles.button, styles.btn]} size='medium' onPress={()=>logoutBtn()}>
              Cerrar sesión
            </Button>
            <Layout>
              <Text style={styles.registro} onPress={()=>{openRegister()}}>No tienes una cuenta?</Text>
            </Layout>
          </>
          
         
        
      </Layout>
    </View>
  
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "red",
    borderColor:"transparent",
    marginHorizontal: 20,
    marginVertical: 10,
    marginTop: 40
    
  },
  avatarPerfil: {
    alignSelf: "center",
    width: 90,
    height: 90
  },
  textAvatar: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "400",
    color: "#94CBFF",
    marginVertical: 10
  },
  perfil: {
    flex: 1,
    height: 200,
  },

  infoContactTextTitle: {
    marginVertical: 20,
    fontWeight: 600,
    marginLeft:10,
    fontSize: 20,
    alignSelf: "center"
  },

  infoContactText: {
    marginLeft: 20,
    marginVertical: 5,
    marginTop: 10,
    fontWeight: "400",
    fontStyle: "italic",
    fontSize: 18,
  },

  contactInfo: {
    fontSize: 16,
    fontWeight: "800"
  },

  btnHidden : {
    display: "none"
  },

  registro: {
    textAlign: "center"
  }
})

export default MyAccount