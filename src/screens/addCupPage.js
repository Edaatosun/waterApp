import { useNavigation } from "@react-navigation/native";
import { Alert, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import EditIcon from "react-native-vector-icons/AntDesign";
import { useState } from "react";
import { Cup } from "../model/cup";
import {addItem} from "../storage/database";
import { auth } from "../../firebase";



export default function AddCup() {
    const navigation = useNavigation();
    const [selectedCupIcon, setSelectedCupIcon] = useState("https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F6.png?alt=media&token=b55c7334-8099-457c-b80b-aa32f349fa9f"); // Varsayılan bardak 200ml
    const [selectedCupml, setSelectedCupml] = useState(200); // Varsayılan bardak 200ml
    const [cupName,setCupName] = useState("");

    const cupIcon = [
        { id: 1, name: "Water", ml: 100, url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F1.png?alt=media&token=32be6cac-19d8-41ca-b968-ec478ebf49d3" },
        { id: 2, name: "Water", ml: 125, url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F7.png?alt=media&token=870c8f99-1357-4bc9-9c31-fe0dc11b535f" },
        { id: 3, name: "Water", ml: 150, url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F9.png?alt=media&token=391cb867-7510-42f5-bba2-7e926a636a9b" },
        { id: 4, name: "Water", ml: 200, url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F6.png?alt=media&token=b55c7334-8099-457c-b80b-aa32f349fa9f" },
        { id: 5, name: "Water", ml: 250, url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F3.png?alt=media&token=479d07e7-f10d-4dde-825a-4f854af595a4" },
        { id: 6, name: "Water", ml: 300, url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F8.png?alt=media&token=4072279a-f33e-4a0a-8f75-fd3526cd5034" },
        { id: 7, name: "Water", ml: 400, url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F5.png?alt=media&token=f1bbc105-2c50-41c9-be43-a75e0b634deb" },
        { id: 8, name: "Water", ml: 500, url: "https://firebasestorage.googleapis.com/v0/b/waterapp-cd21d.firebasestorage.app/o/waterCupIcon%2F10.png?alt=media&token=161701cf-a7b5-498b-9571-09d62fb144a5" },
    ];

    const addCupFunction = async () => {
        if (!cupName || !selectedCupml) {
            Alert.alert("Tüm alanları doldurunuz !!!");
            return;
        }
    
        try {
            const userId = auth.currentUser.uid;
            if (!userId) {
                throw new Error("User is not logged in.");
            }
    
            // Assuming Cup is a function that returns an object.
            const cupObj = new Cup(userId, selectedCupIcon, selectedCupml, cupName);
    
            await addItem("cups",cupObj);
    
            Alert.alert("Başarılı");
            navigation.navigate("Drawer");
            
        } catch (error) {
            console.error("Error in addCupFunction:", error); // More detailed error logging
            Alert.alert("Bir hata oluştu!", error.message || "Beklenmedik bir hata.");
        }
    };
    

    return (
        <View className="h-full flex-1">
            <View className="w-full flex-row items-center justify-between  px-5 py-3 mt-5">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="chevron-back-circle-outline" size={45} />
                </TouchableOpacity>
                
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center' }}>
                <View className="flex-row items-center justify-center">
                   
                    <TextInput 
                    className="text-lg  font-bold mb-5 border-b-2 rounded-xl h-[45] w-[260]"
                    placeholder = "Bardak İsmi Giriniz🖋 "
                    onChangeText = {setCupName}
                    />
                </View>
                <View style={styles.imageBorder}>
                    <Image
                        style={{width: 80, height: 80, alignItems:"center", justifyContent:"center"}}
                        source={{
                            uri: selectedCupIcon
                        }}
                    />
                </View>
                <TouchableOpacity className="flex-row p-5 w-[150] items-center justify-center border-2 border-blue-400 bg-blue-400 rounded-3xl mt-5">
                    <Text className="text-lg font-bold text-white">{selectedCupml} ml </Text>
                    <EditIcon name="edit" size={25} color={"white"} />
                </TouchableOpacity>

            </View>
            <View className="w-full flex-row items-center justify-center mt-4">
                <Text className="text-lg text-gray-400 mr-1 ml-1">Bardak İkonunu Seç</Text>
                <View className="border-b-2 border-gray-400 w-[55%]" />
            </View>
            <FlatList
          data={cupIcon}
          keyExtractor={(item) => item.id.toString()}
          numColumns={4}
          renderItem={({ item }) => (

            <TouchableOpacity
            onPress={()=>{setSelectedCupIcon(item.url); setSelectedCupml(item.ml);}}
                className="w-[80] h-[80] p-3 border rounded-full m-2 bg-[#E5F3F0] items-center justify-center">
                <Image
                    source={{ uri: item.url }}
                    style={{ width: 30, height: 30, marginBottom: 5 ,color:"bg-[#E5F3F0]"}} 
                    resizeMode="contain"/>

            </TouchableOpacity>
            
        )}>

        </FlatList>

        <View className="justify-end items-center mb-5">
                <TouchableOpacity
                onPress={() => { addCupFunction() }}


                 className="justify-center items-center rounded-xl w-[85%] bg-blue-400 h-[50] ">
                    <Text className="text-white font-bold text-xl">Ekle</Text>
                </TouchableOpacity>
            </View>
      

        </View>
    );
};

const styles = StyleSheet.create({
    imageBorder:{
        width: 150,
        height: 150, 
        borderRadius: 90, 
        borderWidth: 2, 
        borderColor: "gray", 
        alignItems: "center",
        justifyContent: "center",
    },
});

