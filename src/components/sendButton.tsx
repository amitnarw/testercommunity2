import React from 'react';
import type { LucideIcon } from 'lucide-react';

type SendButtonProps = {
    Icon: LucideIcon;
    label: string;
};

export const SendButton = ({ Icon, label }: SendButtonProps) => {
    return (
        <button
            className="group relative flex items-center bg-primary text-white p-4 rounded-full overflow-hidden cursor-pointer transition-transform duration-200 active:scale-95 w-full flex flex-row items-center justify-center"
        >
            <div className="relative">
                <div className="transition-transform duration-300 ease-in-out group-hover:-translate-y-[0.5em]">
                    <Icon className="transition-transform origin-center group-hover:translate-x-5 group-hover:rotate-45 group-hover:scale-110" size={20} />
                </div>
            </div>
            <span className="block ml-2 transition-transform duration-300 ease-in-out group-hover:translate-x-20">
                {label}
            </span>
        </button>
    );
};
