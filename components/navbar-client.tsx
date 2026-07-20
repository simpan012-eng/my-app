"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LogoutButton } from "./logout-button";

const links = [
  { name: "Start", href: "/" },
  { name: "KrökenKrew", href: "/krokenkrew" },
  { name: "Contact", href: "/contact" },
  { name: "Hall of Fame", href: "/hall-of-fame" },
  { name: "Schedule", href: "/schedule" },
];

export function NavbarClient({
  isLoggedIn,
  isAdmin,
}: {
  isLoggedIn: boolean;
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-800 bg-gray-900/70 text-neutral-300 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Hamburger, bara synlig på mobil */}
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Stäng meny" : "Öppna meny"}
          className="text-neutral-300 hover:text-white md:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>

        {/* Länkar, bara synliga från md och uppåt */}
        <div className="hidden gap-6 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-white">
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" className="text-neutral-300 hover:text-white">
              Admin
            </Link>
          )}
        </div>

        {/* Login/Logout, alltid synlig oavsett skärmstorlek */}
        <div>
          {isLoggedIn ? (
            <LogoutButton />
          ) : (
            <Link href="/login" className="font-semibold">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobilmeny, dyker upp under headern när hamburgaren klickas */}
      {open && (
        <div className="flex flex-col gap-4 border-t border-gray-800 bg-gray-900 px-6 py-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="hover:text-white"
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="hover:text-white"
            >
              Admin
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}