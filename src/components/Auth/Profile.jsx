import { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";
import NavBar from "../UI/Navbar";
import Footer from "../UI/Footer";
import UserAvatar from "./UserAvatar";
import { updateProfile, logoutUser } from "../../api/auth";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.fullName || user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Format base64 profile picture for preview
  const formatProfilePicture = (picture) => {
    if (!picture) return "";
    if (picture.startsWith("data:")) {
      return picture;
    }
    // Check if it's likely a base64 string (contains only valid base64 characters)
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    if (base64Regex.test(picture)) {
      return `data:image/jpeg;base64,${picture}`;
    }
    return picture;
  };

  // Update useEffect to handle base64 profile picture
  useEffect(() => {
    if (user?.profilePicture) {
      setPreviewUrl(formatProfilePicture(user.profilePicture));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      // Prepare user data for update
      const userData = {
        fullName: name,
        email,
        profileImage,
      };

      // Call the API to update profile
      const response = await updateProfile(userData);

      // Update local user data with proper base64 formatting
      const updatedUser = {
        ...user,
        fullName: name,
        name, // Keep for backward compatibility
        email,
        profilePicture: response.profilePicture
          ? formatProfilePicture(response.profilePicture)
          : previewUrl,
      };

      // Update context and localStorage
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.toString());
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error("Error logging out:", err);
      // Still remove user from context even if API call fails
      setUser(null);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col ">
      <NavBar />
      <div className="flex-grow flex justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md mt-20 mb-20">
          <div className="flex flex-col items-center">
            <div className="mb-4 relative">
              <div
                onClick={triggerFileInput}
                className="cursor-pointer relative group"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile preview"
                    className="h-20 w-20 rounded-full object-cover border-2 border-indigo-600"
                  />
                ) : (
                  <UserAvatar user={user} size="large" />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white text-xs">Change</span>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
                {user.username}
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Your Profile
            </h2>
            {message && (
              <p className="mt-2 text-center text-green-600">{message}</p>
            )}
            {error && <p className="mt-2 text-center text-red-600">{error}</p>}

            {/* Token Display Card */}
            <div className="mt-4 w-full bg-blue-50 rounded-lg p-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-indigo-700">
                  Your Balance
                </h3>
                <p className="text-gray-600">Available tokens to use</p>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <span className="text-2xl font-bold text-indigo-600">
                  {user.tokens || 0}
                </span>
                <span className="ml-1 text-gray-500">Tokens</span>
              </div>
            </div>

            {/* Account Information */}
            <div className="mt-4 w-full">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Member since</span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Last login</span>
                <span className="font-medium">
                  {new Date(user.lastLoginAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className={`flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Logging out..." : "Log Out"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
