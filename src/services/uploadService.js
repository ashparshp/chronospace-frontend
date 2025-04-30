import api from "./api";

export const uploadService = {
  getUploadUrl: async (contentType = "image/jpeg") => {
    return api.get(`/uploads/get-upload-url?contentType=${contentType}`);
  },

  deleteFile: async (fileUrl) => {
    return api.post("/uploads/delete-file", { fileUrl });
  },

  uploadToS3: async (file, contentType = "image/jpeg") => {
    try {
      const response = await uploadService.getUploadUrl(contentType);
      const { uploadURL, fileUrl } = response.data;

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

export const createImageUploadHandler = () => {
  return {
    uploadByFile: async (file) => {
      try {
        const contentType = file.type;

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
