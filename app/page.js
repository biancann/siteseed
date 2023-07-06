"use client";

import "../flow/config";
import * as fcl from "@onflow/fcl"
import Logo from "@/components/logo";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState({ loggedIn: null });
  useEffect(() => fcl.currentUser.subscribe(setUser), []);

  useEffect(() => {
    if (user?.loggedIn) {
      return router.push('/build');
    }
  }, [user, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="max-w-3xl text-center">
        <Logo className="text-center h-8 mx-auto mb-4" />
        <h1 className="font-bold text-5xl mb-4">Transform Your Ideas into Websites Effortlessly</h1>
        <p>Transform your ideas into extraordinary websites with Siteseed&apos;s intuitive AI builder. Power your online presence effortlessly.</p>
        <button onClick={() => fcl.authenticate()} className="inline-block px-5 py-3 text-lg font-semibold bg-indigo-500 text-white mt-4">
          Try it now!
        </button>
      </div>
    </main>
  );
}
