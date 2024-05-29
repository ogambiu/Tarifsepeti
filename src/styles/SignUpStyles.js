import { StyleSheet } from 'react-native';

const SignUpStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 27,
    backgroundColor: "#EE4F35",
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
    borderRadius: 7,
    alignSelf: "stretch",
  },
  buttonContainer: {
    alignSelf: "stretch",
    marginTop: 5,
  },
  button: {
    backgroundColor: "#FCECDA",
    borderRadius: 20,
    padding: 12,
    marginTop: 6,
  },
  buttonText: {
    textAlign : "center",
    color: "black",
    fontSize: 14,
    fontWeight: "900",
  },
  outLineButton: {
    marginTop: 5,
    backgroundColor: "#fffaf0",
  },
  outLineButtonText: {
    justifyContent: "center",
    alignItems:"center",
    color: "white",
    textAlign: "center",
    flex:1,
  
  },
  title: {
    fontSize: 50,
    color: "white",
    paddingBottom: 80,
    fontWeight: "900",
  },
  SignUpSection: {
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  createSection: {
    flex:1,
    justifyContent: "center",
    alignSelf: "center",
    position: "absolute",
    bottom: 12,
    
  },
});

export default SignUpStyles;