import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import React from "react";

function Header() {
  return (
    <div>
      <Show when="signed-out">
        <SignInButton />
        <SignUpButton>
          <button className="bg-purple-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
            Sign Up
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  );
}

export default Header;
