// Same-origin fetch client for api/native-payment-methods (cookie auth works: the host is same-origin).
async function http<T>(method: string, url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    credentials: "same-origin",
    headers: body === undefined ? { Accept: "application/json" } : { Accept: "application/json", "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    let message = text;
    try {
      const json = JSON.parse(text);
      message = typeof json === "string" ? json : (json.message ?? json.title ?? text);
    } catch {
      // not JSON: keep the text
    }
    throw new Error(message || `${res.status} ${res.statusText}`);
  }
  return (text ? JSON.parse(text) : undefined) as T;
}

export interface NativePaymentMethod {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  logoUrl?: string | null;
  isEnabled?: boolean;
}

const URL = "/api/native-payment-methods";
const qs = (params: Record<string, string | string[]>) =>
  Object.entries(params)
    .flatMap(([k, v]) => (Array.isArray(v) ? v : [v]).map((x) => `${k}=${encodeURIComponent(x)}`))
    .join("&");

export const api = {
  // ponytail: the server ignores keywords, so the list loads everything (take 1000) and filters in the browser
  search: (params: Record<string, string | string[]> = {}) =>
    http<{ totalCount?: number; results?: NativePaymentMethod[] }>("GET", `${URL}?${qs({ take: "1000", ...params })}`),
  get: (id: string) => http<NativePaymentMethod>("GET", `${URL}/${encodeURIComponent(id)}`),
  // creates or updates; the server answers an empty 200
  save: (method: NativePaymentMethod) => http<void>("POST", URL, method),
  delete: (ids: string[]) => http<void>("DELETE", `${URL}?${qs({ ids })}`),
};

// uploads one file to the platform assets (POST api/assets?folderUrl=) and returns its public url
export async function uploadAsset(file: File, folderUrl: string) {
  const body = new FormData();
  body.append("file", file, file.name);
  const res = await fetch(`/api/assets?${qs({ folderUrl })}`, { method: "POST", credentials: "same-origin", body });
  if (!res.ok) throw new Error(`${file.name}: ${res.status} ${res.statusText}`);
  const [blob] = (await res.json()) as { url: string }[];
  return blob.url;
}
