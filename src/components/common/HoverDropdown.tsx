// 📁 components/HoverDropdown.tsx
"use client";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
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
    }, 200);
  };

  return (
    <Menu
      as="div"
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="inline-flex items-center hover:text-blue-200 cursor-pointer">
        <Link href={mainHref} className="flex items-center">
          {label}
          <ChevronDownIcon className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <Transition
        as={Fragment}
        show={open}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          static
          className="absolute right-0 mt-2 w-40 origin-top-right bg-white border rounded shadow-lg z-50 text-black"
        >
          {items.map((item) => (
            <Menu.Item key={item.href}>
              {({ active }) => (
                <Link
                  href={item.href}
                  className={`block px-4 py-2 ${active ? "bg-gray-100" : ""}`}
                >
                  {item.label}
                </Link>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
