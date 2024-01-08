"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggler from "./ThemeToggler";
import Preloader from "@/components/ui/preloader";

const Header = ({ showPreloader }: { showPreloader: () => void }) => {
  // Navbar toggle
  const [navbarOpen, setNavbarOpen] = useState(false);
  const navbarToggleHandler = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Sticky Navbar
  const [sticky, setSticky] = useState(false);
  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleStickyNavbar);
  });

  return (
    <>
      <header
        className={`header left-0 top-0 z-40 flex w-full items-center bg-transparent ${
          sticky
            ? "!fixed !z-[9999] !bg-white !bg-opacity-80 shadow-sticky backdrop-blur-sm !transition dark:!bg-purple dark:!bg-opacity-20"
            : "absolute"
        }`}
      >
        <div className="container">
          <div className="relative -mx-4 flex items-center justify-between">
            <div className="w-60 max-w-full px-4 xl:mr-12">
              <Link
                href="/home"
                className={`header-logo flex w-full flex-row items-center ${
                  sticky ? "py-5 lg:py-2" : "py-8"
                } `}
              >
                <Image
                  src="/web_avatar.png"
                  alt="logo"
                  width={100}
                  height={100}
                  className="h-[65px] w-[100px]"
                />
                <span className="text-4xl font-bold">Store</span>
              </Link>
            </div>
            <div className="w-full flex-1 items-center justify-between px-4">
              <div className="flex items-center justify-end pr-16 lg:pr-0">
                <Link
                  href="/login"
                  className="hidden px-7 py-3 text-base font-bold text-dark hover:opacity-70 dark:text-white md:block"
                  onClick={showPreloader}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="ease-in-up hidden rounded-md bg-purple px-8 py-3 text-base font-bold text-white transition duration-300 hover:bg-opacity-90 hover:shadow-signUp md:block md:px-9 lg:px-6 xl:px-9"
                  onClick={showPreloader}
                >
                  Sign Up
                </Link>
                <div>
                  <ThemeToggler />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
