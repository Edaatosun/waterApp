import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { getLastAdd, updateItem } from "../storage/database";
import { GoalModel } from "../model/goal";
import { auth } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Prize() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true); // Veri güncellenmesini beklemek için loading durumu
    const [isBackButtonDisabled, setIsBackButtonDisabled] = useState(false); // Back button disable state

    // updateGoal fonksiyonu dışarıda tanımlandı
    const updateGoal = async (userId) => {
        try {
            const lastGoal = await getLastAdd("Amount", userId);
            if (lastGoal) {
                const updateData = new GoalModel(
                    userId,
                    lastGoal.goal_id,
                    lastGoal.amount,
                    lastGoal.createdAt,
                    lastGoal.resetAt,
                    true // completed true olarak güncelleniyor
                );

                // Hedefi güncelle
                const updatedData = await updateItem("Amount", lastGoal.docId, updateData);
                if (updatedData) {
                    console.log("güncellendiiii");
                    try {
                        await AsyncStorage.setItem("completedGoalProcess", JSON.stringify({ goalId: lastGoal.goal_id, isCompleted: true }));
                        console.log("completedGoalProcess başarıyla kaydedildi");
                    } catch (error) {
                        console.error("AsyncStorage kaydetme hatası:", error);
                    }
                   console.log("güncellenen hedef: ", updatedData);
                    setLoading(false); // Güncelleme tamamlandığında loading false yapalım
                    setIsBackButtonDisabled(false); // Back button'ı etkinleştir
                }
            }
        } catch (error) {
            console.error("Error updating goal:", error);
            setLoading(false); // Hata durumunda da loading'i false yapalım
            setIsBackButtonDisabled(false); // Back button'ı etkinleştir
        }
    };

    // useEffect içinde updateGoal fonksiyonunu çağırıyoruz
    useEffect(() => {
        const userId = auth.currentUser.uid;
        const handleUpdateGoal = async () => {
            await updateGoal(userId); // updateGoal fonksiyonunu çağırıyoruz ve asenkron bekliyoruz
        };
        handleUpdateGoal(); // Fonksiyonu çağır
    }, []); // Bu sadece bir kez çalışacak, çünkü bağımlılıklar boş []

    // Eğer veriler hala yükleniyorsa, kullanıcıya yükleniyor olduğunu gösterebiliriz
    if (loading) {
        return (
            <View className="items-center justify-center bg-white h-[820]">
                <Text className="text-xl font-bold">Veriler güncelleniyor...</Text>
            </View>
        );
    }

    return (
        <View className="items-center justify-center bg-white h-[820]">
            <Image
                source={{ uri: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXpnazI3ZXMydWIxNzd5OWF3NWoxZGNjOHVuZnFxYWkyc25yZWc4eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7bu57lYhUEFiYDSM/giphy.gif" }}
                style={{ width: 400, height: 400 }}
                contentFit="cover"
            />
            <Text className="font-bold text-xl mt-5">Günlük Su Hedefini Tamamladın!!!!</Text>
            <Text className="font-bold text-xl">Kutlarım</Text>
            <Text className="mt-6 text-base">Tebrikler! Bugün su hedefini tamamladın! Devam et, sağlığın için harika bir adım
                attın!</Text>
            <Text className="mt-6 text-base">Hedeflerini tamamlamaya devam et</Text>
            <Text className=" mt-6 text-base">Yeni ödüller seni bekliyor</Text>
            <View className="justify-end flex-1 mb-5">
                <View className="flex-row justify-between items-center">
                    <TouchableOpacity
                        onPress={() => {
                            if (!isBackButtonDisabled) { // Eğer loading yoksa ve back button disabled değilse geri gitme işlemi yapılır
                                navigation.navigate("Drawer");
                            }
                        }}
                        className={`bg-gray-100 p-5 items-center rounded-3xl mr-10 px-14 ${isBackButtonDisabled ? 'opacity-50' : ''}`}>
                        <Text className="text-blue-400">Geri</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="bg-blue-400 w-50 p-5 items-center rounded-3xl">
                        <Text className="text-white">Arkadaşlarınla Paylaş</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
