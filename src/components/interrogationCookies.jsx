import React from 'react';
import { FiHelpCircle } from 'react-icons/fi'; 

const TooltipIcon = ({ tooltipText }) => {
  return (
    <div className="relative group">
      <FiHelpCircle className="text-2xl cursor-pointer" />
      <div className="absolute invisible group-hover:visible w-64 text-sm text-white bg-black rounded-md p-2 -left-1/2 transform -translate-x-1/2 -translate-y-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {tooltipText || 'Si vous cochez cette option, la revente de vos données nous sera autorisée.'}
      </div>
    </div>
  );
};

export default TooltipIcon;
