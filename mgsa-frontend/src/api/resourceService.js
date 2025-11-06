import API from "./axios";

/**
 * Resource Service
 * Handles file uploads and resource fetching operations
 * Integrated with real backend API endpoints
 */

/**
 * Upload a new resource file
 * @param {FormData} formData - Form data containing file and metadata
 * @param {File} formData.file - The file to upload
 * @param {string} formData.title - Resource title
 * @param {string} formData.course - Course name
 * @param {string} formData.department - Department name
 * @param {string} formData.description - Resource description
 * @returns {Promise<Object>} Upload result with resource data
 */
export const uploadResource = async (formData, onUploadProgress) => {
  try {
    // Call real backend API with upload progress tracking
    const response = await API.post("/resources/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        }
      },
    });

    // Backend returns: { message: "File uploaded successfully", file: {...} }
    const { file } = response.data;

    // Map backend response to expected format
    const resource = {
      id: file._id,
      title: formData.get("title") || file.originalName,
      course: formData.get("course") || "General",
      department: formData.get("department") || "N/A",
      description: file.description || formData.get("description") || "",
      fileName: file.filename,
      fileSize: formData.get("file")?.size || 0,
      fileType: file.fileType,
      uploadedBy: file.uploadedBy,
      uploadedAt: file.createdAt,
      approved: file.approved,
    };

    console.log("Upload successful:", resource);

    return {
      success: true,
      message: "File uploaded successfully",
      resource: resource,
    };
  } catch (error) {
    console.error("Upload error:", error);
    
    // Extract error message from backend response
    const errorMessage = error.response?.data?.message || error.message || "Upload failed. Please try again.";
    
    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Fetch all available resources
 * @param {Object} filters - Optional filters for resources
 * @param {string} filters.course - Filter by course
 * @param {string} filters.department - Filter by department
 * @param {string} filters.search - Search query
 * @returns {Promise<Object>} Resources list
 */
export const getResources = async (filters = {}) => {
  try {
    // Call real backend API
    const response = await API.get("/resources", { params: filters });

    // Backend returns array of files
    const files = response.data;

    // Map backend format to expected format
    const resources = files.map((file) => ({
      id: file._id,
      title: file.originalName?.replace(/\.[^.]+$/, "") || "Untitled",
      course: file.course || "General",
      department: file.department || "N/A",
      fileName: file.filename,
      fileSize: file.fileSize || 0,
      fileType: file.fileType,
      description: file.description || "",
      uploadedBy: file.uploadedBy,
      uploadedAt: file.createdAt,
      approved: file.approved,
    }));

    console.log("Resources fetched:", resources.length);

    return {
      success: true,
      resources: resources,
      total: resources.length,
    };
  } catch (error) {
    console.error("Fetch resources error:", error);
    
    const errorMessage = error.response?.data?.message || error.message || "Failed to fetch resources";
    
    return {
      success: false,
      message: errorMessage,
      resources: [],
    };
  }
};

/**
 * Get a single resource by ID
 * @param {number} id - Resource ID
 * @returns {Promise<Object>} Resource data
 */
export const getResourceById = async (id) => {
  try {
    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // TODO: Replace with real API call when backend is ready
    // const response = await api.get(`/resources/${id}`);
    // return { success: true, resource: response.data };

    // Mock: Get all resources and find by ID
    const result = await getResources();
    const resource = result.resources.find((r) => r.id === parseInt(id));

    if (resource) {
      return {
        success: true,
        resource: resource,
      };
    } else {
      return {
        success: false,
        message: "Resource not found",
      };
    }
  } catch (error) {
    console.error("Get resource error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch resource",
    };
  }
};

/**
 * Download a resource file
 * Supports both Cloudinary redirects and local file streaming
 * @param {string} id - Resource ID
 * @param {string} filename - Original filename for download
 * @returns {Promise<Object>} Download result
 */
export const downloadResource = async (id, filename = "download") => {
  try {
    console.log(`📥 Initiating download for resource ID: ${id}`);

    // Get download URL from backend (returns JSON with downloadUrl)
    const response = await API.get(`/resources/download/${id}`);

    // Backend returns JSON with downloadUrl (Cloudinary URL)
    if (response.data && response.data.success && response.data.downloadUrl) {
      const { downloadUrl, filename: serverFilename, fileType, mimeType } = response.data;
      
      console.log(`☁️ Cloudinary URL received: ${downloadUrl}`);
      console.log(`📄 Filename: ${serverFilename}`);
      console.log(`📋 Type: ${fileType} (${mimeType})`);

      // Fetch the file from Cloudinary
      const fileResponse = await fetch(downloadUrl);
      
      if (!fileResponse.ok) {
        throw new Error(`Failed to fetch file from Cloudinary: ${fileResponse.status}`);
      }

      // Get the blob
      const blob = await fileResponse.blob();
      
      console.log(`📦 File fetched, size: ${(blob.size / 1024).toFixed(2)} KB`);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", serverFilename || filename);
      link.style.display = "none";
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);

      console.log(`✅ Download started: ${serverFilename}`);

      return {
        success: true,
        message: "Download started",
        filename: serverFilename,
      };
    }

    // If response doesn't match expected format
    throw new Error("Invalid response format from server");

  } catch (error) {
    console.error("❌ Download error:", error);
    
    // Handle specific error cases
    let errorMessage = "Download failed. Please try again.";
    
    if (error.response) {
      // Backend returned an error response
      if (error.response.status === 404) {
        errorMessage = "File not found";
      } else if (error.response.status === 401) {
        errorMessage = "Please login to download files";
      } else if (error.response.status === 403) {
        errorMessage = "You don't have permission to download this file";
      } else if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error.request) {
      // Request was made but no response received
      errorMessage = "Network error. Please check your connection.";
    } else {
      // Something else happened
      errorMessage = error.message || errorMessage;
    }
    
    console.error(`❌ Download failed: ${errorMessage}`);
    
    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Delete a resource
 * @param {number} id - Resource ID
 * @returns {Promise<Object>} Delete result
 */
export const deleteResource = async (id) => {
  try {
    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // TODO: Replace with real API call when backend is ready
    // const response = await api.delete(`/resources/${id}`);
    // return { success: true, message: response.data.message };

    // Mock delete
    console.log(`Mock delete successful for resource ID: ${id}`);

    return {
      success: true,
      message: "Resource deleted successfully (mock)",
    };
  } catch (error) {
    console.error("Delete error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete resource",
    };
  }
};

/**
 * Update resource metadata
 * @param {number} id - Resource ID
 * @param {Object} updates - Updated fields
 * @returns {Promise<Object>} Update result
 */
export const updateResource = async (id, updates) => {
  try {
    // Mock delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // TODO: Replace with real API call when backend is ready
    // const response = await api.put(`/resources/${id}`, updates);
    // return { success: true, resource: response.data };

    // Mock update
    const mockUpdatedResource = {
      id: id,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    console.log("Mock update successful:", mockUpdatedResource);

    return {
      success: true,
      message: "Resource updated successfully (mock)",
      resource: mockUpdatedResource,
    };
  } catch (error) {
    console.error("Update error:", error);
    return {
      success: false,
      message: error.message || "Failed to update resource",
    };
  }
};
