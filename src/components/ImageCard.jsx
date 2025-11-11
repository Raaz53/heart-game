// src/components/ImageCard.jsx
import React from "react";

export default function ImageCard({ src, alt }) {
  if (!src) return <div className="p-4 text-gray-600">No image provided by API.</div>;
  return (
    <div className="p-2">
      <img src={src} alt={alt || "question"} className="max-w-full border" />
    </div>
  );
}
