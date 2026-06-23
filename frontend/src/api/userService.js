import API from "./axios";

/**
 * User Profile Service
 * Handles profile picture upload, profile updates, and password changes
 */

/**
 * Upload profile picture
 * @param {File} file - Image file to upload
 * @returns {Promise<Object>} Upload result with profile picture URL
 */
export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append("profilePic", file);

    const response = await API.post("/user/upload-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Profile picture uploaded:", response.data.profilePicUrl);

    return {
      success: true,
      message: response.data.message,
      profilePicUrl: response.data.profilePicUrl,
      user: response.data.user,
    };
  } catch (error) {
    console.error("Upload profile picture error:", error);

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to upload profile picture";

    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Get current user profile
 * @returns {Promise<Object>} User profile data
 */
export const getCurrentUserProfile = async () => {
  try {
    const response = await API.get("/user/me");

    return {
      success: true,
      user: response.data,
    };
  } catch (error) {
    console.error("Get profile error:", error);

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch profile";

    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Update user profile information
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} Update result
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await API.put("/user/update-profile", profileData);

    console.log("Profile updated:", response.data.user);

    return {
      success: true,
      message: response.data.message,
      user: response.data.user,
    };
  } catch (error) {
    console.error("Update profile error:", error);

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to update profile";

    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Change user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @param {string} confirmPassword - Confirm new password
 * @returns {Promise<Object>} Change password result
 */
export const changePassword = async (
  currentPassword,
  newPassword,
  confirmPassword
) => {
  try {
    const response = await API.put("/user/change-password", {
      currentPassword,
      newPassword,
      confirmPassword,
    });

    console.log("Password changed successfully");

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Change password error:", error);

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to change password";

    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Delete profile picture
 * @returns {Promise<Object>} Delete result
 */
export const deleteProfilePicture = async () => {
  try {
    const response = await API.delete("/user/delete-profile-pic");

    console.log("Profile picture deleted");

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Delete profile picture error:", error);

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete profile picture";

    return {
      success: false,
      message: errorMessage,
    };
  }
};
