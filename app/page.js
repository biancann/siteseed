"use client";

import "../flow/config";
import * as fcl from "@onflow/fcl";
import Logo from "@/components/logo";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DM_Serif_Display } from "next/font/google";
import { Icon } from "@iconify/react";

const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400" });

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState({ loggedIn: null });
  useEffect(() => fcl.currentUser.subscribe(setUser), []);

  useEffect(() => {
    if (user?.loggedIn) {
      return router.push("/build");
    }
  }, [user, router]);

  return (
    <main>
      <section className="flex py-40 flex-col items-center justify-center" style={{ backgroundImage: `url('/img/bg/pattern-block.png')` }}>
        <div className="max-w-3xl text-center">
          <Logo className="text-center h-8 mx-auto mb-8" />
          <h1 className={`font-bold text-6xl mb-4 leading-snug ${dmSerif.className}`}>Transform Your Ideas into Websites Effortlessly</h1>
          <p className="text-black/60 text-lg">
            Transform your ideas into extraordinary websites with Siteseed&apos;s intuitive AI builder. Power your online presence effortlessly.
          </p>
          <button
            onClick={() => fcl.authenticate()}
            className="inline-flex items-center gap-2 px-5 py-3 text-lg font-semibold bg-indigo-500 text-white mt-8 rounded hover:shadow-xl transition-all"
          >
            <Icon icon="ph:magic-wand-bold" className="w-6 h-6" />
            <span>Try it now!</span>
          </button>
        </div>
      </section>
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className={`font-bold text-3xl md:text-5xl text-center mb-8 ${dmSerif.className}`}>Get Your <span className="text-orange-600">Landing Page</span><br/>in <span className="text-indigo-600">1 minutes</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="w-full border rounded-md">
              <div className="absolute w-12 aspect-square bg-indigo-500 rounded-br-full pl-3 py-2 font-bold text-white">1</div>
              <img src="/img/guide/1.webp" alt="" className="rounded-t-md" />
              <div className="p-4">
                <h4 className="font-bold text-xl">Connect Your Wallet</h4>
              </div>
            </div>
            <div className="w-full border rounded-md">
              <div className="absolute w-12 aspect-square bg-indigo-500 rounded-br-full pl-3 py-2 font-bold text-white">2</div>
              <img src="/img/guide/2.webp" alt="" className="rounded-t-md" />
              <div className="p-4">
                <h4 className="font-bold text-xl">Describe Your Idea</h4>
              </div>
            </div>
            <div className="w-full border rounded-md">
              <div className="absolute w-12 aspect-square bg-indigo-500 rounded-br-full pl-3 py-2 font-bold text-white">3</div>
              <img src="/img/guide/3.webp" alt="" className="rounded-t-md" />
              <div className="p-4">
                <h4 className="font-bold text-xl">Get Your Result & Code</h4>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
