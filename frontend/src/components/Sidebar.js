import { LayoutDashboard, CheckSquare, Target, Heart, CalendarDays, Wallet, BookOpen, Settings } from "lucide-react";
import { assets } from "../assets/assets";
const items = [
  ["Dashboard", LayoutDashboard],
  ["Tasks", CheckSquare],
  ["Goals", Target],
  ["Habits", Heart],
  ["Calendar", CalendarDays],
  ["Finance", Wallet],
  ["Notes", BookOpen],
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="sidebar">
     <div className="brand">
  <img
    src={assets.logo}
    alt="LifeSphere logo"
    width="36"
    height="36"
  />
  <span>LifeSphere</span>
</div>
      <button className="nav-item" onClick={() => onNavigate("Settings")}>
        <Settings size={19} /> Settings
      </button>
    </aside>
  );
}