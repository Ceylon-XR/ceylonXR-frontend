import React from "react";

const UserAvatar = ({ user }) => {
  // If user has a profile picture, display it
  if (user.profilePicture) {
    return (
      <img
        src={user.profilePicture}
        alt={`${user.username}'s profile`}
        className="w-10 h-10 rounded-full object-cover border-2 border-indigo-300"
      />
    );
  }

  // Otherwise, display the first letter of their name
  const firstLetter = user.username
    ? user.username.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
      {firstLetter}
    </div>
  );
};

export default UserAvatar;
