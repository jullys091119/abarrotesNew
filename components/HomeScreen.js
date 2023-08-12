import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { Card, Layout } from '@ui-kitten/components';
import React, {  useEffect, useState } from 'react';
import axios from 'axios';
import Animated,
 {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withDelay,
  withRepeat,
  withTiming
} from "react-native-reanimated";

//Context API
import {useMyContext} from '../appContext/appContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HomeScreen({navigation}) {
  const [imagen,setImagen] = useState({})
  const [token,setToken] = useState('')
  let banner = Object.values(imagen)
  
  const getTokenLocalStorage = async () => {
    try {
     const currentToken = await AsyncStorage.getItem('@token')
     setToken(currentToken)
    } catch (e) {
      console.log(e)
    }
  }
 
  console.log(token)

 
  const Ring = ({ delay }) => {
    const ring = useSharedValue(0);

    const ringStyle = useAnimatedStyle(() => {
      return {
        opacity: 0.8 - ring.value,
        transform: [
          {
            scale: interpolate(ring.value, [0, 1], [1, 3]),
          },
        ],
      };
    });

    useEffect(()=>{
      ring.value = withDelay(
        delay,
        withRepeat(
          withTiming(1, {
            duration: 4000,
          }),
          -1,
          false
        )
      );
    },[])
    return <Animated.View style={[styles.ring, ringStyle]} />;
  };

  const getBanners =()=> {
    axios.get('https://abarrotes.msalazar.dev/jsonapi/node/banners_ofertas?include=field_img_banner', {
   
    })
    .then(function (response) {
      setImagen(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const login = () => {
    navigation.replace("Login")
  }
   
  useEffect(()=>{
    getBanners()
    getTokenLocalStorage()
   
  },[])

  return (
    <>
      <ScrollView>
       { 
        banner.map((item,index)=>{
          return(
            <Layout key={index}
             style={styles.card}
            >
              <Image
               source={{uri: `https://abarrotes.msalazar.dev` + imagen.included[index].attributes.uri.url}} 
               style={{
                height: 160,
                width:  "100%",
                resizeMode: 'cover',
              }}
              />
              <Text
                style={{
                  textAlign:"center",
                  fontWeight: "900",
                  marginVertical: 2,
                  color: "#42AAFF"
                }}
              >
                {imagen.data[index].attributes.field_t}
              </Text>
            </Layout>
          )
        })
       }
      </ScrollView>
        {
          token==null?
          (<Card style={{backgroundColor:"red", paddingHorizontal: 30, width: "100%", height: 60}} onPress={()=>{login()}} >
            <Text style={{ color: "white", fontWeight:"400"}}>Presione aqui para iniciar sesion</Text>
            <Ring delay={0} />
            <Ring delay={1000} />
            <Ring delay={2000} />
            <Ring delay={3000} />
          </Card>):null
        }   
    </>
  );
}
styles = StyleSheet.create({
  card: {
    width: '100%',
    marginVertical: 10
  },
  ring: {
    position: "absolute",
    width: 17,
    height: 17,
    borderRadius: 40,
    borderColor: "white",
    borderWidth: 3,
    right: 20,
    top: 17,
  },
  btnLogin: {
    backgroundColor: "red",
    position:"absolute",
    bottom:0,
    zIndex: 4,
    width:"100%",
    display:"flex",
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: 30,
  },
  showBtnLogin: {
    display: "flex"
  },
  hiddenBtnLogin: {
    display: "none"
  }
})


export default HomeScreen