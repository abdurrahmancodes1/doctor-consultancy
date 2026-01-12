import { Phone, Video } from "lucide-react";

function toLocalYMD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const minutesToTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")} ${period}`;
};

const convertTo24Hour = (time12h) => {
  //new
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");
  if (hours === "12") hours = "00";
  if (modifier === "PM") hours = String(parseInt(hours, 10) + 12);
  return `${hours.padStart(2, "0")}:${minutes}:00`;
};
const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const consultationTypes = [
  {
    type: "Video Consultation",
    icon: Video,
    description: "Face-to-face consultation via HD video call",
    price: 0,
    recommended: true,
  },
  {
    type: "Voice Call",
    icon: Phone,
    description: "Audio-only consultation via voice call",
    price: -100,
    recommended: false,
  },
];

export {
  toLocalYMD,
  minutesToTime,
  convertTo24Hour,
  consultationTypes,
  startOfDay,
};
