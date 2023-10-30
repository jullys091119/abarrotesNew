
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation} from "@react-navigation/native";
import { useMyContext } from "../appContext/appContext";
import { View, Text } from "react-native-animatable";
import {Avatar} from "@ui-kitten/components";
import * as ImagePicker from 'expo-image-picker';
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from "react";
import * as FileSystem from 'expo-file-system';
import { decode, encode } from 'base-64';
import { beginEvent } from "react-native/Libraries/Performance/Systrace";
import { useEffect } from "react";
import axios from "axios";

// Configura el módulo base-64
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}


export const IconUser = () => {
  return <MaterialCommunityIcons name="account" color="gray" size={25} />;
};

export const IconPassword = () => {
  return <MaterialCommunityIcons name="key" color="gray" size={25} />;
};

export const IconBack = () => {
  const navigation = useNavigation()
  return <MaterialCommunityIcons name="arrow-left" color="gray" size={25} onPress={()=>navigation.navigate("Login")}/>;
};

export const IconBackShopingProduct = () => {
  const navigation = useNavigation()
  return <MaterialCommunityIcons name="arrow-left" color="gray" size={25} onPress={()=>navigation.navigate("MyDrawer")}/>;
};


export const IconEmail = () => {
  return <MaterialCommunityIcons name="email" color="gray" size={25} />;
};

export const IconPhone = () => {
  return <MaterialCommunityIcons name="phone" color="gray" size={25} />;
};

export const IconAddress = () => {
  return (
    <MaterialCommunityIcons
      name="map-marker-radius"
      color={"gray"}
      size={25}
    />
  );
};

export const IconStar = () => {
  return (
    <MaterialCommunityIcons
      name="star"
      color={"gold"}
      size={25}
    />
  );
};

export const IconCamera = () => {
  return (
    <MaterialCommunityIcons
      name="camera"
      color={"red"}
      size={40}
      style= {{
        position: "absolute",
        left: "40%",
        top: "40%"
      }}
    />
  );
};


export const EmailUser = () => {
  const {email} =  useMyContext()
  return (
    <Text style={{alignSelf: "center", marginVertical: 10, color: "gray"}}>{email}</Text>
  )
}

export const NameUser = () => {
  const {name, lastName, address, phone} =  useMyContext()
  return (
    <>
    <Text  style={{marginTop: 15, marginHorizontal: 22, color: "gray", fontSize: 23 }}><IconUser/>{" "}{name}{" "}{lastName}</Text>
    <Text style={{marginVertical: 10, marginHorizontal: 52, color: "gray"}} >{address}</Text>
    <Text style={{marginVertical: 10, marginHorizontal: 22, color: "gray"}}  onPress={()=>{pickImage()}} ><IconPhone/> {" "}{phone}</Text>
    </>
  )
}

export const IconPower =  () => {
  const {logout} = useMyContext()
  const navigation = useNavigation()
  const redirectLogin = async () => {
    const status =  await logout()
    if(status === 200) {
      logout()
      navigation.replace("Login")
    }
  }
   return(
    <View 
     style={{
      height: 370, 
      display: "flex", 
      flexDirection: "row", 
      gap: 5,
      alignItems: "center",
      marginHorizontal: 20
      }}
      >
      <Text
       onPress={()=>{redirectLogin()}}

       style={{
        fontFamily: "Poppins",
        fontSize: 20,
        color: "red"
        }}>Cerrar sesion</Text>
      <MaterialCommunityIcons
        name="exit-to-app"
        color="red"
        size={30}
        style={styles.iconMenu}
      />
    </View>
   )
}


// const takePicture = async () => {
//   const result = await ImagePicker.launchCameraAsync({
//     allowsEditing: true,
//     aspect: [4, 3],
//   });
  
//   if (!result.canceled) {
//     // La imagen tomada se encuentra en result.uri
//   }
// };



export const ImagePerfil = () => {
  
  const [imagen, setImagen] = useState("")
  const [imagenStorage, setImagenStorage] = useState("")
  const [url, setUrl] = useState("")
  const {name,uid} =  useMyContext()

  const getUser = async () => {
    var axios = require("axios").default;
    const id = await AsyncStorage.getItem("@UID")
    var options  = {
      method: 'GET',
      url:'http://abarrotes.msalazar.dev/user/' + id,
      params: { _format: 'json' },
      headers: { 'Content-Type': 'application/json' }
    };
    axios.request(options).then(async function (response) {
      if(id == response.data.uid[0].value ) {
        loadProfileImageFromStorage()
      }
    }).catch(function (error) {
      console.error(error, "error obtenie");
    });
   
  }
  
  const imageUpload = async (base64Data, nameUser) => {
    const tk = await AsyncStorage.getItem("@TOKEN");
    const url = 'https://abarrotes.msalazar.dev/file/upload/node/perfil_usuario_picture/field_imagen_perfil?_format=json';
    
    // Convierte la imagen base64 en un ArrayBuffer
    const binaryData = new Uint8Array(atob(base64Data).split('').map(char => char.charCodeAt(0)));
  
    // Crea un objeto FormData para enviar la imagen como un archivo binario
    const formData = new FormData();
    formData.append('file', {
      uri: 'data:application/octet-stream;base64,' + base64Data,
      type: 'application/octet-stream',
      name:`raton.jpg`
    });
    
    // Agrega el encabezado "Content-Disposition" con el nombre de archivo
    formData.append('Content-Disposition', 'attachment; filename="33.jpg"');
    // Agrega los encabezados necesarios
    const headers = {
      'Content-Type': 'application/octet-stream', // Cambiado a application/octet-stream
      'X-XSRF-Token': tk,
      'Authorization': 'Basic Og==',
      'Content-Disposition':`file; filename="${name}.jpg"`
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: binaryData, // Cambiado a binaryData
      });
  
      const responseData = await response.json();
      setPerfilProfileImages(responseData.uri[0].url)
      loadProfileImageFromStorage()
    } catch (error) {
      console.error(error);
    }
  };

  const setPerfilProfileImages=async(url)=> {
    try {
      const key = `@PROFILE_${uid}`;
      await AsyncStorage.setItem(key, url)
    }catch (error) {
      console.log(error)
    }
  }

  const loadProfileImageFromStorage = async () => {
    try {
      // Cargar la foto de perfil desde AsyncStorage usando la clave única (UID)
      const key = `@PROFILE_${uid}`;
      const picture = await AsyncStorage.getItem(key);
      setImagen(picture);
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(()=> {
   getUser()
  },[imagen])


  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      base64: true, 
    });
    if (!result.canceled) {      
      // Luego, puedes enviar la imageBase64 al servidor en lugar de result.assets[0].uri
      const base64ImageData = result.assets[0].base64
      imageUpload(base64ImageData,  name);
    }
  };
  
  return (
    <TouchableWithoutFeedback onPress={pickImage} style={{paddingVertical: 10}}>
      <Avatar
      source={{ uri: `https://abarrotes.msalazar.dev` + imagen }}
      style={{
        alignSelf: "center",
        marginVertical:10,
        width: 160,
        height: 160,
        borderWidth:10,
      }}
    />
    {
      !imagen && (
        <IconCamera/>
      )
    }
    </TouchableWithoutFeedback>
  );
};
