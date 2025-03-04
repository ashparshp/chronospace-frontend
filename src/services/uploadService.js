// src/services/uploadService.js
import api from "./api";

export const uploadService = {
  // Get a signed upload URL for S3
  getUploadUrl: async (contentType = "image/jpeg") => {
    return api.get(`/uploads/get-upload-url?contentType=${contentType}`);
  },

  // Delete a file from S3
  deleteFile: async (fileUrl) => {
    return api.post("/uploads/delete-file", { fileUrl });
  },

  // Upload a file to S3 using the provided URL
  uploadToS3: async (file, contentType = "image/jpeg") => {
    try {
      // Get a signed URL
      const response = await uploadService.getUploadUrl(contentType);
      const { uploadURL, fileUrl } = response.data;

      // Upload file directly to S3
      await fetch(uploadURL, {
        method: "PUT",
        headers: {
          "Content-Type": contentType,
        },
        body: file,
      });

      return { success: true, fileUrl };
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },
};

// Create a custom image upload handler for Editor.js
export const createImageUploadHandler = () => {
  return {
    uploadByFile: async (file) => {
      try {
        // Get file type
        const contentType = file.type;

        // Upload file
        const { fileUrl } = await uploadService.uploadToS3(file, contentType);

        return {
          success: 1,
          file: {
            url: fileUrl,
          },
        };
      } catch (error) {
        console.error("Error uploading image:", error);
        return {
          success: 0,
          file: {
            url: null,
          },
        };
      }
    },
  };
};
