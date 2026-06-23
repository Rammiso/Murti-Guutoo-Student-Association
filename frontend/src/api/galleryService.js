import axiosInstance from "./axiosInstance";

export const fetchGallery = async () => {
  const response = await axiosInstance.get("/gallery");
  return response.data;
};

export const uploadGalleryItem = async (formData) => {
  const response = await axiosInstance.post("/gallery/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteGalleryItem = async (id) => {
  const response = await axiosInstance.delete(`/gallery/${id}`);
  return response.data;
};
