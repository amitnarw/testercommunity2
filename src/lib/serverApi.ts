import API_ROUTES from "./apiRoutes";
import { decryptData } from "./encryptDecryptPayload";
import type { Faq } from "./types";

async function serverFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Server fetch failed: ${res.statusText}`);
  }
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message ?? "Server fetch failed");
  }
  const decrypted = json?.data ? await decryptData<any>(json.data as string) : null;
  return decrypted as T;
}

export async function serverGetPublicFaqs(
  category?: string,
): Promise<Faq[]> {
  const params = category ? `?category=${category}` : "";
  return serverFetch<Faq[]>(`${API_ROUTES.FAQ}/faqs${params}`);
}
