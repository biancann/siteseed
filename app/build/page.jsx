"use client";

import "../../flow/config";
import * as fcl from "@onflow/fcl";
import Logo from "@/components/logo";
import { Icon } from "@iconify/react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { Player } from "@lottiefiles/react-lottie-player";
import { useRouter } from "next/navigation";
import { DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import { Tooltip } from "react-tooltip";
import { Toaster, toast } from "react-hot-toast";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import "react-tooltip/dist/react-tooltip.css";

const jbMono = JetBrains_Mono({ subsets: ["latin"], weight: "400" });
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400" });

const COST_PER_GENERATE = 10; // in FLOW
const OWNER_ADDRESS = "0xd39b16b459032658";
const SEND_FLOW = `
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
transaction(amount: UFix64, to: Address) {
  let sentVault: @FungibleToken.Vault
  prepare(sender: AuthAccount) {
    let vault = sender.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault) ?? panic("Could not borrow reference to the owner's Vault!")
    self.sentVault <- vault.withdraw(amount: amount)
  }
  execute {
    let recipient = getAccount(to)
    let receiver = recipient.getCapability(/public/flowTokenReceiver).borrow<&{FungibleToken.Receiver}>() ?? panic("Could not borrow receiver reference to the recipient's Vault")
    receiver.deposit(from: <-self.sentVault)
  }
}
`;

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState({ loggedIn: undefined });
  const [balance, setBalance] = useState(0);
  const [breakpoint, setBreakpoint] = useState("desktop");
  const [openGenerate, setOpenGenerate] = useState(false);
  const [openCode, setOpenCode] = useState(false);
  const [loading, setLoading] = useState(false);

  const frameRef = useRef();
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  });

  useEffect(() => fcl.currentUser.subscribe(setUser), []);

  useEffect(() => {
    if (messages) {
      let doc = frameRef.current.contentDocument;
      doc.open();
      doc.write(messages[1]?.content ?? "");
      doc.close();
    }
  }, [messages]);

  useEffect(() => {
    if (user?.loggedIn !== undefined) {
      if (user?.loggedIn !== true) {
        return router.push("/");
      }

      getAccount(user?.addr)
        .then((res) => setBalance(res?.balance / 100000000))
        .catch((err) => console.log(err));
    }
  }, [user, router]);

  const getAccount = async (address) => {
    const account = await fcl.send([fcl.getAccount(address)]).then(fcl.decode);
    return account;
  };

  const handleBeforeSubmit = async (e) => {
    e.preventDefault();
    if (balance > COST_PER_GENERATE) {
      setLoading("Loading...");
      try {
        const txId = await sendFlow(COST_PER_GENERATE.toFixed(1), OWNER_ADDRESS);
        // fcl.tx(txId).subscribe((e) => {
        //   if (e?.statusString != "") {
        //     toast.success(e?.statusString);
        //     setLoading(e?.statusString);
        //   }
        // });
        await fcl.tx(txId).onceSealed();
        setLoading(false);
        setOpenGenerate(false);
        setBalance((prev) => prev - COST_PER_GENERATE);
        toast.success("Start generating your site!");
        handleSubmit(e);
      } catch (error) {
        toast.error(error);
        setLoading(false);
      }
    } else {
      toast.dismiss();
      toast.error("Your balance is insufficient to make this transaction");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <Tooltip id="my-tooltip" />

      {/* Loader */}
      {loading && (
        <div className="z-50 fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <Icon icon="mingcute:loading-fill" className="animate-spin mx-auto text-white w-6 h-6 mb-4" />
            <span className="text-white">Loading...</span>
          </div>
        </div>
      )}

      <div className="bg-white h-16 w-full shadow flex items-center px-4">
        <div className="w-full grid grid-cols-3">
          <div className="flex items-center justify-start">
            <a href="/">
              <Logo className="h-4" />
            </a>
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
          <div className="flex items-center justify-end gap-4">
            <button
              className="border p-2.5 rounded-md hover:bg-gray-200 disabled:cursor-not-allowed disabled:contrast-50"
              disabled={isLoading || messages.length < 1}
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Source Code"
              data-tooltip-place="bottom"
              onClick={() => setOpenCode(true)}
            >
              <Icon icon="heroicons-outline:code" className="w-5 h-5" />
            </button>

            <button
              disabled={isLoading}
              data-tooltip-id="my-tooltip"
              data-tooltip-content={`${COST_PER_GENERATE} FLOW`}
              data-tooltip-place="bottom"
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:contrast-125 hover:shadow-md text-white font-semibold text-sm rounded shadow disabled:cursor-not-allowed disabled:contrast-50"
              onClick={() => setOpenGenerate(true)}
            >
              {isLoading ? <Icon icon="mingcute:loading-fill" className="w-4 h-4 animate-spin" /> : <Icon icon="ph:magic-wand-bold" className="w-4 h-4" />}
              <span>{isLoading ? "Generating..." : "Generate"}</span>
            </button>
            <Menu as="div" className="flex items-center gap-1 relative">
              <Menu.Button className="relative">
                <img src={`https://api.dicebear.com/6.x/bottts-neutral/svg?seed=${user?.addr}&size=120`} alt="Ava" className="w-6 h-6 rounded-full mx-auto" />
                <p className={`text-xs text-gray-600 ${jbMono.className}`}>
                  {(user?.addr ?? "").substr(0, 4)}...{(user?.addr ?? "").substr(-4, 4)}
                </p>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 top-8 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({ active }) => (
                        <button className={`text-gray-500 group flex w-full items-center rounded-md px-2 py-2 text-xs ${jbMono.className}`}>
                          {user?.addr}
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button className={`text-gray-500 group flex w-full items-center rounded-md px-2 py-2 text-xs ${jbMono.className}`}>
                          {balance} FLOW
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => fcl.unauthenticate()}
                          className={`${active ? "bg-red-500 text-white" : "text-red-500"} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                        >
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 w-full mx-auto h-[calc(100vh_-_4rem)]">
        <div
          className={`bg-white shadow mx-auto rounded-md ${breakpoint === "desktop" && "w-full h-full"} ${breakpoint === "laptop" && "w-[1024px] h-full"} ${
            breakpoint === "phone" && "w-[360px] aspect-[9/16]"
          }`}
        >
          <iframe className={`w-full h-full rounded-md ${messages.length < 1 && "hidden"}`} ref={frameRef} frameBorder="0"></iframe>
          <div className={`${messages.length > 0 && "hidden"} h-full flex items-center justify-center`}>
            <div className="text-center">
              <Player autoplay loop src="https://assets7.lottiefiles.com/packages/lf20_wv0g588k.json" style={{ height: "300px", width: "300px" }}></Player>
              <h1 className={`font-bold text-4xl text-slate-800 mb-8 leading-snug ${dmSerif.className}`}>
                Transform Your Ideas into
                <br />
                Websites Effortlessly
              </h1>
              <button
                data-tooltip-id="my-tooltip"
                data-tooltip-content={`${COST_PER_GENERATE} FLOW`}
                data-tooltip-place="bottom"
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

                  <form onSubmit={handleBeforeSubmit}>
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
                        type="button"
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

      <Transition appear show={openCode} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setOpenCode(false)}>
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
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center justify-between p-6 border-b">
                    <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900">
                      Source Code
                    </Dialog.Title>
                    <button onClick={() => setOpenCode(false)}>
                      <Icon icon="heroicons-outline:x" className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="h-[50vh] overflow-y-auto">
                      <SyntaxHighlighter language="html" style={dracula} showLineNumbers={true}>
                        {messages[1]?.content ?? ""}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Toaster />
    </main>
  );
}

async function sendFlow(amount, to) {
  return fcl.mutate({
    cadence: SEND_FLOW,
    args: (arg, t) => [arg(amount, t.UFix64), arg(to, t.Address)],
    payer: fcl.authz,
    proposer: fcl.authz,
    authorizations: [fcl.authz],
    limit: 1000,
  });
}
