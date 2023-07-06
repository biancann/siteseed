"use client";

import "../../flow/config";
import * as fcl from "@onflow/fcl"
import Logo from "@/components/logo";
import { Icon } from "@iconify/react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { Controls, Player } from "@lottiefiles/react-lottie-player";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState({ loggedIn: undefined });
  const [breakpoint, setBreakpoint] = useState("desktop");
  const [openGenerate, setOpenGenerate] = useState(false);
  
  const frameRef = useRef();
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  });
  
  useEffect(() => fcl.currentUser.subscribe(setUser), []);

  useEffect(() => {
    if (messages) {
      let doc = frameRef.current.contentDocument;
      doc.open();
      doc.write('<script src="https://cdn.tailwindcss.com"></script>');
      doc.write(messages[1]?.content ?? "");
      doc.close();
    }
  }, [messages]);

  useEffect(() => {
    if (isLoading) {
      setOpenGenerate(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (user?.loggedIn !== undefined) {
      if (user?.loggedIn !== true) {
        return router.push('/');
      }
    }
  }, [user, router]);

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="bg-white h-16 w-full shadow flex items-center px-4">
        <div className="w-full grid grid-cols-3">
          <div className="flex items-center justify-start">
            <Logo className="h-4" />
          </div>
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center bg-slate-100 p-1 rounded-md gap-1">
              <button
                className={`p-2 hover:bg-white hover:shadow-md rounded-md ${breakpoint === "desktop" && "bg-white shadow"}`}
                onClick={() => setBreakpoint("desktop")}
              >
                <Icon className="w-5 h-5 text-gray-500" icon="ph:desktop-bold" />
              </button>
              <button
                className={`p-2 hover:bg-white hover:shadow-md rounded-md ${breakpoint === "laptop" && "bg-white shadow"}`}
                onClick={() => setBreakpoint("laptop")}
              >
                <Icon className="w-5 h-5 text-gray-500" icon="ph:laptop-bold" />
              </button>
              <button
                className={`p-2 hover:bg-white hover:shadow-md rounded-md ${breakpoint === "phone" && "bg-white shadow"}`}
                onClick={() => setBreakpoint("phone")}
              >
                <Icon className="w-5 h-5 text-gray-500" icon="clarity:mobile-phone-solid" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <button
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:contrast-125 hover:shadow-md text-white font-semibold text-sm rounded shadow disabled:cursor-not-allowed disabled:contrast-50"
              onClick={() => setOpenGenerate(true)}
            >
              {isLoading ? <Icon icon="mingcute:loading-fill" className="w-4 h-4 animate-spin" /> : <Icon icon="ph:magic-wand-bold" className="w-4 h-4" />}
              <span>{isLoading ? "Generating..." : "Generate"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 w-full mx-auto h-[calc(100vh_-_4rem)]">
        <div
          className={`bg-white shadow mx-auto rounded-md ${breakpoint === "desktop" && "w-full h-full"} ${breakpoint === "laptop" && "w-[1024px] h-full"} ${
            breakpoint === "phone" && "w-[360px] aspect-[9/16]"
          }`}
        >
          <iframe className={`w-full h-full rounded-md ${messages.length < 1 && "hidden"}`} ref={frameRef} frameborder="0"></iframe>
          <div className={`${messages.length > 0 && "hidden"} h-full flex items-center justify-center`}>
            <div className="text-center">
              <Player autoplay loop src="https://assets7.lottiefiles.com/packages/lf20_wv0g588k.json" style={{ height: "300px", width: "300px" }}></Player>
              <h1 className="font-bold text-3xl text-slate-800 mb-4">
                Transform Your Ideas into
                <br />
                Websites Effortlessly
              </h1>
              <button
                disabled={isLoading}
                className="flex items-center mx-auto gap-2 px-5 py-2.5 bg-indigo-500 hover:contrast-125 hover:shadow-md text-white font-semibold text-sm rounded shadow disabled:cursor-not-allowed disabled:contrast-50"
                onClick={() => setOpenGenerate(true)}
              >
                {isLoading ? <Icon icon="mingcute:loading-fill" className="w-4 h-4 animate-spin" /> : <Icon icon="ph:magic-wand-bold" className="w-4 h-4" />}
                <span>{isLoading ? "Generating..." : "Generate Now"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Transition appear show={openGenerate} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setOpenGenerate(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Describe your idea
                  </Dialog.Title>

                  <form onSubmit={handleSubmit}>
                    <div className="mt-2">
                      <textarea
                        required
                        className="w-full rounded border-gray-300"
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Landing page for selling premium roasted almond"
                        rows={4}
                      ></textarea>
                    </div>

                    <div className="mt-4 space-x-2">
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-500 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                      >
                        Generate!
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        onClick={() => {
                          setOpenGenerate(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </main>
  );
}
