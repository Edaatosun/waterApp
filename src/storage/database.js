import { Alert } from "react-native";
import { db } from "../../firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, getDoc,setDoc, query, orderBy, limit, where } from "firebase/firestore";

/**
 * addDoc = ekleme işlemi
 * getDocs = listeleme işlemi: Bir koleksiyondaki tüm belgeleri alır.
 * updateDoc 0 güncelleme işlemi
 * deleteDoc = sime işlemi
 * getDoc = listeleme işlemi :  Sadece tek bir belgeyi alır.
 * doc = "users" koleksiyonunda "abc123" ID’li belgeyi temsil eder.
 */


export async function addItem(collectionName, data) {
  let string = JSON.stringify(data)
  let newObj = JSON.parse(string)
  try {
    const docRef = await addDoc(collection(db, collectionName),newObj);
  
    console.log("Document written with ID: ", docRef.id);
    return true;
  } catch (e) {
    console.error("Error adding document: ", e);
    return false;
  }
};


// // Veri ekleme/güncelleme fonksiyonu
// export const setData = async (collectionName, data, docNo, subCollection = null) => {
//   Alert.alert("Veri ekleniyor/güncelleniyor...");

//   try {
//     let string = JSON.stringify(data);
//     let newObj = JSON.parse(string);

//     // Eğer bir subCollection (alt koleksiyon) belirtilmişse, alt koleksiyona veri ekle
//     if (subCollection) {
//       const subCollectionRef = collection(db, collectionName, docNo, subCollection);
      
//       // Eğer alt koleksiyon varsa, yeni hedef ekleyelim (addDoc kullanarak)
//       await addDoc(subCollectionRef, newObj);
//       Alert.alert("veri başarıyla eklendi!");
//     } else {
//       // Ana koleksiyon (users) için veri ekleyelim veya güncelleyelim
//       await setDoc(doc(db, collectionName, docNo), newObj);
//       console.log("Ana koleksiyona (users) veri başarıyla eklendi veya güncellendi!");
//     }

//   } catch (error) {
//     console.error('Veri ekleme/güncelleme hatası:', error);
//   }
// };



// Veri güncelleme işlemi
export const updateItem = async (collectionName, docNo, data) => {
  console.log("geldiii");
  let string = JSON.stringify(data)
  let newObj = JSON.parse(string)
  try {
    // Belirtilen collection ve docNo'ya göre veri güncelleniyor
    const docRef = doc(db, collectionName, docNo);
    
    await updateDoc(docRef, newObj);
    console.log('Veri başarıyla güncellendi!');
    return true;
    
  } catch (error) {
    console.error('Veri güncelleme hatası:', error);
    return false;
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
//belli değill
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


///////////////////////////////////////////////

export const fetchData = async (collectionName, userId) => {
  try {
    const q = query(collection(db, collectionName), where("user_id", "==", userId));
    const querySnapshot = await getDocs(q);

    // Eğer sorgu sonucu boşsa, null döndür
    if (querySnapshot.empty) {
      return null;
    }

    // Verileri diziye aktar
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    return data;
  } catch (error) {
    console.error(`Firestore'dan veri çekerken hata oluştu (${collectionName}):`, error);
    return [];
  }
};

export const queryGoalId = async (collectionName, goalId) => {
  try {
    const q = query(collection(db, collectionName), where("goal_id", "==", goalId));
    const querySnapshot = await getDocs(q);

    // Eğer sorgu sonucu boşsa, null döndür
    if (querySnapshot.empty) {
      return null;
    }

    // Verileri diziye aktar
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    return data;
  } catch (error) {
    console.error(`Firestore'dan veri çekerken hata oluştu (${collectionName}):`, error);
    return [];
  }
};



export const getLastAdd = async (collectionName, userId) => {
  try {
    console.log("Sorgu başlatıldı...");

    const q = query(
      collection(db, collectionName),
      where("user_id", "==", userId), 
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(q);
    console.log("Sorgu sonucu:", querySnapshot);

    // Eğer sonuç boşsa null döndür
    if (querySnapshot.empty) {
      console.log("Sonuç bulunamadı.");
      return null;
    }

    // En son eklenen dokümanı al
    const latestDoc = querySnapshot.docs[0];
    return { docId: latestDoc.id, ...latestDoc.data() };

  } catch (error) {
    console.error("Son veriyi getirme hatası:", error);
    return null;
  }
};


