import React, { ReactNode } from 'react';

interface PhoneFrameProps {
    children: ReactNode;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-stone-200 to-stone-300 dark:from-stone-800 dark:to-stone-900 overflow-hidden p-4">
            {/* iPhone Frame - Scaled down to fit viewport */}
            <div
                className="relative mx-auto border-gray-900 bg-gray-900 border-[10px] rounded-[2.5rem] shadow-2xl"
                style={{
                    width: '320px',
                    height: '660px',
                    boxShadow: '0px 0px 0px 6px #1f2937, 0px 10px 40px rgba(0,0,0,0.4)'
                }}
            >
                {/* Dynamic Island / Notch */}
                <div className="w-[90px] h-[22px] bg-black absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-50 flex items-center justify-center">
                    <div className="w-12 h-3 bg-black rounded-full grid place-items-center">
                        <div className="w-8 h-1 bg-gray-800/50 rounded-full"></div>
                    </div>
                </div>

                {/* Side Buttons */}
                <div className="h-[32px] w-[2px] bg-gray-700 absolute -left-[12px] top-[90px] rounded-l-lg"></div>
                <div className="h-[32px] w-[2px] bg-gray-700 absolute -left-[12px] top-[130px] rounded-l-lg"></div>
                <div className="h-[48px] w-[2px] bg-gray-700 absolute -right-[12px] top-[110px] rounded-r-lg"></div>

                {/* Screen Content */}
                <div className="rounded-[1.75rem] overflow-hidden w-full h-full bg-background relative flex flex-col">
                    {/* Status Bar */}
                    <div className="h-10 w-full bg-background/80 backdrop-blur-sm absolute top-0 left-0 z-40 flex items-end justify-between px-5 pb-1.5 select-none pointer-events-none text-foreground">
                        <span className="text-[10px] font-semibold">9:41</span>
                        <div className="flex gap-1 items-center">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3C7.46 3 3.34 5.78 1.18 9.91l1.78.9C4.47 7.21 8 5 12 5s7.53 2.21 9.04 5.81l1.78-.9C20.66 5.78 16.54 3 12 3z" /></svg>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M2 22h20V2H2v20zm2-2V4h16v16H4z" /></svg>
                            <div className="w-5 h-2.5 border border-current rounded-sm relative">
                                <div className="absolute inset-0.5 bg-current rounded-sm" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Main App Area */}
                    <div className="flex-1 w-full h-full overflow-y-auto overflow-x-hidden scrollbar-hide">
                        <div className="pt-10 pb-6 min-h-full">
                            {children}
                        </div>
                    </div>

                    {/* Home Indicator */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-foreground/30 rounded-full z-50"></div>
                </div>
            </div>
        </div>
    );
};

export default PhoneFrame;
