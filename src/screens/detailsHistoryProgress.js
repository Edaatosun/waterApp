import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, Text, ScrollView, Image, View, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";

export default function DetailsHistoryProgress({ route }) {
    const { historyData } = route.params;
    const navigation = useNavigation();

    return (
        <SafeAreaView className="bg-gray-100 flex-1">

            {/* Başlık kısmı */}
            <View className='bg-white py-5 rounded-xl'>
                <View className=" flex-row w-full items-center justify-start mt-6 ">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="chevron-back-circle-outline" size={45} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold ml-4">Geçmiş</Text>
                </View>

            </View>



            <View className="mt-5 mb-4 mx-3 rounded-xl px-2 justify-center bg-white h-[685]">
                
                {historyData.length > 0 ? (
                    
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text className="text-lg mt-5 mb-5 font-semibold text-center">Su Tüketim Geçmişi</Text>
                        {historyData
                            .sort((a, b) => {
                                const [hourA, minA] = a.drinkClock.split(':').map(Number);
                                const [hourB, minB] = b.drinkClock.split(':').map(Number);

                                // Önce saatleri karşılaştır, eşitse dakikaları karşılaştır
                                return hourA- hourB || minA - minB ;
                            })
                            .map((item, index) => (
                                <View key={index}>
                                    
                                    <View className="flex-row items-center w-full min-h-[70] justify-between">
                                        <View className="flex-row items-center justify-center">
                                            <View className="w-[70] items-center justify-center">
                                                <Image style={{ width: 40, height: 40 }} source={{ uri: item.Cup.url }} />
                                            </View>
                                            <View>
                                                <Text className="text-lg font-bold">Water</Text>
                                                <Text>{item.drinkClock}</Text>
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
                        <Image className="w-[80] h-[150]" source={require("../../assets/images/noDoc.png")} />
                        <Text className="text-gray-400 text-lg font-bold">Geçmişiniz bulunmamaktadır.</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

