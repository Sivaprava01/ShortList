import { Link } from 'react-router-dom';

export default function Logo({ size = 'md', clickable = true }) {
  // Size variants
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  const svgSize = {
    sm: '24',
    md: '32',
    lg: '40',
    xl: '48'
  };

  const LogoSVG = () => (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeClasses[size]} transition-all duration-200`}
    >
      {/* Background gradient circle */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
        </linearGradient>
      </defs>

      {/* Outer circle */}
      <circle cx="16" cy="16" r="15" fill="url(#logoGradient)" opacity="0.15" />

      {/* Main shape - stylized "S" with modern geometric design */}
      {/* Top curve */}
      <path
        d="M 10 8 Q 16 6 20 10"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Middle connector */}
      <line
        x1="16"
        y1="10"
        x2="16"
        y2="22"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Bottom curve */}
      <path
        d="M 22 22 Q 16 26 10 22"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Accent dot */}
      <circle cx="24" cy="8" r="1.5" fill="currentColor" opacity="0.6" />
    </svg>
  );

  const logoContent = (
    <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity duration-200">
      <LogoSVG />
    </div>
  );

  if (clickable) {
    return (
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-lg hover:opacity-80 transition-opacity duration-200 cursor-pointer"
        title="Go to home"
      >
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
