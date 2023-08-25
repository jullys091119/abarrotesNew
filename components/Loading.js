 import  React,{ useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { useMyContext } from '../appContext/appContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Loading = ({navigation}) => {
    const {token, gettingToken, getToken} = useMyContext()
    const [isLoading, setIsLoading] = useState(true);
  
    //console.log(getToken)

    const renderValidation = async ()=> {
      tkStorage = await AsyncStorage.getItem("@TOKEN")
      console.log(tkStorage, "token loading")
      if(!tkStorage) {
        navigation.push("Login")
      } else {
     
        navigation.push("MyTabs")
      }
    }

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }, []);

    useEffect(()=> {  
      renderValidation()
    }, [])
    
    return (
        <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <Progress.CircleSnail color={['red', 'green', 'blue']} />
          </View>
        ) : (
          <Text style={styles.loadedText}>¡Bienvenido!</Text>
        )}
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    },
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 10,
      fontSize: 18,
    },
    loadedText: {
      fontSize: 24,
    },
  });
