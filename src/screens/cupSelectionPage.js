import { useNavigation } from "@react-navigation/native";
import { FlatList, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome6"
import { LogBox } from 'react-native';
import { auth } from "../../firebase";
import { fetchData } from "../storage/database";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Cup } from "../model/cup";
import IconBack from "react-native-vector-icons/Ionicons";
import RightIcon from "react-native-vector-icons/AntDesign";

// Bardak Seçme Sayfası
export function CupSelection() {
  LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);
  const [ml, setMl] = useState();
  const navigation = useNavigation();
  const [userCups, setUserCups] = useState([]);


  const setSelectedMl = async (item) => {
    if (item) {
      const userId = auth.currentUser ? auth.currentUser.uid : null;
      if (!userId) {
        console.log("Kullanıcı oturum açmamış.");
        return;
      }

      try {
        const selectedCup = new Cup(userId, item.url, item.ml, item.name);

        // Veriyi AsyncStorage'a kaydediyoruz
        await AsyncStorage.setItem("localSelectedCup", JSON.stringify(selectedCup));
        console.log("Seçilen bardak başarıyla kaydedildi:", selectedCup);

        // Navigasyona geçiş
        navigation.navigate("Drawer");
      } catch (error) {
        console.error("AsyncStorage kaydetme hatası:", error.message);
        console.error("Hata Detayı:", error.stack); // Hata detaylarını görmek için stack trace
      }
    } else {
      console.log("Geçersiz item:", item);
    }
  };


  const [cupOptions, setCupOptions] = useState([
    { id: 1, name: "Su(Varsayılan)", ml: 100, url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F1.png?alt=media&token=32be6cac-19d8-41ca-b968-ec478ebf49d3" },
    { id: 2, name: "Su(Varsayılan)", ml: 125, url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F7.png?alt=media&token=870c8f99-1357-4bc9-9c31-fe0dc11b535f" },
    { id: 3, name: "Su(Varsayılan)", ml: 150, url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F9.png?alt=media&token=391cb867-7510-42f5-bba2-7e926a636a9b" },
    { id: 4, name: "Su(Varsayılan)", ml: 200, url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F6.png?alt=media&token=b55c7334-8099-457c-b80b-aa32f349fa9f" },
    { id: 5, name: "Su(Varsayılan)", ml: 250, url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F3.png?alt=media&token=479d07e7-f10d-4dde-825a-4f854af595a4" },
    { id: 6, name: "Su(Varsayılan)", ml: 300, url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F8.png?alt=media&token=4072279a-f33e-4a0a-8f75-fd3526cd5034" },
    { id: 7, name: "Su(Varsayılan)", ml: 400, url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F5.png?alt=media&token=f1bbc105-2c50-41c9-be43-a75e0b634deb" },
    { id: 8, name: "Su(Varsayılan)", ml: 500, url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F10.png?alt=media&token=161701cf-a7b5-498b-9571-09d62fb144a5" },
    { id: 9, name: "Ekle" },
  ]);
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const userId = auth.currentUser.uid;
          const userCups = await fetchData("cups", userId);
          if (!(userCups.empty)) {
            setUserCups(userCups);
          }
        } catch (error) {
          console.log("cupSelectionPage hatası:", error);
        }
      };
  
      fetchUserData();
    }, []);

  useEffect(() => {
    console.log("Updated cupOptions:", cupOptions);  // log the updated state
  }, [cupOptions]); // this will run whenever cupOptions change
  return (
    <SafeAreaView className="flex-1 bg-white p-5 items-center">
      {/* Üst Menü */}
      <View className="w-full flex-row items-center justify-between  py-3 mt-5">
        <TouchableOpacity onPress={() => navigation.navigate("Drawer")}>
          <IconBack name="chevron-back-circle-outline" size={45} />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Bir Bardak Seç</Text>
        <View style={{ width: 30 }} />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={cupOptions}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        className="max-h-[400]"
        renderItem={({ item }) => (
          item.name === "Ekle" ? ( // Eğer bu "Ekle" butonuysa, özel bir render yapıyoruz
            <TouchableOpacity
              onPress={() => { navigation.navigate("AddCupPage") }}
              className="w-[100] h-[120] p-3 border rounded-lg m-2 bg-[#E5F3F0] items-center justify-center">
              <Icon name="plus" size={40} color={"#042AB1"} />
              <Text className="text-xl font-bold">Ekle</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => { setMl(item.ml); setSelectedMl(item); navigation.goBack(); }}
              className="w-[100] h-[120] p-3 border rounded-lg m-2 bg-[#E5F3F0] items-center justify-center">
              <Image
                source={{ uri: item.url }}
                style={{ width: 40, height: 50, marginBottom: 5 }}
                resizeMode="contain" />
              <Text className="text-lg">{item.ml} mL</Text>
            </TouchableOpacity>
          )
        )}
      />

      {/* bardaklarımm*/}
      <View className="w-full mt-4">
        <View className="flex-row w-full justify-between">
          <Text className="text-xl font-bold">Bardaklarım</Text>
          <TouchableOpacity onPress={()=>{navigation.navigate("AllMyCupPage")}} className="flex-row">
            <Text className="text-lg font-bold mr-2 text-blue-400">Tümünü Gör</Text>
            <RightIcon name="arrowright" size={30} color={"#60A5FA"} />
          </TouchableOpacity>
        </View>
        <View className="border w-full mt-2 border-gray-400 opacity-30" />

        <ScrollView  showsVerticalScrollIndicator={false} 
        style={{ maxHeight: 220 }}>
          {userCups.sort((a,b)=>{
            const A = a.ml;
            const B = b.ml;
            return B-A;
          })
          .map((item, index) => ( // map item ml gibi değerleri tutar
            <View key={index}>
              <TouchableOpacity onPress={()=>{setMl(item.ml); setSelectedMl(item); navigation.goBack();}}
              className="flex-row items-center w-full min-h-[70] justify-between">
                <View className="flex-row items-center justify-center">
                  <View className="w-[70] items-center justify-center">
                    <Image
                      style={{ width: 40, height: 40 }}
                      source={{ uri: item.url }}/>
                  </View>
                  <View>
                    <Text className="text-lg font-bold">{item.name}</Text>
                  </View>
                </View>
                <Text className="text-lg font-bold p-5">{item.ml} mL</Text>
              </TouchableOpacity>
              <View className="border w-full mt-2 border-gray-400 opacity-30" />
            </View>
          ))}
        </ScrollView>
      </View>



    </SafeAreaView>
  );
}