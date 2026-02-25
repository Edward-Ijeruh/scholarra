import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  Home,
  GraduationCap,
  FileText,
  Bookmark,
  Settings,
  User,
  LogOut,
  LucideIcon,
} from "lucide-react";

export default function Sidebar({
  isOpen,
  onClose,
  onLogout,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}) {
  const links = [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    {
      label: "Scholarships",
      icon: GraduationCap,
      href: "/scholarships",
    },
    { label: "Applications", icon: FileText, href: "/applications" },
    { label: "Saved", icon: Bookmark, href: "/saved" },
  ];

  const settings = [
    { label: "Profile", icon: User, href: "/profile" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <>
      <aside
        className={`fixed left-0 z-30 bg-white w-[280px] h-[calc(100vh-70px)] top-[70px] border-r border-[#e6e2f0] overflow-y-auto transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <nav className="py-6 px-4">
          <Section title="GENERAL">
            {links.map(({ label, icon: Icon, href }) => (
              <NavLink
                key={label}
                href={href}
                icon={Icon}
                label={label}
                onClick={onClose}
              />
            ))}
          </Section>

          <Section title="ACCOUNT">
            {settings.map(({ label, icon: Icon, href }) => (
              <NavLink
                key={label}
                href={href}
                icon={Icon}
                label={label}
                onClick={onClose}
              />
            ))}
          </Section>

          <hr className="my-4 mx-6 border-[#e6e2f0]" />

          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-6 py-3 w-full text-sm text-red-500 hover:bg-red-50 cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </button>

          <p className="px-6 pt-6 text-xs text-gray-400">v1.0.0</p>
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <p className="px-6 mb-2 text-xs font-medium text-gray-400 uppercase">
        {title}
      </p>
      {children}
    </div>
  );
}

function NavLink({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "flex items-center gap-3 px-6 py-3 mb-1 text-sm transition-colors rounded-xl",
        isActive
          ? "bg-[#f4f0fb] text-[#8f6cd0] font-medium"
          : "text-gray-500 hover:bg-[#f4f0fb]",
      )}
    >
      <Icon
        size={18}
        className={isActive ? "text-[#8f6cd0]" : "text-gray-400"}
      />
      {label}
    </Link>
  );
}
