import NavbarUserSection from "./NavbarUserSection";
import NavbarLogo from "./NavbarLogo";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <NavbarLogo />
        <NavbarUserSection />
      </div>
    </nav>
  );
}
