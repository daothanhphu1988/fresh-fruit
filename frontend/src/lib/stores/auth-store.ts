"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, ApiError } from "@/lib/api/client";
import type { ApiAuthResponse } from "@/lib/api/types";

export interface AuthUser {
  fullName: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  register: (input: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      register: async ({ fullName, email, phone, password }) => {
        try {
          const res = await api.post<ApiAuthResponse>("/api/auth/register", {
            fullName,
            email,
            phone,
            password,
          });
          set({ token: res.token, user: { fullName: res.fullName, email: res.email, role: res.role } });
          return { ok: true };
        } catch (e) {
          return { ok: false, error: e instanceof ApiError ? e.message : "Đăng ký thất bại." };
        }
      },
      login: async (email, password) => {
        try {
          const res = await api.post<ApiAuthResponse>("/api/auth/login", { email, password });
          set({ token: res.token, user: { fullName: res.fullName, email: res.email, role: res.role } });
          return { ok: true };
        } catch (e) {
          return { ok: false, error: e instanceof ApiError ? e.message : "Đăng nhập thất bại." };
        }
      },
      logout: () => set({ token: null, user: null }),
    }),
    { name: "fresh-fruit-auth" }
  )
);
