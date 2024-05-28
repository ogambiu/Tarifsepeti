const [rec,setRec] = useState();

const getData = async () => {
  const recipesCollection = await firebase.firestore().collection('recipes').get();
  setRec(recipesCollection.docs[0].data());
};


useEffect(()=>{
  getData();
},[]);
