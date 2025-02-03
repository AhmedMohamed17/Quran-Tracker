import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./styles.css";
const prayers = [
  "اللهم اغفر للمؤمنين والمؤمنات، الأحياء منهم والأموات.",
  "اللهم اجعلنا من أهل الجنة، واجعلنا من أهل الدعاء.",
  "اللهم ارزقنا توبة نصوحًا، واغفر لنا ما تقدم من ذنبنا وما تأخر.",
  "اللهم اجعلنا من الذين يستمعون القول فيتبعون أحسنه.",
  "اللهم احفظنا من كل شر ومن كل مرض، واجعلنا من الفائزين في الدنيا والآخرة.",
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
  "#78716c",
  "#71717a",
  "#a3a3a3",
  "#64748b",
  "#f87171",
  "#60a5fa",
  "#34d399",
  "#facc15",
  "#a78bfa",
  "#f472b6",
  "#818cf8",
  "#14b8a6",
];

export default function KhatmaTracker() {
  const [selectedParts, setSelectedParts] = useState(
    () => JSON.parse(localStorage.getItem("selectedParts")) || {}
  );
  const [userNames, setUserNames] = useState(
    () => JSON.parse(localStorage.getItem("userNames")) || {}
  );
  const [userColors, setUserColors] = useState(
    () => JSON.parse(localStorage.getItem("userColors")) || {}
  );
  const [currentUser, setCurrentUser] = useState(
    () => localStorage.getItem("currentUser") || ""
  );
  const [currentColor, setCurrentColor] = useState(
    () => localStorage.getItem("currentColor") || ""
  );
  const [inputName, setInputName] = useState("");
  const [currentPrayer, setCurrentPrayer] = useState(prayers[0]);
  const [showPrayer, setShowPrayer] = useState(true);

  useEffect(() => {
    localStorage.setItem("selectedParts", JSON.stringify(selectedParts));
    localStorage.setItem("userNames", JSON.stringify(userNames));
    localStorage.setItem("userColors", JSON.stringify(userColors));
    localStorage.setItem("currentColor", currentColor);
  }, [selectedParts, userNames, userColors, currentColor]);

  useEffect(() => {
    localStorage.setItem("currentUser", currentUser);
  }, [currentUser]);
  useEffect(() => {
    const interval = setInterval(() => {
      setShowPrayer(true); // إظهار الدعاء الحالي

      // بعد 15 ثانية نقوم بتغيير الدعاء
      setTimeout(() => {
        setShowPrayer(false); // إخفاء الدعاء الحالي
        setTimeout(() => {
          const randomPrayer =
            prayers[Math.floor(Math.random() * prayers.length)];
          setCurrentPrayer(randomPrayer); // تغيير الدعاء
          setShowPrayer(true); // إظهار الدعاء الجديد
        }, 9000); // تأخير قصير قبل إظهار الدعاء الجديد
      }, 9000); // إخفاء الدعاء بعد 15 ثانية
    }, 9000); // تكرار العملية كل دقيقة

    return () => clearInterval(interval); // تنظيف الـ interval عند الخروج
  }, []);

  const selectColor = (color) => {
    setCurrentColor(color);
    setUserColors((prev) => ({ ...prev, [currentUser]: color }));
  };

  const togglePart = (part) => {
    if (!currentUser.trim()) {
      alert("يرجى إدخال اسمك الكامل قبل اختيار جزء.");
      return;
    }
    if (!currentColor) {
      alert("يرجى اختيار لون قبل تحديد جزء.");
      return;
    }
    if (selectedParts[part] && userNames[part] !== currentUser) {
      alert("لا يمكنك تعديل اختيار مستخدم آخر.");
      return;
    }
    setSelectedParts((prev) => {
      const newParts = { ...prev };
      const newUserNames = { ...userNames };
      if (newParts[part]) {
        delete newParts[part];
        delete newUserNames[part];
      } else {
        newParts[part] = currentColor;
        newUserNames[part] = currentUser;
      }
      setUserNames(newUserNames);
      return newParts;
    });
  };

  const resetKhatma = () => {
    setSelectedParts({});
    setUserNames({});
    setUserColors({});
    setCurrentColor("");
  };

  const handleLogin = () => {
    if (inputName.trim().length < 3) {
      alert("يرجى إدخال اسمك الكامل (على الأقل 3 أحرف)");
      return;
    }
    setCurrentUser(inputName.trim());
    setInputName("");
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
            onClick={() => setCurrentUser("")}
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
                onClick={() => selectColor(color)}
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
      {Object.keys(selectedParts).length === 30 && (
        <div className="completion-message">
          <p className="reem-kufi">تم إكمال الختمة! 🎉</p>
          <button className="button reset reem-kufi" onClick={resetKhatma}>
            إعادة التعيين
          </button>
        </div>
      )}
      {/* Display prayer */}
      <motion.div
        className="prayer-box"
        initial={{ opacity: 0, x: "-100%" }} // بداية العنصر مخفي على اليسار
        animate={{ opacity: 1, x: 0 }} // التأثير بالظهور من اليسار
        transition={{ type: "spring", stiffness: 100, damping: 25 }} // إضافة تأثير الارتداد (bounce)
      >
        <p className="reem-kufi">{currentPrayer}</p>
      </motion.div>
      {/* Footer */}
      <footer className="footer reem-kufi">
        <p> 🖤 إهداء لصديقي العزيز محمد سيد حسنين</p>
        <p>
          Dieses Werk ist meinem lieben Freund Muhammad Sayed Hassanein
          gewidmet. 🖤
        </p>
      </footer>
    </div>
  );
}
