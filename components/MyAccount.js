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

  const {tokenDelete, userRemove} = useMyContext()

  //Opteniendo el uid  para tomar los datos del usuario
  const getUidStorage = async () => {
    try {
      const uidUser = await AsyncStorage.getItem("@UID")
      getDataUser(uidUser)
    } catch (error) {
      console.log(error)
    }
  }

  //Funcion que toma los datos del usuario
  const getDataUser = async (uid)=> {
    await axios.get(`https://abarrotes.msalazar.dev/user/` + uid + `?_format=json`, {
      headers: {
        "Content-Type" : "application/json",
      },
    }).then(async(response) =>{
      setUidStorage(response.data.uid[0].value)
      setNombreUser(response.data.field_nombre_usuario[0].value)
      setApellidoUser(response.data.field_apellidos_usuario[0].value)
      setDireccionUser(response.data.field_direccion_usuario[0].value)
      setTelefonoUser(response.data.field_telefono_usuario[0].value)
      setEmailUser(response.data.field_email_usuario[0].value)
      await AsyncStorage.setItem("@name", response.data.field_nombre_usuario[0].value) 
      await AsyncStorage.setItem("@lastname", response.data.field_apellidos_usuario[0].value)
      await AsyncStorage.setItem("@address", response.data.field_direccion_usuario[0].value)
      await AsyncStorage.setItem("@email", response.data.field_email_usuario[0].value)
      await AsyncStorage.setItem("@phone", response.data.field_telefono_usuario[0].value)
    })

  }
  
  //Funcion para meter el uid en localstorage
  const setUidStorage = async (uid) => {
    try {
      await AsyncStorage.setItem("@UID", JSON.stringify(uid)) 
    } catch (error) {
      console.log(error)
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
     setPhotoLocalStorage(result.assets[0].uri)
     setImage(result.assets[0].uri)
    }
  }

  const setPhotoLocalStorage = async (photo) => {
    try {
      await AsyncStorage.setItem('@photo', photo)
    } catch (e) {
      console.log(e)
    }
  }

  const getPhoto = async () => {
    const photo = await AsyncStorage.getItem("@photo")
    setImage(photo)
  }
    

  //Removiendo Usuario
  const photoRemove= async()=> {
    try {
      await AsyncStorage.removeItem("@photo")
      console.log("foto eliminado")
    } catch(error) {
      console.log(error, "error en el catech")
    }
  }
    
  const getTokenLocalStorage = async () => {
    try {
     const currentToken = await AsyncStorage.getItem('@token')
     setToken(currentToken)
    } catch (e) {
      console.log(e)
    }
  }
   
  //Deslogueandote
  const logout = () => {
    axios.get('https://abarrotes.msalazar.dev/user/logout', {
      headers: {
        "Content-Type": "application/json",
      }
    }).then(function(response){
      tokenDelete()
      userRemove()
      photoRemove()
      navigation.replace("Login")

    }).catch(function(error){
      console.log(error)
    })
  }

  const openRegister = () => {
    navigation.replace("Register")
  }

  useEffect(()=>{
    getTokenLocalStorage()
    getPhoto()
    getUidStorage()
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
        <Text style={styles.textAvatar}  onPress={()=>pickImage()} >Cambiar foto de perfil</Text>
        <Text style={styles.infoContactTextTitle}>Información del Contacto</Text>
        <Layout style={{ }}>
          <Text style={styles.infoContactText}>Nombre:{"  "}<Text style={styles.contactInfo}>{token?nombreUser:null}</Text></Text>
          <Text style={styles.infoContactText}>Apellidos:{" "}<Text style={styles.contactInfo}>{token?apellidoUser:null}</Text></Text>
          <Text style={styles.infoContactText}>Teléfono:{" "}<Text style={styles.contactInfo}>{token?telefonoUser:null}</Text></Text>
          <Text style={styles.infoContactText}>Dirección: {" "}<Text style={styles.contactInfo}>{token?direccionUser:null}</Text></Text>
          <Text style={styles.infoContactText}>Email: {" "}<Text style={styles.contactInfo}>{token?emailUser:null}</Text></Text>
        </Layout>
       
          <>
            <Button style={[styles.button, styles.btn]} size='medium' onPress={()=>logout()}>
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