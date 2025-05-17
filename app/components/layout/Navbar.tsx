import NavbarUserSection from "./NavbarUserSection";
import NavbarLogo from "./NavbarLogo";

export default function Navbar() {
  return (
    <div className="navbar fixed top-0 left-0 right-0 bg-neutral text-neutral-content shadow-lg z-50">
      <div className="container mx-auto">
        <div className="navbar-start">
          <NavbarLogo />
        </div>
        <div className="navbar-end">
          <NavbarUserSection />
        </div>
      </div>
    </div>
  );
}
