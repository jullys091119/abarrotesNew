
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
    <Text  style={{marginVertical: 10, marginHorizontal: 22, color: "gray" }}>{name}{" "}{lastName}</Text>
    <Text style={{marginVertical: 10, marginHorizontal: 22, color: "gray"}} >{address}</Text>
    <Text style={{marginVertical: 10, marginHorizontal: 22, color: "gray"}}  onPress={()=>{pickImage()}} >{phone}</Text>
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
      height: 90, 
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

const takePicture = async () => {
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
  });
  
  if (!result.canceled) {
    // La imagen tomada se encuentra en result.uri
  }
};


const imageUpload = async (data) => {
  try {
    const tk = await AsyncStorage.getItem("@TOKEN");
    const fetch = require('node-fetch');
    const url = 'https://abarrotes.msalazar.dev/file/upload/user/user/user_picture?_format=json';
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Disposition': 'form-data; name="file"; filename="eta.jpg"',
        'Content-Type': 'application/octet-stream',
        'X-CSRF-Token': tk,
        Authorization: 'Basic YXl0YW5hOnJvb3Q=',
      },
      body: data,
    };

    const response = await fetch(url, options);
    const json = await response.json();

    console.log(json);
  } catch (error) {
    console.error('Error:', error);
  }
};


export const ImagePerfil = () => {
  const [imagen, setImagen] = useState("")


  const pickImage = async () => {

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      // Convierte la imagen a base64
      const imageBase64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Luego, puedes enviar la imageBase64 al servidor en lugar de result.assets[0].uri
      imageUpload(imageBase64);
      setImagen(result.assets[0].uri);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={pickImage}>
      {imagen?(
      <Avatar
        source={{ uri: imagen!==""?imagen:null }}
        style={{
          alignSelf: "center",
          marginVertical: 40,
          width: 190,
          height: 190,
        }}
      />): 
      <Avatar
      source={{ uri: "./assets/avatar.jpg" }}
        style={{
          alignSelf: "center",
          marginVertical: 40,
          width: 190,
          height: 190,
        }}
    />
    }
    </TouchableWithoutFeedback>
  );
};
