import {
   addDoc,
   collection,
   onSnapshot, 
   serverTimestamp,
  query, 
  where,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useEffect, useRef, useState } from "react";
import Message from "../components/Message";
import EmojiPicker from 'emoji-picker-react';

const ChatPage = ({room, setRoom}) => {
  const [text, setText] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([]);
  const lastMsg = useRef(null);

// form gönderilince mesajı veri tabanın kaydet
    const handleSubmit = async (e) => {
  e.preventDefault()
   // mesaj boş mu kontrol et boşsa durdur
   if (text.trim() === "") return;

  //mesaj document'inin kaydedileceği kolleksiyonun referansını al.
  const messagesCol = collection(db, "messages")
  
  //referansı alınan kolleksiyona documentı ekle
  await addDoc(messagesCol, {
    text,
    room,
    author:{
        id: auth.currentUser.uid,
        name: auth.currentUser.displayName,
        photo: auth.currentUser.photoURL,
    },
    createdAt:serverTimestamp(),
  });

  //formu temizle
 setText("");
};


// mevcut odada gönderilen mesajları anlaık olarak al
useEffect(() => {
//1) öncelikle abone olunacak kolleksiyonun referansı al
const messagesCol = collection(db, "messages");

//2) Sorgu ayarlarını yap
const q = query(messagesCol,
  where("room","==", room),orderBy("createdAt", "asc"));

//3) onSnapshot: anlık olarak kolleksiyondaki değişimleri izler
//kolleksiyon her değiştiğinde verdiğimiz callback function tetiklenir ve güncellemeleri alır.
const unsub = onSnapshot(q, (snapshot) => {
  let temp = [];

  //data() metodu ile dökümanların içerisindeki veriye erişip geçici diziye aktardık
snapshot.docs.forEach((doc) => {
  temp.push (doc.data());
})
//son mesaja odakla
lastMsg.current.scrollIntoView({behavior:"smooth"});
setMessages(temp);
});
//4)kullanıcı sayfadan ayrıldığı anda dinlemeyi durdur.
return () => {unsub()};
}, []);


  return (
    <div className="chat-page">
  <header>
    <p>{auth.currentUser?.displayName} </p>
    <p>{room} </p>
    <button onClick={() => setRoom(null)}>Farklı Oda</button>
  </header>

  <main>
    {messages.length < 1 ? (
       <div><p className="warn">Sohbete ilk mesajı gönderin</p> </div>
      ) : (
         messages.map((data,key) =><Message data={data} key={key} />)
      )}
      <div ref={lastMsg} />
  </main>

  <form className="send-form" onSubmit={handleSubmit}>
    <input
    value={text}
     onChange={(e) => setText(e.target.value)} 
     placeholder="mesajınızı yazınız" 
     type="text" />
    <div >
    
      <EmojiPicker 
      onEmojiClick={(e) => {
        setText(text + e.emoji)
      setIsOpen(false);
      }} 
      open={isOpen} 
      skinTonesDisabled/>
    <button type="button" onClick={() => setIsOpen(!isOpen)}>😄</button>
    </div>
   
    <button type="submit">Gönder</button> 
  </form>
    </div>
  );
};

export default ChatPage;
