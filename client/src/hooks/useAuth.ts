"use client";

import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth as useClerkAuth } from "@clerk/nextjs";
import { api } from "@/lib/api";

export function useConnectGithub() {
  const { getToken, isSignedIn, isLoaded } = useClerkAuth();
  const { mutate } = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return api.connectGithub(token);
    },
  });

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    mutate();
  }, [isLoaded, isSignedIn]);
}

export function useCurrentUser() {
  const { getToken, isSignedIn } = useClerkAuth();

  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("No token");
      return api.getUser(token);
    },
    enabled: !!isSignedIn,
  });
}
