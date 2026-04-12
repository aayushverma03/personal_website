const PRELEGAL_API_PREFIX = "/api/prelegal";

async function request(path, init) {
  const res = await fetch(`${PRELEGAL_API_PREFIX}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {}
    throw new Error(detail);
  }

  if (res.status === 204) return undefined;
  return res.json();
}

export const prelegalApi = {
  me: () => request("/auth/me"),
  signup: (email, password) =>
    request("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () => request("/auth/logout", { method: "POST" }),
  chatState: () => request("/chat/state"),
  chatSend: (content) =>
    request("/chat/message", {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
  chatReset: () => request("/chat/reset", { method: "POST" }),
  listDocuments: () => request("/documents"),
  listDrafts: () => request("/drafts"),
  createDraft: () => request("/drafts", { method: "POST" }),
  activateDraft: (id) => request(`/drafts/${id}/activate`, { method: "POST" }),
  renameDraft: (id, title) =>
    request(`/drafts/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ title }),
    }),
  deleteDraft: (id) => request(`/drafts/${id}`, { method: "DELETE" }),
};
