import { useState } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import IconGender from "react-native-vector-icons/MaterialCommunityIcons";
import { User } from "../model/user";
import { useNavigation } from "@react-navigation/native";
import { addItem, setData } from "../storage/database";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

export default function SignUp() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [secureTextConfirm, setSecureTextConfirm] = useState(true);
  const navigation = useNavigation();
  

  const signIn = async () => {
    if (!email || !password || !confirmPassword || !name || !surname) {
      return Alert.alert("HATA", "Lütfen tüm alanları doldurun.");
    }
    if (password !== confirmPassword) {
      return Alert.alert("HATA", "Şifreler uyuşmuyor.");
    }

    try {
      // Firebase Authentication ile kullanıcı kaydı
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      if(userCredential !== null){
        const user_id = userCredential.user.uid;
        const userData = new User(user_id, name, surname, email, gender, password); 
        await setData("users",userData, user_id,null);
  
        Alert.alert("Başarılı", "Kayıt başarıyla tamamlandı.");
        navigation.navigate("Login");
  
        // Kayıt başarılı, giriş ekranına yönlendirebilirsiniz veya başka işlemler yapabilirsiniz.

      }

      
    } catch (error) {
      Alert.alert("HATA", error.message);
    }
  };


  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
       <View className="flex-1 justify-center items-center bg-gray-100 px-4">

        <Image className="w-72 h-64 " source={require("../../assets/images/logo.png")} />
        <Text className="mb-6 font-bold text-lg">Welcome Water App</Text>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-grows w-full">
          {/* Ad Input */}
        <TextInput
          className="border-2 border-[#4E5496] bg-white rounded-lg px-4 py-3 w-full  mb-4"
          placeholder="İsim"
          value={name}
          onChangeText={setName}
          placeholderTextColor="gray"
        />

        {/* Soyad Input */}
        <TextInput
          className="border-2 border-[#4E5496] bg-white rounded-lg px-4 py-3 w-full  mb-4"
          placeholder="Soyisim"
          value={surname}
          onChangeText={setSurname}
          placeholderTextColor="gray"
        />


        {/* Email Input */}
        <TextInput
          className="border-2 border-[#4E5496] bg-white rounded-lg px-4 py-3 w-full  "
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="gray"
        />

        {/* Şifre Input */}
        <View className="relative w-full max-w-sm mt-4">
          <TextInput
            className="border-2 border-[#4E5496] bg-white rounded-lg px-4 py-3 w-full pr-10"
            placeholder="Şifre"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureText}
            placeholderTextColor="gray"
          />

          <TouchableOpacity
            className="absolute right-4 top-2 -translate-y-1/2"
            onPress={() => setSecureText(!secureText)}
          >
            <Icon name={secureText ? "eye-off" : "eye"} size={30} color="gray" />
          </TouchableOpacity>
        </View>

        {/* Onaylama Şifresi Input */}
        <View className="relative w-full max-w-sm mt-4">
          <TextInput
            className="border-2 border-[#4E5496] bg-white rounded-lg px-4 py-3 w-full pr-10"
            placeholder="Onaylama Şifresi"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={secureTextConfirm}
            placeholderTextColor="gray"
          />

          <TouchableOpacity
            className="absolute right-4 top-2 -translate-y-1/2"
            onPress={() => setSecureTextConfirm(!secureTextConfirm)}
          >
            <Icon name={secureTextConfirm ? "eye-off" : "eye"} size={30} color="gray" />
          </TouchableOpacity>
        </View>

        {/* Cinsiyet Seçeneği */}
        <View className="flex-row justify-center items-center mt-4 mb-2">
          <TouchableOpacity
            className={`bg-blue-500 rounded-full p-4 mx-4 justify-center items-center ${gender === "female" ? "bg-blue-700" : "bg-white"}`}
            onPress={() => setGender("female")}
          >
            <IconGender name="gender-female" size={45} color={gender === "female"? "white": "black"} />
          </TouchableOpacity>
          <Text className="text-blue-500 text-sm mt-2">Kız</Text>

          <TouchableOpacity
            className={`bg-blue-500 rounded-full p-4 mx-4 justify-center items-center ${gender === "male" ? "bg-blue-700" : "bg-white"}`}
            onPress={() => setGender("male")}
          >
            <IconGender name="gender-male" size={45} color={gender === "male"? "white": "black"} />
          </TouchableOpacity>
          <Text className="text-blue-500 text-sm mt-2">Erkek</Text>
        </View>


        {/* Sign Up Butonu */}
        <TouchableOpacity
          onPress={signIn}
          className="bg-[#4E5496] px-6 py-2 rounded-lg mt-6 mb-10 w-full max-w-sm items-center"
        >
          <Text className="text-white font-semibold text-lg">SIGN UP</Text>
        </TouchableOpacity>
        </ScrollView>

        </View>

    </TouchableWithoutFeedback>
   
  );
}
