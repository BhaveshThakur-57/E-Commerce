import { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "../services/api";

const AnnouncementBar = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const { data } = await api.get("/settings/announcement");
        if (data && data.enabled) {
          setAnnouncement(data);
        }
      } catch {
        // silently fail
      }
    };
    fetchAnnouncement();
  }, []);

  if (!announcement || dismissed) return null;

  return (
    <div
      className="fixed top-0 left-0 w-full z-[60] text-center py-2 px-4 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300"
      style={{ backgroundColor: announcement.bgColor, color: announcement.textColor }}
    >
      <span>{announcement.text}</span>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
        style={{ color: announcement.textColor }}
      >
        <X size={14} />
      </button>
    </div>
  );
};

export default AnnouncementBar;
