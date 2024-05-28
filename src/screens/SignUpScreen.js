import { Text, View , KeyboardAvoidingView, TextInput, TouchableOpacity, ImageBackground, Alert} from 'react-native'
import React, {useState} from 'react'
import SignUpStyles from '../styles/SignUpStyles'
import { auth } from '../../firebase';
import { useNavigation } from '@react-navigation/native';


export default function SignUpScreen() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSignUp = () =>{
    auth.createUserWithEmailAndPassword(email,password).then((userCredentials)  => {
        const user = userCredentials.user;
        console.log('User', user.email);
        Alert.alert(
            'Registration Successful',
            'You have successfully registered.',
            [{ text: 'Okay', onPress: () => console.log('OK Pressed') }]
          );
        navigation.navigate('Login')
      })
      .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView style={SignUpStyles.container} behavior='padding'>
      <ImageBackground source={require('../assets/LoginScreenImage.jpg')} resizeMode="cover" style={{flex:1}}> 
        <View style={SignUpStyles.innerFrame}>
          <Text style={SignUpStyles.title}>Tarifsepeti</Text>

          <View style={SignUpStyles.inputContainer}>
            <TextInput 
            style={SignUpStyles.input} 
            placeholder='Email' 
            value={email} 
            onChangeText={(text) => setEmail(text)}/>

            <TextInput 
            style={SignUpStyles.input} 
            placeholder='Password' 
            secureTextEntry={true} 
            value={password} 
            onChangeText={(text) => setPassword(text)}/>
          </View>

          <View style={SignUpStyles.buttonContainer}>
            <TouchableOpacity onPress={handleSignUp} style={SignUpStyles.button}>
              <Text style={SignUpStyles.buttonText}>Create an Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}