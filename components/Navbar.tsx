"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "next-themes";
function NavHeader() {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const [mounted, setMounted] = useState(false);

  // Ensures the component only renders on the client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Ensure useTheme is called before conditional render
  const { theme } = useTheme();

  // Prevent rendering on SSR
  if (!mounted) return null;

  return (
    <nav className="sticky top-0 w-full bg-transparent dark:bg-transparent backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
        {/* Logo and branding */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-semibold text-xl text-gray-900 dark:text-white"
          >
            WeeSee
          </Link>
        </div>

        {/* Nav Items with Border */}
        <ul
          className="relative mx-auto flex w-fit rounded-full border-2 border-gray-300 dark:border-gray-600 bg-transparent p-1 transition-all"
          onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))} // Reset position when mouse leaves
        >
          <Tab setPosition={setPosition}>Home</Tab>
          <Tab setPosition={setPosition}>Pricing</Tab>
          <Tab setPosition={setPosition}>About</Tab>
          <Tab setPosition={setPosition}>Services</Tab>
          <Tab setPosition={setPosition}>Contact</Tab>

          <Cursor position={position} />
        </ul>

        {/* Sign-In and Sign-Up Buttons */}
        <div className="flex items-center gap-4">
          {/* Sign In Button */}

          {/* Sign In Button */}
          <Link href="/sign-in">
            <button
              className={`text-sm font-medium 
      ${theme === "light" ? "text-white bg-black hover:bg-gray-900" : "text-black bg-white hover:bg-gray-100"} 
      border-0 rounded-md py-2 px-4 transition-colors`}
            >
              Sign In
            </button>
          </Link>

          {/* Sign Up Button */}
          <Link href="/sign-up">
            <button
              className={`text-sm font-medium 
      ${theme === "light" ? "text-black bg-white border-2 border-black hover:bg-gray-100" : "text-white bg-black border-2 border-white hover:bg-gray-700"} 
      rounded-md py-2 px-4 transition-colors`}
            >
              Sign Up
            </button>
          </Link>
        </div>
        
      </div>
    </nav>
  );
}

const Tab = ({
  children,
  setPosition,
}: {
  children: React.ReactNode;
  setPosition: any;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  const { theme } = useTheme();
  const isLightMode = theme === "light";

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      className={`relative z-10 block cursor-pointer px-4 py-2 text-xs uppercase transition-all duration-150 ease-in-out 
        ${
          isLightMode
            ? "text-gray-900 hover:text-white hover:bg-transparent"
            : "text-white hover:text-black hover:bg-transparent"
        }`}
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }: { position: any }) => {
  return (
    <motion.li
      animate={position}
      className="absolute z-0 h-7 rounded-full bg-black dark:bg-white md:h-8"
    />
  );
};

export default NavHeader;
