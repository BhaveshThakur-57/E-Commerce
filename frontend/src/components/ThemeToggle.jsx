import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative w-14 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 transition-colors duration-300 flex items-center px-1"
    >
      <span
        className={`absolute w-5 h-5 rounded-full bg-white dark:bg-zinc-900 shadow-md flex items-center justify-center transition-transform duration-300 ${
          theme === "dark" ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {theme === "dark" ? (
          <Moon size={11} className="text-brand-400" />
        ) : (
          <Sun size={11} className="text-amber-500" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;