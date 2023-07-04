"use client";

import Logo from "@/components/logo";
import { Icon } from "@iconify/react";
import { useState } from "react";

export default function Page() {
  const [breakpoint, setBreakpoint] = useState("desktop");

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="bg-white h-16 w-full shadow flex items-center px-4">
        <div className="w-full grid grid-cols-3">
          <div className="flex items-center justify-start">
            <Logo className="h-4" />
          </div>
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center bg-slate-100 p-1 rounded-md gap-1">
              <button className={`p-2 hover:bg-white hover:shadow-md rounded-md ${breakpoint === 'desktop' && 'bg-white shadow'}`} onClick={() => setBreakpoint('desktop')}>
                <Icon className="w-5 h-5 text-gray-500" icon="ph:desktop-bold" />
              </button>
              <button className={`p-2 hover:bg-white hover:shadow-md rounded-md ${breakpoint === 'laptop' && 'bg-white shadow'}`} onClick={() => setBreakpoint('laptop')}>
                <Icon className="w-5 h-5 text-gray-500" icon="ph:laptop-bold" />
              </button>
              <button className={`p-2 hover:bg-white hover:shadow-md rounded-md ${breakpoint === 'phone' && 'bg-white shadow'}`} onClick={() => setBreakpoint('phone')}>
                <Icon className="w-5 h-5 text-gray-500" icon="clarity:mobile-phone-solid" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <a
              href="#"
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:contrast-125 hover:shadow-md text-white font-semibold text-sm rounded shadow"
            >
              <Icon icon="ph:magic-wand-bold" className="w-4 h-4" />
              <span>Generate</span>
            </a>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 container mx-auto">
        <div className={`bg-white shadow mx-auto rounded-md ${breakpoint === 'desktop' && 'w-full aspect-video'} ${breakpoint === 'laptop' && 'w-[760px] aspect-video'} ${breakpoint === 'phone' && 'w-[360px] aspect-[9/16]'}`}></div>
      </div>
    </main>
  );
}
