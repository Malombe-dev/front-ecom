"use client";
import { useState } from "react";
import Image from "next/image";

// Uploads image files to our own backend (POST /api/upload), which stores them on
// disk under backend/uploads and serves them back at /uploads/<filename>. The
// backend route is admin-only, so it needs the same bearer token as other admin calls.
export default function ImageUploader({ images, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Upload failed");

      onChange([...images, ...data.urls]);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = ""; // allow re-selecting the same file later
    }
  }

  function removeImage(url) {
    onChange(images.filter((img) => img !== url));
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-ink-900">Product images</label>

      {images.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-3">
          {images.map((url) => (
            <div key={url} className="relative h-20 w-20 overflow-hidden rounded-card border border-ink-300/30">
              <Image src={url} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-bl bg-danger-600 text-xs text-white"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="inline-flex cursor-pointer items-center gap-2 rounded-card border border-dashed border-brand-900/50 px-4 py-2 text-sm font-medium text-brand-900 hover:bg-brand-100">
        {uploading ? "Uploading..." : "📷 Upload images"}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {error && <p className="mt-2 text-sm text-danger-600">{error}</p>}
      {images.length === 0 && !error && (
        <p className="mt-1 text-xs text-ink-500">At least one image is required.</p>
      )}
    </div>
  );
}
