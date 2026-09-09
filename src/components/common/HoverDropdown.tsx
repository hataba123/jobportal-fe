"use client";

import { Menu, Transition } from "@headlessui/react";
import { ChevronDown, Briefcase } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Fragment, useState, useRef } from "react";

type MenuItem = {
  label: string;
  href: string;
};

type Props = {
  label: string;
  items: MenuItem[];
  mainHref: string;
};

export default function HoverDropdown({ label, items, mainHref }: Props) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 150);
  };

  return (
    <Menu
      as="div"
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="inline-flex items-center">
        <Link
          href={mainHref}
          className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors py-2"
        >
          {label}
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${open ? "rotate-180 text-blue-600" : ""}`} />
        </Link>
      </div>

      <Transition
        as={Fragment}
        show={open}
        enter="transition ease-out duration-150"
        enterFrom="transform opacity-0 -translate-y-1 scale-95"
        enterTo="transform opacity-100 translate-y-0 scale-100"
        leave="transition ease-in duration-100"
        leaveFrom="transform opacity-100 translate-y-0 scale-100"
        leaveTo="transform opacity-0 -translate-y-1 scale-95"
      >
        <Menu.Items
          static
          className="absolute left-0 mt-1 w-56 origin-top-left bg-white border border-slate-200/80 rounded-2xl shadow-xl z-50 text-slate-700 p-1.5 focus:outline-none"
        >
          <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Khám phá theo ngành
          </div>
          <div className="max-h-64 overflow-y-auto space-y-0.5">
            {items.map((item) => (
              <Menu.Item key={item.href}>
                {({ active }) => (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 text-sm rounded-xl transition-colors ${
                      active ? "bg-blue-50 text-blue-600 font-medium" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
