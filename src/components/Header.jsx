"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft, CarFront, Heart, Layout } from "lucide-react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
// import { checkUser } from "@/lib/checkUser";

const Header = ({ isAdminPage = false, user }) => {
  // const user = await checkUser();
  const { isSignedIn } = useUser();
  const isAdmin = user?.role === "ADMIN";
  // const isAdmin = false;

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={isAdminPage ? "/admin" : "/"} className="flex">
          <Image
            src={"/logo.png"}
            alt="Vehiql Logo"
            width={200}
            height={60}
            className="h-12 w-auto object-contain"
          />
          {isAdminPage && <span className="text-xs font-extrabold">admin</span>}
        </Link>

        <div className="flex items-center space-x-4">
          {isAdminPage ? (
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft size={18} />
                <span className="hidden md:inline">Back to app</span>
              </Button>
            </Link>
          ) : isSignedIn ? (
            <>
              <Link href="/saved-cars">
                <Button>
                  <CarFront size={18} />
                  <span className="hidden md:inline">Saved Cars</span>
                </Button>
              </Link>

              {!isAdmin ? (
                <Link href="/reservations">
                  <Button variant="outline">
                    <Heart size={18} />
                    <span className="hidden md:inline">My Reservations</span>
                  </Button>
                </Link>
              ) : (
                <Link href="/admin">
                  <Button variant="outline">
                    <Layout size={18} />
                    <span className="hidden md:inline">Admin Portal</span>
                  </Button>
                </Link>
              )}

              {/* ✅ Logout / profile */}
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: {
                      width: "35px",
                      height: "35px",
                    },
                  },
                }}
              />
            </>
          ) : (
            <SignInButton mode="modal">
              <Button variant="outline">Login</Button>
            </SignInButton>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
