"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "next-themes";
import { createClient } from "@/utils/supabase/client"; // Import Supabase client

function NavHeader() {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<string | null>(null); // Track the logged-in user
  const [activeSection, setActiveSection] = useState<string | null>(null); // Track the active section
  const supabase = createClient(); // Initialize Supabase client

  // Fetch the user's authentication status
  useEffect(() => {
    setMounted(true);

    // Check if a user is logged in
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user.email || user.user_metadata?.name || "User"); // Set the user's name or email
      }
    };

    fetchUser();

    // Listen for auth state changes (e.g., user logs in or out)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user.email || session.user.user_metadata?.name || "User");
        } else {
          setUser(null); // Clear the user if they log out
        }
      }
    );

    // Cleanup the listener
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // Track the active section using IntersectionObserver
  useEffect(() => {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 } // Adjust the threshold as needed
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const { theme } = useTheme();

  // Handle Sign Out
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      setUser(null); // Clear the user state
      window.location.href = "/"; // Redirect to the home page after sign-out
    }
  };

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
          <Tab setPosition={setPosition} isActive={activeSection === "hero"}>
            <Link href="/#hero">Home</Link> {/* Link to the Hero section */}
          </Tab>
          <Tab setPosition={setPosition} isActive={activeSection === "features"}>
            <Link href="/#features">Features</Link> {/* Link to the Features section */}
          </Tab>
          {/* <Tab setPosition={setPosition} isActive={activeSection === "demo"}> */}
            {/* <Link href="/#demo">Demo</Link> Link to the Demo section */}
          {/* </Tab> */}
          <Tab setPosition={setPosition} isActive={activeSection === "pricing"}>
            <Link href="/#pricing">Pricing</Link> {/* Link to the Pricing section */}
          </Tab>
          <Tab setPosition={setPosition} isActive={activeSection === "faq"}>
            <Link href="/#faq">FAQ</Link> {/* Link to the FAQ section */}
          </Tab>

          <Cursor position={position} />
        </ul>

        {/* User Name or Sign-In/Sign-Up Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            // Display the user's name and Sign Out button if logged in
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Welcome, {user}
              </span>
              <button
                onClick={handleSignOut}
                className={`text-sm font-medium ${
                  theme === "light"
                    ? "text-white bg-black hover:bg-gray-900"
                    : "text-black bg-white hover:bg-gray-100"
                } border-0 rounded-md py-2 px-4 transition-colors`}
              >
                Sign Out
              </button>
            </div>
          ) : (
            // Display Sign In and Sign Up buttons if not logged in
            <>
              <Link href="/sign-in">
                <button
                  className={`text-sm font-medium ${
                    theme === "light"
                      ? "text-white bg-black hover:bg-gray-900"
                      : "text-black bg-white hover:bg-gray-100"
                  } border-0 rounded-md py-2 px-4 transition-colors`}
                >
                  Sign In
                </button>
              </Link>

              <Link href="/sign-up">
                <button
                  className={`text-sm font-medium ${
                    theme === "light"
                      ? "text-black bg-white border-2 border-black hover:bg-gray-100"
                      : "text-white bg-black border-2 border-white hover:bg-gray-700"
                  } rounded-md py-2 px-4 transition-colors`}
                >
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const Tab = ({
  children,
  setPosition,
  isActive,
}: {
  children: React.ReactNode;
  setPosition: any;
  isActive?: boolean;
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
      className={`relative z-10 block cursor-pointer px-4 py-2 text-xs uppercase transition-all duration-150 ease-in-out ${
        isLightMode
          ? "text-gray-900 hover:text-white hover:bg-transparent"
          : "text-white hover:text-black hover:bg-transparent"
      } }`}
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