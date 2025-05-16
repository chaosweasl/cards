import NavbarUserSection from "./NavbarUserSection";
import NavbarLogo from "./NavbarLogo";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-800 p-4 shadow-md z-50 w-full">
      <div className="container mx-auto flex justify-between items-center px-4">
        <NavbarLogo />
        <NavbarUserSection />
      </div>
    </nav>
  );
}
