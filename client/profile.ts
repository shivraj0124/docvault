import api from "./api";

export const getProfile = async () => {
  const { data } = await api.get("/profile");
  return data;
};

export const updateProfile = async (name: string) => {
  const { data } = await api.put("/profile", {
    name,
  });

  return data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const { data } = await api.put("/profile/password", {
    currentPassword,
    newPassword,
  });

  return data;
};

export const logout = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};