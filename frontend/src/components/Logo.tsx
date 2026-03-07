// src/components/Logo.tsx
import React from 'react';

interface LogoProps {
  className?: string;
  withText?: boolean;
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ className = "h-12 w-12", withText = true, onClick }) => {
  return (
    <div onClick={onClick} className="flex items-center space-x-3 group cursor-pointer">
      <div className={`flex items-center justify-center ${className}`}>
        <img 
          src="/assets/new-logo.png"
          alt="Sai Bali Tours"
          className="h-full w-full object-contain"
        />
      </div>
      
      {withText && (
        <div className="flex flex-col">
          <span className="text-white font-black text-xl tracking-tight leading-none">
            Sai Bali
          </span>
          <span className="text-[8px] text-brand-orange font-black uppercase tracking-[0.5em] leading-none mt-1">
            Tours
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;