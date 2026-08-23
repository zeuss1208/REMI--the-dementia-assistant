import React, { useState } from "react";

interface AvatarProps {
  photoUrl?: string;
  initial: string;
  color?: string;
  size?: number;
  ring?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  photoUrl,
  initial,
  color = "#5E8271",
  size = 56,
  ring = false,
  className = "",
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {ring && (
        <span
          className="absolute -inset-1 rounded-full breathe pointer-events-none"
          style={{ backgroundColor: color, opacity: 0.3 }}
        />
      )}

      {photoUrl && !imgError ? (
        <img
          src={photoUrl}
          alt={initial}
          onError={() => setImgError(true)}
          className="w-full h-full rounded-full object-cover shadow-sm border border-black/5"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          className="w-full h-full rounded-full flex items-center justify-center font-bold text-white shadow-sm border border-black/5"
          style={{
            backgroundColor: color,
            fontFamily: "Sora, sans-serif",
            fontSize: Math.round(size * 0.38),
          }}
        >
          {initial}
        </div>
      )}
    </div>
  );
};
