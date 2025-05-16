import ProfileContent from "@/app/components/ui/ProfileContent";

export default function ProfilePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      <ProfileContent />
    </div>
  );
}
