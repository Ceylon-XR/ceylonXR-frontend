import React from "react";

const UserAvatar = ({ user, size = "small" }) => {
  const getSizeClasses = () => {
    switch (size) {
      case "large":
        return "h-20 w-20";
      case "medium":
        return "h-12 w-12";
      case "small":
      default:
        return "h-8 w-8";
    }
  };

  const getInitials = () => {
    if (!user) return "?";

    // Try to get initials from fullName or name
    const name = user.fullName || user.name || user.username || "";
    if (name) {
      return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }

    // Fallback to username if name not available
    return user.username ? user.username[0].toUpperCase() : "?";
  };

  // Check if user has a profile picture (base64 string or URL)
  const hasProfilePicture = user && user.profilePicture;

  // Properly format the profile picture source
  // If the profilePicture starts with 'data:' it's already a valid base64 data URL
  // If it doesn't, we need to check if it's a base64 string without the prefix
  const getProfilePictureSrc = () => {
    if (!user || !user.profilePicture) return null;

    if (user.profilePicture.startsWith("data:")) {
      return user.profilePicture;
    } else {
      // Check if it's likely a base64 string (contains only valid base64 characters)
      const base64Regex = /^[A-Za-z0-9+/=]+$/;
      if (base64Regex.test(user.profilePicture)) {
        return `data:image/jpeg;base64,${user.profilePicture}`;
      }
      // Otherwise, assume it's a URL
      return user.profilePicture;
    }
  };

  return (
    <div
      className={`relative ${getSizeClasses()} rounded-full overflow-hidden bg-indigo-100`}
    >
      {hasProfilePicture ? (
        <img
          src={getProfilePictureSrc()}
          alt={`${user.username || "User"}'s avatar`}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full text-indigo-600 font-medium">
          {getInitials()}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
