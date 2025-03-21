import { Alert } from "react-native";
import { db } from "../../firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, getDoc,setDoc, query, orderBy, limit } from "firebase/firestore";

/**
 * addDoc = ekleme işlemi
 * getDocs = listeleme işlemi: Bir koleksiyondaki tüm belgeleri alır.
 * updateDoc 0 güncelleme işlemi
 * deleteDoc = sime işlemi
 * getDoc = listeleme işlemi :  Sadece tek bir belgeyi alır.
 * doc = "users" koleksiyonunda "abc123" ID’li belgeyi temsil eder.
 */
export async function addItem(collectionName, data) {
  // console.log(data);
  let string = JSON.stringify(data);
  let newObj = JSON.parse(string);
  try {
    const docRef = await addDoc(collection(db, collectionName),newObj);
  
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
// Veri ekleme/güncelleme fonksiyonu
export const setData = async (collectionName, data, docNo, subCollection = null) => {
  Alert.alert("Veri ekleniyor/güncelleniyor...");

  try {
    let string = JSON.stringify(data);
    let newObj = JSON.parse(string);

    // Eğer bir subCollection (alt koleksiyon) belirtilmişse, alt koleksiyona veri ekle
    if (subCollection) {
      const subCollectionRef = collection(db, collectionName, docNo, subCollection);
      
      // Eğer alt koleksiyon varsa, yeni hedef ekleyelim (addDoc kullanarak)
      await addDoc(subCollectionRef, newObj);
      Alert.alert("veri başarıyla eklendi!");
    } else {
      // Ana koleksiyon (users) için veri ekleyelim veya güncelleyelim
      await setDoc(doc(db, collectionName, docNo), newObj);
      console.log("Ana koleksiyona (users) veri başarıyla eklendi veya güncellendi!");
    }

  } catch (error) {
    console.error('Veri ekleme/güncelleme hatası:', error);
  }
};
// Veri güncelleme işlemi
export const updateItem = async (collectionName, docNo, data) => {
  try {
    // Belirtilen collection ve docNo'ya göre veri güncelleniyor
    const docRef = doc(db, collectionName, docNo);
    await updateDoc(docRef, data);
    console.log('Veri başarıyla güncellendi!');
  } catch (error) {
    console.error('Veri güncelleme hatası:', error);
  }
};

// Belirli bir belgenin içindeki veriyi almak için
export const getItem = async (collectionName, docNo) => {
  try {
    const docRef = doc(db, collectionName, docNo);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Veri bulundu:", docSnap.data());
      return docSnap.data();
    } else {
      console.log("Veri bulunamadı");
      return null;
    }
  } catch (error) {
    console.error('Veri getirme hatası:', error);
  }
};

// Bir koleksiyondaki tüm belgeleri almak
export const getAllItems = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    
    const items = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log('Veriler:', items);
    return items;
  } catch (error) {
    console.error('Veri getirme hatası:', error);
  }
};



//------ sub collection-----

export const getSubCollectionData = async (collectionName, docNo, subCollection) => {
  try {
    // Alt koleksiyon referansını oluşturuyoruz
    const subCollectionRef = collection(db, collectionName, docNo, subCollection);
    
    // Alt koleksiyonun içeriğini alıyoruz
    const querySnapshot = await getDocs(subCollectionRef);

    if (!querySnapshot.empty) {
      // Alt koleksiyonda belgeler mevcutsa, verileri alıyoruz
      console.log(`${subCollection} alt koleksiyonunda belgeler bulundu:`);
      
      // Alt koleksiyonun içindeki her belgeye erişiyoruz ve verisini döndürüyoruz
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,  // Belgenin ID'sini almak
        ...doc.data() // Belge verilerini almak
      }));

      return data;
    } else {
      // Alt koleksiyon boşsa, null döndürüyoruz
      console.log(`${subCollection} alt koleksiyonunda veri bulunamadı.`);
      return null;
    }
  } catch (error) {
    console.error("Veri getirme hatası:", error);
  }
};


//son eklenen kullanıcı hedefi için 
export const getLastGoal = async (userId) => {

  try {
    // 'users' koleksiyonundaki 'userId' belgesinin altındaki 'goals' alt koleksiyonuna erişiyoruz
    const subCollectionRef = collection(db, "Amount", userId, "goals");
    console.log(subCollectionRef,"heyyyyyyy")

    // Verileri 'createdAt' alanına göre azalan sırayla sıralıyoruz
    const goalsQuery = query(subCollectionRef, orderBy("createdAt", "desc"), limit(1));
    // Verileri alıyoruz
    const querySnapshot = await getDocs(goalsQuery);
    console.log(querySnapshot,"heyyyyyyy2")

    // Eğer veri varsa, en son eklenen hedefi döndürüyoruz
    if (!querySnapshot.empty) {
      const lastGoalDoc = querySnapshot.docs[0];
      const lastGoal = { id: lastGoalDoc.id, ...lastGoalDoc.data() }; // ID’yi dahil et
      console.log("En son eklenen hedef:", lastGoal);
      return lastGoal;
    } else {
      console.log("Hiç hedef bulunamadı.");
      return null;
    }
  } catch (error) {
    console.error("Veri alma hatası:", error);
  }
};

export const updateSubCollectionData = async (collectionName, docNo, subCollection, subDocId, updateData) => {
  try {
    // Güncellenecek belgeye referans al
    const subDocRef = doc(db, collectionName, docNo, subCollection, subDocId);

    // Belgeyi güncelle
    await updateDoc(subDocRef, updateData);

    console.log(`✅ ${subCollection}/${subDocId} güncellendi.`);
    return true;
  } catch (error) {
    console.error("❌ Alt koleksiyon verisi güncellenirken hata:", error);
    return false;
  }
};

