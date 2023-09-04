import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation} from "@react-navigation/native";

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
