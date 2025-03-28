import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { fetchData } from "../storage/database";
import { auth } from "../../firebase";
import { useNavigation } from "@react-navigation/native";

export default function AllMyCupPage() {
  const [userCups, setUserCups] = useState([]);
  const navigation = useNavigation();

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

  return (
    <View className="w-full mt-10 p-2">
      {/* Başlık kısmı */}
      <View className="flex-row w-full items-center justify-start">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back-circle-outline" size={45} />
        </TouchableOpacity>
        <Text className="text-xl font-bold ml-4 ">Bardaklarım</Text>
      </View>
      <View className="border w-full mt-2 border-gray-400 opacity-30" />

      <ScrollView  showsVerticalScrollIndicator={false} 
      style={{ maxHeight: 700 }}>
        {userCups.sort((a,b) =>{
          const A = a.ml;
          const B = b.ml;
          return B-A;
        })
        .map((item, index) => ( // map item ml gibi değerleri tutar
          <View key={index}>
            <View className="flex-row items-center w-full min-h-[70] justify-between">
              <View className="flex-row items-center justify-center">
                <View className="w-[70] items-center justify-center">
                  <Image
                    style={{ width: 40, height: 40 }}
                    source={{ uri: item.url }} />
                </View>
                <View>
                  <Text className="text-lg font-bold">{item.name}</Text>
                </View>
              </View>
              <Text className="text-lg font-bold p-5">{item.ml} mL</Text>
            </View>
            <View className="border w-full mt-2 border-gray-400 opacity-30" />
          </View>
        ))}
      </ScrollView>
    </View>

  );
};