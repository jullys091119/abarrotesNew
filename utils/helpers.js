import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation} from "@react-navigation/native";
import { useMyContext } from "../appContext/appContext";
import { View, Text } from "react-native-animatable";

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

export const DataUser = () => {
  const {email} =  useMyContext()
  
  return (
    <Text style={{alignSelf: "center", marginVertical: 10, color: "gray"}}>{email}</Text>
  )
 
}

export const IconPower =  () => {
  const {logout} = useMyContext()
  const navigation = useNavigation()
   return(
    <View style={{height: 90, display: "flex", flexDirection: "row", gap: 40, alignItems: "center", marginHorizontal: 20}}>
      <Text style={{fontFamily: "Poppins", fontSize: 20}}>Cerrar sesion</Text>
      <MaterialCommunityIcons
        name="exit-to-app"
        color="red"
        size={35}
        style={styles.iconMenu}
        onPress={()=>{navigation.navigate("Login"), logout()}}
      />
    </View>
   )
}