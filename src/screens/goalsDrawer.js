import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {TouchableOpacity, View, Text, Image, Alert } from "react-native";
import IconMenu from "react-native-vector-icons/Ionicons";
import { GoalModel } from "../model/goal"
import { getLastAdd, updateItem} from "../storage/database";
import { auth } from "../../firebase";

export default function GoalsDrawer() {
    const [goal, setGoal] = useState(); // Başlangıç hedefi 2000 mL
    const navigation = useNavigation();

    const user = auth.currentUser;
    const userId = user.uid;

    useEffect(()=>{
        const lastData=async()=>{
            try {
                
                console.log(userId);
                const lastDoc = await getLastAdd("Amount", userId);
                if (lastDoc) {
                    setGoal(lastDoc.amount);
                }
                else {
                    Alert.alert("hedef güncellenriken bir sourn oluştu!");
                }  
            } catch (error) {
                console.log(error);
            }
            
        };

        lastData();
    },[]);


    const updateGoal = async () => {
        try {
            const lastDoc = await getLastAdd("Amount", userId);
            if (lastDoc) {
                const goalModal = new GoalModel(userId, goal, lastDoc.createdAt, lastDoc.resetAt, false);
                console.log(goalModal);
                await updateItem("Amount", lastDoc.docId, goalModal);
                Alert.alert("Başarılı", "Hedef güncellendi");
            }
            else {
                Alert.alert("hedef güncellenriken bir sourn oluştu!");
            }

        } catch (error) {
            console.log(error);
        }
    };


    const increaseGoal = () => {
        if (goal < 5000) setGoal(goal + 250); // 250 mL artır
    };

    const decreaseGoal = () => {
        if (goal > 500) setGoal(goal - 250); // 250 mL azalt
    };

    const presetGoals = [1000,1500, 2000, 2500, 3000];

    return (
        <View style={{ justifyContent:"center" , alignItems: "center",backgroundColor:"#FFF7F7", flex:1, }}>
            {/* Üst Menü */}
            <View className="w-full flex-row items-center justify-between px-5 py-3 mt-10">
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <IconMenu name="menu" size={45} />
            </TouchableOpacity>
            <Text className="text-lg font-bold">Bugün ki Hedefiniz</Text>
            <View style={{ width: 30 }} /> 
            </View>

            {/* Ön Tanımlı Seçenekler */}
            <View style={{ flexDirection: "row", marginBottom: 20,}}>
            {presetGoals.map((preset) => (
                <TouchableOpacity 
                    key={preset}
                    onPress={() => setGoal(preset)}
                    style={{
                        width:60,
                        padding: 10,
                        backgroundColor: goal === preset ? "#007bff" : "#eee",
                        borderRadius: 10,
                        margin: 8,
                        alignItems:"center"
                    }}>
                    <Text style={{ color: goal === preset ? "#fff" : "#000", fontSize: 18 }}>
                        {preset / 1000} L
                    </Text>
                </TouchableOpacity>
            ))}
            </View>

            <View style={{ marginBottom: 10,alignItems:"center", justifyContent:"center"}}>
                <Image style={{height:270, width:265,marginLeft:40}} source={require("../../assets/images/water.png")}></Image>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent:"center", marginTop:70 }}>
                <TouchableOpacity 
                    onPress={decreaseGoal} 
                    style={{ padding: 15, backgroundColor: "#ddd", borderRadius: 10, marginRight: 30 }}>
                    <Text style={{ fontSize: 20 }}>−</Text>
                </TouchableOpacity>

                <Text
                    style={{
                        fontSize: 28, // Daha büyük font
                        fontWeight: "bold", // Kalın yazı
                        textAlign: "center",
                        width: 100, // Daha geniş alan
                        borderBottomWidth: 1, // Kalın alt çizgi
                        borderColor: "#007bff",
                        paddingVertical: 5, // İç boşluk ekleme
                    }}
                >
                    {goal}
                </Text>

                <Text style={{ fontSize: 25, marginLeft: 5, fontWeight:"bold" }}>mL</Text>

                <TouchableOpacity 
                    onPress={increaseGoal} 
                    style={{ padding: 15, backgroundColor: "#ddd", borderRadius: 10, marginLeft: 30}}>
                    <Text style={{ fontSize: 20 }}>+</Text>
                </TouchableOpacity>
            </View>

           

            <View style={{ flex: 1, width: "90%", justifyContent: "flex-end", alignItems: "center", paddingBottom: 20 }}>
                <TouchableOpacity
                    onPress={() => updateGoal()} 
                    style={{
                        width: "90%", 
                        padding: 15, 
                        backgroundColor: "#007bff", 
                        borderRadius: 10, 
                        alignItems: "center"
                    }}
                >
                    <Text style={{ color: "white", fontSize: 18 }}>Hedefi Güncelle</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
