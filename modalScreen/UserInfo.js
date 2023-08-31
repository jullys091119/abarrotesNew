import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Input, Layout, Button, Icon } from "@ui-kitten/components";
import { ScrollView } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Dialog, Portal } from "react-native-paper";
import { useMyContext } from "../appContext/appContext";
import { IconUser } from "../utils/helpers";
import { IconPassword } from "../utils/helpers";
import { IconBack } from "../utils/helpers";
import { IconEmail } from "../utils/helpers";
import { IconPhone } from "../utils/helpers";
import { IconAddress } from "../utils/helpers";


const UserInfo = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const [msgError, setMsgError] = useState({})
  const {
    handleSave,
    userRegister,
    passwordRegister,
    emailRegister,
    nameRegister,
    lastNameRegister,
    addressRegister,
    phoneRegister,
    setNameRegister,
    setEmailRegister,
    setAddressRegister,
    setPhoneRegister,
    setLastNameRegister,
  } = useMyContext();

  const renderUserInfo = () => {
    const msgErrors = {
      errorEmptyFields: "Complete todos los campos",
      passwordUserWrong: "Usuario o llave incorrectos"
    }
    if ([emailRegister,nameRegister,lastNameRegister,addressRegister,phoneRegister].includes("")) {
      showDialog()
      setMsgError(msgErrors.errorEmptyFields)
    } else {
      handleSave();
      navigation.push("Login");
    }
  };

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

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.createAccount}>
          <Text style={styles.textNewAccount}>Ya casi terminamos</Text>
          <Text style={(styles.textNewAccount, [styles.textStyles])}>
            !Completa tu informacion!
          </Text>
        </View>
        <View style={styles.formContainer}>
          <Input
            style={styles.input}
            label="Correo electronico"
            value={emailRegister}
            onChangeText={setEmailRegister}
            accessoryLeft={(props) => <IconEmail {...props} />}
          />
          <Input
            label="Nombre"
            value={nameRegister}
            style={styles.input}
            onChangeText={setNameRegister}
            accessoryLeft={(props) => <IconUser {...props} />}
          />

          <Input
            label="Apellidos"
            value={lastNameRegister}
            style={styles.input}
            onChangeText={setLastNameRegister}
            accessoryLeft={(props) => <IconUser {...props} />}
          />

          <Input
            label="Direccion"
            value={addressRegister}
            style={styles.input}
            onChangeText={setAddressRegister}
            accessoryLeft={(props) => <IconAddress {...props} />}
          />

          <Input
            label="Telefono"
            value={phoneRegister}
            style={styles.input}
            onChangeText={setPhoneRegister}
            accessoryLeft={(props) => <IconPhone {...props} />}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={renderUserInfo}>
          <Text style={styles.buttonText}>Crear Cuenta</Text>
        </TouchableOpacity>
        <TouchableWithoutFeedback>
          <Text style={styles.login}>
            Ya tienes una cuenta?{" "}
            <Text
              style={{ color: "#3498db" }}
              onPress={() => navigation.push("Login")}
            >
              Iniciar Sesion
            </Text>
          </Text>
        </TouchableWithoutFeedback>
        <DialogValidationRegister msgError={msgError}/>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingVertical: 45,
  },
  createAccount: {
    marginVertical: 60,
  },
  textNewAccount: {
    textAlign: "center",
    fontSize: 40,
    fontFamily: "BelaRegular",
  },
  textStyles: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "BelaRegular",
  },
  formContainer: {
    width: "80%",
    alignSelf: "center",
  },
  input: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 1,
    backgroundColor: "none",
    borderColor: "gray",
    marginVertical: 15,
    borderRadius: 0,
  },
  loginButton: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 50,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  login: {
    textAlign: "center",
    fontFamily: "Bela",
  },
  title: {
    textAlign: "center",
  },
});

export default UserInfo;
