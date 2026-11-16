import { NavLink } from "react-router-dom";
import { Icon, type IconName } from "../components/Icon";

interface TabItem {
  to: string;
  label: string;
  icon: IconName;
}

const tabs: TabItem[] = [
  { to: "/", label: "الاستماع", icon: "headphones" },
  { to: "/text", label: "نص الرقية", icon: "book" },
  { to: "/duas", label: "الأدعية", icon: "sparkles" },
  { to: "/about", label: "عن التطبيق", icon: "info" },
];

export function BottomNav() {
  return (
    <nav className="tabbar" aria-label="التنقل الرئيسي">
      <div className="tabbar__inner">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === "/"}
            className={({ isActive }) => `tab ${isActive ? "is-active" : ""}`}
          >
            <span className="tab__icon">
              <Icon name={tab.icon} size={22} />
            </span>
            <span className="tab__label">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
