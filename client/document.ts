import api from "./api";

export const getDocuments = async (
  page = 1,
  limit = 10,
  search = "",
  category = ""
) => {
  const response = await api.get("/documents", {
    params: {
      page,
      limit,
      search,
      category
    },
  });

  return response.data;
};

export const getDocument = async (id: number) => {
  const response = await api.get(`/documents/${id}`);
  return response.data;
};

export const renameDocument = async (
  id: number,
  title: string
) => {
  const { data } = await api.put(`/documents/${id}`, {
    title,
  });

  return data;
};

export const deleteDocument = async (id: number) => {
  const { data } = await api.delete(`/documents/${id}`);
  return data;
};

export const uploadDocument = async (
  formData: FormData
) => {
  const { data } = await api.post(
    "/documents/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};