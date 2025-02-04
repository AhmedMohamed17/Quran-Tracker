import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";
import "./styles.css";

const firebaseConfig = {
  apiKey: "AIzaSyAeRi74HEvd7VhkSg-XgOSHGiJ5tGq4ZCo",
  authDomain: "quran-7ea22.firebaseapp.com",
  projectId: "quran-7ea22",
  storageBucket: "quran-7ea22.firebasestorage.app",
  messagingSenderId: "1054447362065",
  appId: "1:1054447362065:web:292326c26abc0b3d5911b0",
  measurementId: "G-ERWQNNV6VT",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const prayers = [
  "اللّهُمَّ اغْسِلْنى مِن الذنوب، وَطَهِّرْنى مِنَ الْعُيُوبِ",
  "اللَّهُمَّ ارْزُقْنِي السِّتْرَ وَالْعَفَافَ، وَأَلْبِسْنِي لِبَاسَ الْقُنُوعِ وَ الْكَفَافِ",
  "اللهم اغفر للمؤمنين والمؤمنات، الأحياء منهم والأموات.",
  "اللهم اجعلنا من أهل الجنة، واجعلنا من أهل الدعاء.",
  "اللهم ارزقنا توبة نصوحًا، واغفر لنا ما تقدم من ذنبنا وما تأخر.",
  "اللهم اجعلنا من الذين يستمعون القول فيتبعون أحسنه.",
  "اللهم احفظنا من كل شر ومن كل مرض، واجعلنا من الفائزين في الدنيا والآخرة.",
  "اللهم لك الحمد حتى ترضى، ولك الحمد إذا رضيت",
  "استغفر الله",
  "ٌقل الحمدلله",
];

const parts = Array.from({ length: 30 }, (_, i) => i + 1);
const colors = [
  "#f87171",
  "#60a5fa",
  "#34d399",
  "#facc15",
  "#a78bfa",
  "#f472b6",
  "#818cf8",
  "#14b8a6",
  "#fb923c",
  "#84cc16",
  "#10b981",
  "#06b6d4",
  "#f43f5e",
  "#d946ef",
  "#8b5cf6",
  "#f59e0b",
  "#0ea5e9",
  "#6b7280",
];

export default function KhatmaTracker() {
  const [selectedParts, setSelectedParts] = useState({});
  const [userNames, setUserNames] = useState({});
  const [userColors, setUserColors] = useState({});
  const [currentUser, setCurrentUser] = useState("");
  const [currentColor, setCurrentColor] = useState("");
  const [inputName, setInputName] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentPrayer, setCurrentPrayer] = useState(prayers[0]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "khatmaData", "sharedData"),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSelectedParts(data.selectedParts || {});
          setUserNames(data.userNames || {});
          setUserColors(data.userColors || {});
        }
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setIsCompleted(Object.keys(selectedParts).length === 30);
  }, [selectedParts]);

  const saveData = async (updatedParts, updatedNames, updatedColors) => {
    await setDoc(doc(db, "khatmaData", "sharedData"), {
      selectedParts: updatedParts,
      userNames: updatedNames,
      userColors: updatedColors,
    });
  };

  const togglePart = async (part) => {
    if (!currentUser || !currentColor) {
      alert("يرجى إدخال اسمك واختيار لون قبل تحديد جزء.");
      return;
    }
    if (selectedParts[part] && userNames[part] !== currentUser) {
      alert("لا يمكنك تعديل اختيار مستخدم آخر.");
      return;
    }
    const updatedParts = { ...selectedParts };
    const updatedNames = { ...userNames };
    const updatedColors = { ...userColors };

    if (updatedParts[part]) {
      delete updatedParts[part];
      delete updatedNames[part];
      delete updatedColors[part];
    } else {
      updatedParts[part] = currentColor;
      updatedNames[part] = currentUser;
      updatedColors[part] = currentColor;
    }
    await saveData(updatedParts, updatedNames, updatedColors);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrayer(prayers[Math.floor(Math.random() * prayers.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  const handleLogin = () => {
    if (!inputName.trim()) {
      alert("يرجى إدخال اسمك أولًا");
      return;
    }
    setCurrentUser(inputName);
  };
  const restart = async () => {
    await saveData({}, {}, {});
    setSelectedParts({});
    setUserNames({});
    setUserColors({});
    setIsCompleted(false);
  };
  return (
    <div className="container">
      <h2 className="title reem-kufi">
        🌿 ختمة على روح نسمة و جميع أموات المسلمين جميعا 🌿
      </h2>
      <p className="description reem-kufi">
        اللهم اغفر لها ولهم وارحمها واسكنهم جميعًا الفردوس الأعلى من الجنة بدون
        حساب ولا سابقة عذاب، اللهم آمين
      </p>

      {!currentUser ? (
        <div className="login-box">
          <input
            type="text"
            placeholder="أدخل اسمك الكامل"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            className="input reem-kufi"
          />
          <button className="button green reem-kufi" onClick={handleLogin}>
            تسجيل الدخول
          </button>
        </div>
      ) : (
        <div className="user-info">
          <p className="reem-kufi">مرحبًا، {currentUser}</p>
          <button
            className="button logout reem-kufi"
            onClick={() => {
              setCurrentUser("");
              setCurrentColor("");
            }}
          >
            تسجيل الخروج
          </button>
        </div>
      )}

      {currentUser && !currentColor && (
        <div className="color-picker">
          <p className="reem-kufi">اختر لونك المميز:</p>
          <div className="colors">
            {colors.map((color) => (
              <button
                key={color}
                className="color-btn"
                style={{ backgroundColor: color }}
                onClick={() => setCurrentColor(color)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid">
        {parts.map((part) => (
          <motion.div
            key={part}
            whileTap={{ scale: 0.9 }}
            className="part-box reem-kufi"
            style={{ backgroundColor: selectedParts[part] || "#e2e8f0" }}
            onClick={() => togglePart(part)}
          >
            {part}
            {userNames[part] && <p className="user-name">{userNames[part]}</p>}
          </motion.div>
        ))}
      </div>

      {isCompleted && (
        <div className="completion-message">
          <p className="reem-kufi">تم إكمال الختمة! 🎉</p>
        </div>
      )}

      {/* عرض الدعاء */}
      <motion.div
        className="prayer-box"
        initial={{ opacity: 0, x: "-100%" }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 25 }}
      >
        <p className="reem-kufi">{currentPrayer}</p>
      </motion.div>

      {/* زر لإعادة البدء */}
      {isCompleted && (
        <button className="button restart reem-kufi" onClick={restart}>
          ابدأ من جديد
        </button>
      )}

      {/* Footer */}
      <footer className="footer reem-kufi">
        <p>{رَبِّ اشْرَحْ لِي صَدْرِي * وَيَسِّرْ لِي أَمْرِي * وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي * يَفْقَهُوا قَوْلِي} [طه: 25- 28].</p>
      </footer>
    </div>
  );
}
