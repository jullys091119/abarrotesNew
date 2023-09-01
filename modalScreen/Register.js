
import React,{useState} from 'react'
import { Text,View,TextInput, SafeAreaView, StyleSheet, TouchableOpacity, TouchableWithoutFeedback} from 'react-native'
import { Input, Layout, Button, Icon } from '@ui-kitten/components';
import { ScrollView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dialog, Portal } from 'react-native-paper';
import axios from 'axios';
import { useMyContext } from '../appContext/appContext';
import { IconUser } from '../utils/helpers';
import { IconPassword } from '../utils/helpers';
import { IconBack } from '../utils/helpers';
import { IconEmail } from '../utils/helpers';
import { IconPhone } from '../utils/helpers';
import { IconAddress } from '../utils/helpers';

export const Register = ({navigation}) => {
  const [visible, setVisible] = useState(false);
  const [msgError, setMsgError] = useState({})
  const {userRegister, passwordRegister, setUserRegister, setPasswordRegister, error} = useMyContext()


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
      passwordUserWrong: error
    }
    if([userRegister,passwordRegister].includes("")) {
      setMsgError(msgErrors.errorEmptyFields)
      showDialog()
    } else  {
      navigation.push("UserInfo")
    }
  }
  


  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          <IconBack/>
        </View>
        <View style={styles.createAccount}>
          <Text style={styles.textNewAccount}>Crear Cuenta</Text>
          <Text style={styles.textNewAccount, [styles.textStyles]} >Crear Cuenta Nueva</Text>
        </View>
        <View style={styles.formContainer}>
          <Input
            style={styles.input}
            label="Nombre Usuario"
            value={userRegister}
            onChangeText={setUserRegister}
            accessoryRight={(props) => <IconUser {...props} />}
          />
          <Input
            label="Contrasena"
            value={passwordRegister} 
            style={styles.input}
            onChangeText={setPasswordRegister}
            textContentType='password'
            accessoryRight={(props) => <IconPassword {...props} />  }
          />
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={validate}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>
        <DialogValidationRegister msgError={msgError}/>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    display: "flex",
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingVertical: 45
  },
  createAccount: {
    marginVertical: 60,
  },
  textNewAccount: {
    textAlign:"center",
    fontSize: 40,
    fontFamily: "BelaRegular"
  },
  textStyles: {
    fontSize: 16,
    textAlign: "center",
    fontFamily: "BelaRegular"
  },
  formContainer: {
    width: '80%',
    alignSelf: "center",
  },
  input: {
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0, borderBottomWidth: 1,
    backgroundColor: "none",
    borderColor: "gray",
    marginVertical: 15,
    borderRadius: 0
  },
  loginButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 50
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  login: {
    textAlign: "center",
    fontFamily: "Bela"
  },
  title: {
    textAlign: "center"
  }

})