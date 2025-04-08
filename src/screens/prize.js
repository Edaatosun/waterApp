import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";

export default function Prize() {
    const navigation = useNavigation();
    return (
        <View className="items-center justify-center bg-white h-[820]">
            <Image
                source={{ uri: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXpnazI3ZXMydWIxNzd5OWF3NWoxZGNjOHVuZnFxYWkyc25yZWc4eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7bu57lYhUEFiYDSM/giphy.gif" }}
                style={{ width: 400, height: 400 }}
                contentFit="cover"
            />
            <Text className="font-bold text-xl mt-5 ">Günlük Su Hedefini Tamamladın!!!! </Text>
            <Text className="font-bold text-xl ">Kutlarım </Text>
            <Text className="mt-6 text-base">Tebrikler! Bugün su hedefini tamamladın! Devam et, sağlığın için harika bir adım
            attın!</Text>
            <Text className="mt-6 text-base">Hedeflerini tamamlamaya devam et</Text>
            <Text className=" mt-6 text-base">yeni ödüller seni bekliyor </Text>
            <View className="justify-end flex-1 mb-5">
                <View className="flex-row justify-between items-center">
                    <TouchableOpacity onPress={()=>{navigation.goBack();}}
                    className="bg-gray-100  p-5 items-center rounded-3xl mr-10 px-14">
                        <Text className="text-blue-400">Geri</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className=" bg-blue-400 w-50 p-5 items-center rounded-3xl ">
                        <Text className="text-white">Arkadaşlarınla Paylaş</Text>
                    </TouchableOpacity>
                </View>

            </View>

        </View>
    );
}
