import { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { auth } from "../../firebase";  // Firebase importu
import { getLastAdd, queryGoalId } from "../storage/database";
import Icon from "react-native-vector-icons/Ionicons";

export default function AllHistoryPage() {
    const [historyObject, setHistoryObject] = useState([]);
    const navigation = useNavigation(); // `navigation`'ı alıyoruz
    const userId = auth.currentUser?.uid; // `uid`'yi kontrol ediyoruz

    useEffect(() => {
        const historyList = async () => {
            try {
                // Eğer userId yoksa, işlem yapmadan çık
                if (!userId) {
                    console.error("Kullanıcı girişi yapılmamış.");
                    return;
                }

                const lastGoal = await getLastAdd("Amount", userId);
                console.log("Geçmiş verisi:", lastGoal);

                if (lastGoal?.goal_id) {
                    const success = await queryGoalId("drinkWater", lastGoal.goal_id);
                    if (success) {
                        setHistoryObject(success);
                        console.log("Geçmiş veriler başarılı şekilde alındı:", success);
                    } else {
                        console.log("Veri bulunamadı.");
                    }
                }
            } catch (error) {
                console.error("Geçmiş verilerini alırken hata oluştu:", error);
            }
        };

        historyList();
    }, [userId]); // userId'ye bağlı olarak tekrar çalışması sağlanır

    return (
        <SafeAreaView >
            <View className="justify-center items-center mt-10">
                <View className="w-[95%] bg-white h-full rounded-xl p-5 shadow-md pb-5">
                    {/* Başlık kısmı */}
                    <View className="flex-row w-full items-center justify-start">
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Icon name="chevron-back-circle-outline" size={45} />
                        </TouchableOpacity>
                        <Text className="text-xl font-bold ml-4">Geçmiş</Text>
                    </View>
                    <View className="border w-full mt-2 border-gray-400 opacity-30" />

                    {/* Geçmiş verileri */}
                    {historyObject.length > 0 ? (
                        <ScrollView showsVerticalScrollIndicator={false} 
                         style={{ maxHeight: 700 }}>
                            {historyObject
                                .sort((a, b) => {
                                    const [hourA, minA] = a.drinkClock.split(':').map(Number);
                                    const [hourB, minB] = b.drinkClock.split(':').map(Number);

                                    // Önce saatleri karşılaştır, eşitse dakikaları karşılaştır
                                    return hourB - hourA || minB - minA;
                                })
                                .map((item, index) => (
                                    <View key={index}>
                                        <View className="flex-row items-center w-full min-h-[70] justify-between">
                                            <View className="flex-row items-center justify-center">
                                                <View className="w-[70] items-center justify-center">
                                                    <Image
                                                        style={{ width: 40, height: 40 }}
                                                        source={{ uri: item.Cup.url }}
                                                    />
                                                </View>
                                                <View>
                                                    <Text className="text-lg font-bold">Water</Text>
                                                    <Text className="align-bottom">{item.drinkClock}</Text>
                                                </View>
                                            </View>
                                            <Text className="text-lg font-bold p-5">{item.Cup.ml} mL</Text>
                                        </View>
                                        <View className="border w-full mt-2 border-gray-400 opacity-30" />
                                    </View>
                                ))}
                        </ScrollView>
                    ) : (
                        <View className="justify-center items-center">
                            <Image className="w-[100] h-[210]" source={require("../../assets/images/noDoc.png")} />
                            <Text className="text-gray-400 text-lg font-bold">Geçmişiniz bulunmamaktadır.</Text>
                        </View>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}
