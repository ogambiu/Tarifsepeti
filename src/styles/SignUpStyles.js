import { StyleSheet } from 'react-native';

const SignUpStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    width: '80%',
    marginLeft: 50,
    marginRight: 50
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 5,
    borderRadius: 20
  },
  buttonContainer: {
    width: '60%',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#00ced1',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 12,
    marginTop: 7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '900',
    color: 'white'
  },
  innerFrame: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, .5)',
  },
  title: {
    fontSize: 50,
    color: 'white',
    paddingBottom: 80,
    fontWeight: '900'
  }
});

export default SignUpStyles;