import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  TextInput,
} from "react-native";
import { fetchData, updateItem } from "../storage/database";
import { auth } from "../../firebase";  // Firebase auth importu
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../model/user";
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail, updatePassword } from "firebase/auth";  // Firebase'den updatePassword fonksiyonu

export default function Profile() {
  const navigation = useNavigation();
  const userId = auth.currentUser?.uid;

  const [user, setUser] = useState({
    email: "",
    gender: "",
    id: "",
    name: "",
    surname: "",
    password: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);  // Düzenleme modalı için state
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [editedUser, setEditedUser] = useState({ name: "", surname: "", email: "", gender: "" });  // Düzenleme için kullanıcı verisi

  useFocusEffect(
    React.useCallback(() => {
      const getData = async () => {
        if (userId) {
          const users = await fetchData("users", userId);
          if (users && users.length > 0) {
            const user = users[0];
            setUser({
              id: user.id || "",
              name: user.name || "",
              surname: user.surname || "",
              email: user.email || "",
              gender: user.gender || "",
              password: user.password || "",
            });
          }
        }
      };
      getData();
    }, [user])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userSession");
      await auth.signOut();
      Alert.alert("Başarıyla çıkış yapıldı");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Çıkış yaparken hata oluştu", error.message);
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword) {
      Alert.alert("HATA", "Yeni şifre boş olamaz.");
      return;
    }
  
    try {
      const firebaseUser = auth.currentUser;
  
      if (firebaseUser) {
        const email = firebaseUser.email;
        const oldPassword = user.password;  // Mevcut şifreyi veritabanından al
  
        // Kullanıcının kimliğini doğrulamak için eski şifreyi kullanarak re-authenticate işlemi
        const credential = EmailAuthProvider.credential(email, oldPassword);
  
        await reauthenticateWithCredential(firebaseUser, credential);
        console.log("User re-authenticated successfully");
  
        // Şifreyi Firebase'de güncelle
        await updatePassword(firebaseUser, newPassword);
        console.log("Password updated successfully in Firebase");
  
        // Şifreyi veritabanında güncelle
        const fetchDataForUser = await fetchData("users", userId);
        const userFromDb = fetchDataForUser[0];
        const updatedUser = new User(
          firebaseUser.uid,
          userFromDb.name,
          userFromDb.surname,
          userFromDb.email,
          userFromDb.gender,
          newPassword
        );
        await updateItem("users", userFromDb.id, updatedUser);
  
        setModalVisible(false);
        Alert.alert("Başarıyla Şifre Değiştirildi", "Şifreniz başarıyla güncellenmiştir.");
      } else {
        Alert.alert("HATA", "Kullanıcı oturumu açık değil.");
      }
    } catch (error) {
      console.error("Firebase password update error:", error.message);
      Alert.alert("Şifre Değiştirirken Hata", "Firebase şifresi güncellenirken bir hata oluştu.");
    }
  };

  const profileImage =
    user.gender.toLowerCase() === "kadın"
      ? require("../../assets/images/default_female.jpg")
      : require("../../assets/images/default_male.jpg");

  const InfoItem = ({ icon, label, value }) => (
    <View className="flex-row justify-between items-center bg-[#b6dcfa] p-3 rounded-xl mb-2">
      <View className="flex-row items-center">
        <Icon name={icon} size={20} color="#0284c7" style={{ marginRight: 10 }} />
        <Text className="text-[#1e40af] font-medium">{label}</Text>
      </View>
      <Text className="text-[#0f172a] font-semibold max-w-[60%]" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );

  const handleEditUser = async () => {
    try {
      const firebaseUser = auth.currentUser;
  
      if (firebaseUser) {
        // Eski şifreyi kullanarak kimlik doğrulama işlemi
        const email = firebaseUser.email;
        const oldPassword = user.password;  // Mevcut şifreyi veritabanından al
  
        const credential = EmailAuthProvider.credential(email, oldPassword);
  
        await reauthenticateWithCredential(firebaseUser, credential);
        console.log("User re-authenticated successfully");
  
        // E-posta güncelleme işlemi.
        if (newEmail) {
          await updateEmail(firebaseUser, newEmail);
          console.log("Email updated successfully in Firebase");
        }
  
        // Veritabanındaki kullanıcıyı güncelle
        const fetchDataForUser = await fetchData("users", userId);
        const userFromDb = fetchDataForUser[0];
        const updatedUser = new User(
          firebaseUser.uid,
          editedUser.name,
          editedUser.surname,
          newEmail || userFromDb.email, // Yeni e-posta varsa kullan, yoksa eski e-posta
          userFromDb.gender,
          newPassword || userFromDb.password // Yeni şifre varsa kullan, yoksa eski şifre
        );
  
        await updateItem("users", userFromDb.id, updatedUser);
  
        setUser(editedUser);
        setEditModalVisible(false);
        Alert.alert("Başarıyla Güncellendi", "Kişisel bilgileriniz başarıyla güncellenmiştir.");
      } else {
        Alert.alert("HATA", "Kullanıcı oturumu açık değil.");
      }
    } catch (error) {
      console.error("User update error:", error.message);
      Alert.alert("Hata", "Bilgiler güncellenirken bir hata oluştu.");
    }
  };
  

  return (
    <View className="flex-1 bg-white">
      {/* Üst alan */}
      <View className="bg-[#4f83cc] pt-10 pb-8 items-center rounded-b-3xl">
        <View className="flex-row w-full items-center px-5 mb-6">
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Icon color={"white"} name="menu" size={45} />
          </TouchableOpacity>
          <Text className="text-2xl font-bold ml-4 text-white">Profilim</Text>
        </View>

        <Image source={profileImage} className="h-32 w-32 rounded-full mb-3" />
        <Text className="text-2xl font-bold text-white">
          {user.name} {user.surname}
        </Text>
      </View>

      {/* Kişisel Bilgi Kartı */}
      <View className="mx-5 p-5 rounded-2xl mt-2 bg-[#cfe9fc] shadow-md">
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-[#1e3a8a] text-lg font-bold">Kişisel Bilgiler</Text>
          <TouchableOpacity onPress={() => setEditModalVisible(true)}>
            <Text className="text-[#1e3a8a]">Düzenle</Text>
          </TouchableOpacity>
        </View>

        <InfoItem icon="mail-outline" label="Email" value={user.email} />
        <InfoItem icon="person-circle-outline" label="İsim" value={user.name || "Yok"} />
        <InfoItem icon="person-circle-outline" label="Soyisim" value={user.surname || "Belirtilmedi"} />
        <InfoItem icon="lock-closed-outline" label="Şifre" value={user.password || "Bilinmiyor"} />
        <InfoItem icon="female-outline" label="Cinsiyet" value={user.gender} />
      </View>

      {/* Alt butonlar (kart gibi) */}
      <View className="px-5 mt-5 space-y-3">
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-[#b6dcfa] p-4 rounded-xl flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <Icon name="key-outline" size={20} color="#0284c7" style={{ marginRight: 10 }} />
            <Text className="text-[#1e40af] font-semibold">Şifreyi Değiştir</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-[#fee2e2] p-4 rounded-xl flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <Icon name="log-out-outline" size={20} color="#dc2626" style={{ marginRight: 10 }} />
            <Text className="text-[#dc2626] font-semibold">Çıkış Yap</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Modal for editing user details */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-80">
            <Text className="text-lg font-bold mb-4">Bilgileri Düzenle</Text>
            <TextInput
              className="border-2 border-blue-500 bg-white rounded-lg px-4 py-3 w-full mb-4"
              placeholder="Ad"
              onChangeText={(text) => setEditedUser({ ...editedUser, name: text })}
            />
            <TextInput
              className="border-2 border-blue-500 bg-white rounded-lg px-4 py-3 w-full mb-4"
              placeholder="Soyad"
              onChangeText={(text) => setEditedUser({ ...editedUser, surname: text })}
            />
            <TextInput
              className="border-2 border-blue-500 bg-white rounded-lg px-4 py-3 w-full mb-4"
              placeholder="Email"
              value={newEmail}
              onChangeText={setNewEmail}
            />
            <TouchableOpacity
              onPress={handleEditUser}
              className="bg-[#4E5496] px-6 py-2 rounded-lg mt-4 w-full items-center"
            >
              <Text className="text-white text-lg">Kaydet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setEditModalVisible(false)}
              className="bg-gray-300 px-6 py-2 rounded-lg mt-2 w-full items-center"
            >
              <Text className="text-black text-lg">İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for changing password */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-80">
            <Text className="text-lg font-bold mb-4">Yeni Şifre Girin</Text>
            <TextInput
              className="border-2 border-blue-500 bg-white rounded-lg px-4 py-3 w-full"
              placeholder="Yeni şifre"
              secureTextEntry={true}
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TouchableOpacity
              onPress={handlePasswordChange}
              className="bg-[#4E5496] px-6 py-2 rounded-lg mt-4 w-full items-center"
            >
              <Text className="text-white text-lg">Şifreyi Değiştir</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-gray-300 px-6 py-2 rounded-lg mt-2 w-full items-center"
            >
              <Text className="text-black text-lg">İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
