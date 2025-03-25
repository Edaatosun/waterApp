import { useNavigation, useRoute } from "@react-navigation/native";
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6"
import { LogBox } from 'react-native';
import { auth } from "../../firebase";
import { fetchData} from "../storage/database";
import { useEffect, useState } from "react";

// Bardak Seçme Sayfası
export function CupSelection() {
    LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);

    const navigation = useNavigation();
    const route = useRoute();
    const { setSelectedCup } = route.params|| {};
  
    const [cupOptions, setCupOptions] = useState([
      { id: 1, name: "Water", ml: 100, url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F1.png?alt=media&token=32be6cac-19d8-41ca-b968-ec478ebf49d3" },
      { id: 2, name: "Water", ml: 125, url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F7.png?alt=media&token=870c8f99-1357-4bc9-9c31-fe0dc11b535f" },
      { id: 3, name: "Water", ml: 150, url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F9.png?alt=media&token=391cb867-7510-42f5-bba2-7e926a636a9b" },
      { id: 4, name: "Water", ml: 200, url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F6.png?alt=media&token=b55c7334-8099-457c-b80b-aa32f349fa9f" },
      { id: 5, name: "Water", ml: 250, url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F3.png?alt=media&token=479d07e7-f10d-4dde-825a-4f854af595a4" },
      { id: 6, name: "Water", ml: 300, url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F8.png?alt=media&token=4072279a-f33e-4a0a-8f75-fd3526cd5034" },
      { id: 7, name: "Water", ml: 400, url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F5.png?alt=media&token=f1bbc105-2c50-41c9-be43-a75e0b634deb" },
      { id: 8, name: "Water", ml: 500, url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F10.png?alt=media&token=161701cf-a7b5-498b-9571-09d62fb144a5" },
    ]);
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const userId = auth.currentUser.uid;
          const userCups = await fetchData("cups", userId);
          console.log(userCups);
          if (!(userCups.empty)) {
            setCupOptions((prevCups) => [...prevCups, ...userCups]);
            console.log("diziiiiiiii",cupOptions);
          }
        } catch (error) {
          console.log("cupSelectionPage hatası:", error);
        }
      };
  
      fetchUserData();
    },[]);

    useEffect(() => {
      console.log("Updated cupOptions:", cupOptions);  // log the updated state
    }, [cupOptions]); // this will run whenever cupOptions change
    return (
      <SafeAreaView className="flex-1 bg-white p-5 items-center">
        <Text className="text-lg font-bold mb-5 mt-10">Water</Text>
        <FlatList
          data={cupOptions}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          renderItem={({ item }) => (
            <TouchableOpacity
                onPress={() => { setSelectedCup(item.ml); navigation.goBack(); }}
                className="w-[100] h-[120] p-3 border rounded-lg m-2 bg-[#E5F3F0] items-center justify-center">
                <Image
                    source={{ uri: item.url }}
                    
                    style={{ width: 40, height: 50, marginBottom: 5 ,color:"bg-[#E5F3F0]"}} 
                    resizeMode="contain"/>
                <Text className="text-lg">{item.ml} mL</Text> 
            </TouchableOpacity>
            
        )}
        ListFooterComponent={
            <TouchableOpacity   
            onPress={()=>{navigation.navigate("AddCupPage")}}
            className="w-[100] h-[120] p-3 border rounded-lg m-2 bg-[#E5F3F0] items-center justify-center">
                <Icon name="plus" size={40} color={"#042AB1"}/>
                <Text className="text-xl font-bold">Ekle</Text> 
            </TouchableOpacity>
        }
        />
      </SafeAreaView>
    );
  }