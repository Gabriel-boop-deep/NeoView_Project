import React from 'react';
import companyLogo from './images/IB-Symbol positive colour_white background.png';

interface CompanyCardProps {
  name: string;
  fullName: string;
  onClick: () => void;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ name, fullName, onClick }) => {
  return (
    <button onClick={onClick} className="company-card w-full text-left group">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <img
            src={companyLogo}
            alt={`${name} logo`}
            className="transition-transform duration-300 group-hover:scale-110 w-12 h-auto"
            loading="eager"
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-primary group-hover:text-primary/80 transition-colors">
            {name}
          </h3>
        </div>
      </div>
    </button>
  );
};
