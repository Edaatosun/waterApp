import { db } from "../../firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, getDoc,setDoc } from "firebase/firestore";

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

