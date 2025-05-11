import { Avatar } from "@heroui/react"; // or any other avatar lib you use

function UserTopNav() {
  return (
    <div className="h-14 w-full bg-white shadow flex items-center justify-between px-4">
      <h1 className="text-xl font-bold text-gray-800">MenuGenie</h1>

      {/* Right Side Avatar */}
      <div className="flex items-center space-x-4">
        <Avatar
          size="sm"
          name="User"
          src="https://api.dicebear.com/7.x/lorelei/svg?seed=User"
        />
      </div>
    </div>
  );
}

export default UserTopNav;
