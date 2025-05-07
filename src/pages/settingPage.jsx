import React, { useEffect, useState } from "react";
import { Sun, Moon, Globe } from "lucide-react"; // Removed Bell since it's not used in the code
import BlurContainer from "../components/blurContainer";
import Button from "../components/button";
import Footer from "../components/footer";
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { t, i18n } = useTranslation();

  const [darkMode, setDarkMode] = useState(false);
  const [goal, setGoal] = useState("None");
  const [minCalories, setMinCalories] = useState("");
  const [maxCalories, setMaxCalories] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [language, setLanguage] = useState(i18n.language || "en");

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("userSettings");
    if (saved) {
      const parsed = JSON.parse(saved);
      setDarkMode(parsed.darkMode || false);
      setGoal(parsed.goal || "None");
      setMinCalories(parsed.minCalories || "");
      setMaxCalories(parsed.maxCalories || "");
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = () => {
    const settings = {
      darkMode,
      goal,
      minCalories,
      maxCalories,
    };
    localStorage.setItem("userSettings", JSON.stringify(settings));
    alert(t("settingsSaved")); // Translate the success message
  };

  // When health goal changes
  const handleGoalChange = (value) => {
    setGoal(value);
    if (value !== "None") {
      setShowPopup(true);
    }
  };

  // Confirm popup for health goal
  const handlePopupConfirm = () => {
    const settings = {
      darkMode,
      goal,
      minCalories,
      maxCalories,
    };
    localStorage.setItem("userSettings", JSON.stringify(settings));
    setShowPopup(false);
    alert(t("goalAndCaloriesSaved")); // Translate the success message
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: "url('/Profile.jpg')",
          boxShadow: "inset 0 0 0 2000px rgba(0, 0, 0, 0.3)",
        }}
      />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-12 px-6">
        <BlurContainer className="w-[450px] p-8 rounded-2xl bg-white/10 backdrop-blur-xl text-white">
          <h1 className="text-3xl font-bold text-center mb-6">{t("settings")}</h1>

          <div className="space-y-6">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between bg-white/10 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                {darkMode ? (
                  <Moon className="text-yellow-500" size={22} />
                ) : (
                  <Sun className="text-yellow-500" size={22} />
                )}
                <span className="text-white">{t("darkMode")}</span> {/* Translate the text */}
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 flex items-center rounded-full p-1 ${
                  darkMode ? "bg-yellow-500" : "bg-gray-500"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform ${
                    darkMode ? "translate-x-6" : "translate-x-0"
                  } transition`}
                />
              </button>
            </div>

            {/* Health Goal Selection */}
            <div className="flex items-center justify-between bg-white/10 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-white font-medium">{t("healthGoal")}</span> {/* Translate the text */}
              </div>
              <select
                value={goal}
                onChange={(e) => handleGoalChange(e.target.value)}
                className="bg-transparent text-white border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
              >
                <option className="text-black" value="None">{t("none")}</option> {/* Translate options */}
                <option className="text-black" value="Perte de poids">{t("weightLoss")}</option> {/* Translate options */}
                <option className="text-black" value="Prise de masse">{t("muscleGain")}</option> {/* Translate options */}
                <option className="text-black" value="Maintien de forme">{t("maintainFitness")}</option> {/* Translate options */}
              </select>
            </div>

            {/* Language Selector */}
            <div className="flex items-center justify-between bg-white/10 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="text-yellow-500" size={22} />
                <span className="text-white">{t("language")}</span> {/* Translate the text */}
              </div>
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-transparent text-white border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
              >
                <option className="text-black" value="en">{t("english")}</option> {/* Translate options */}
                <option className="text-black" value="fr">{t("french")}</option> {/* Translate options */}
                <option className="text-black" value="es">{t("spanish")}</option> {/* Translate options */}
              </select>
            </div>

            {/* Save Button */}
            <Button
              onClick={saveSettings}
              className="w-full bg-transparent hover:bg-yellow-500 text-yellow-500 hover:text-white border-2 border-yellow-500 font-semibold py-3 px-6 rounded-full transition-all duration-300"
            >
              {t("saveSettings")} {/* Translate the button text */}
            </Button>
          </div>
        </BlurContainer>
      </main>

      {/* Popup for calories */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">{t("setCalories")}</h2> {/* Translate the text */}
            <div className="space-y-4">
              <div>
                <label className="text-gray-700 font-medium">{t("minCalories")}</label> {/* Translate the label */}
                <input
                  type="number"
                  value={minCalories}
                  onChange={(e) => setMinCalories(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>
              <div>
                <label className="text-gray-700 font-medium">{t("maxCalories")}</label> {/* Translate the label */}
                <input
                  type="number"
                  value={maxCalories}
                  onChange={(e) => setMaxCalories(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 text-gray-800"
                >
                  {t("cancel")} {/* Translate the text */}
                </button>
                <button
                  onClick={handlePopupConfirm}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                >
                  {t("ok")} {/* Translate the text */}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
