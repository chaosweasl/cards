import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import ModeToggle from "./ModeToggle";

function Navbar() {
  return (
    <nav
      className="sticky top-0 w-full border-b bg-background/95 backdrop-blur 
    supports-[backdrop-filter]:bg-background/60 z-50"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex item-center h-16 justify-between">
          {/* logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold">
              {/* logo icon */}
              <span className="hidden lg:inline">Logo</span>
            </Link>
          </div>

          {/* nav items */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="flex items-center gap-2" asChild>
              <Link href="/game">
                {/*game icon*/}
                <span className="hidden lg:inline">Game</span>
              </Link>
            </Button>

            <Button variant="ghost" className="flex items-center gap-2" asChild>
              <Link href="/">
                {/*home icon*/}
                <span className="hidden lg:inline">Home</span>
              </Link>
            </Button>

            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
