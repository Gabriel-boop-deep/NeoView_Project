import React from 'react';

interface NeoLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const NeoLogo: React.FC<NeoLogoProps> = ({ size = 'md', showText = true }) => {
  const dimensions = {
    sm: { icon: 28, text: 'text-lg' },
    md: { icon: 36, text: 'text-xl' },
    lg: { icon: 48, text: 'text-3xl' },
  };

  const { icon, text } = dimensions[size];

  return (
    <div className="flex items-center gap-2">
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Blue drop */}
        <path
          d="M16 8C16 8 8 20 8 28C8 34.627 12.373 40 18 40C20.5 40 22.8 39 24.5 37.3"
          fill="#0DA9FE"
        />
        {/* Green drop */}
        <path
          d="M24 4C24 4 14 18 14 28C14 36.284 20.716 43 29 43C37.284 43 44 36.284 44 28C44 18 34 4 34 4C34 4 29 12 24 4Z"
          fill="#00A443"
        />
        {/* Orange accent */}
        <path
          d="M34 12C34 12 40 20 40 26C40 30.418 36.418 34 32 34C29.5 34 27.3 32.8 26 31"
          fill="#FF9C1A"
        />
      </svg>
      {showText && (
        <span className={`font-bold ${text} tracking-tight`}>
          <span className="text-primary">NEO</span>
          <span className="text-secondary">VIEW</span>
        </span>
      )}
    </div>
  );
};
