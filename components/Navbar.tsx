import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import ModeToggle from "./ModeToggle";
import { HomeIcon, GamepadIcon, BrainCircuitIcon } from "lucide-react";

function Navbar() {
  return (
    <nav
      className="sticky top-0 w-full border-b bg-background/95 backdrop-blur 
    supports-[backdrop-filter]:bg-background/60 z-50"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16 justify-between">
          {/* logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity"
            >
              <BrainCircuitIcon className="h-6 w-6" />
              <span className="hidden lg:inline">Cards</span>
            </Link>
          </div>
          {/* nav items */}{" "}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-muted"
              asChild
            >
              <Link href="/game">
                <GamepadIcon className="h-5 w-5" />
                <span className="hidden lg:inline">Game</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="flex items-center gap-2 hover:bg-muted"
              asChild
            >
              <Link href="/">
                <HomeIcon className="h-5 w-5" />
                <span className="hidden lg:inline">Home</span>
              </Link>
            </Button>

            <div className="ml-2">
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
