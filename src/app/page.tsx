"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IdeationScreen from "@/components/IdeationScreen";
import GameMechanicsScreen from "@/components/GameMechanicsScreen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { PromptInput, PromptInputActions } from "@/components/ui/prompt-input";
import { FrameworkSelector } from "@/components/framework-selector";
import Image from "next/image";
import LogoSvg from "@/logo.svg";
import { Button } from "@/components/ui/button";
import { ExampleButton } from "@/components/ExampleButton";
import { UserButton } from "@stackframe/stack";
import { UserApps } from "@/components/user-apps";
import { useGamePromptStore } from "@/store/gamePromptStore";
import { PromptInputTextarea } from "@/components/ui/prompt-input";

const queryClient = new QueryClient();

export default function Home() {
  // Use external store for gamePrompt

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Add UserButton to the top right of the base screen */}
        <div className="flex justify-end mb-4">
          <UserButton />
        </div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Game Development Studio
          </h1>
          <p className="text-slate-300">
            Design, configure, and code your game in one unified platform
          </p>
        </div>

        <Tabs defaultValue="ideation" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-800 border-slate-700">
            <TabsTrigger
              value="ideation"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300"
            >
              💡 Ideation
            </TabsTrigger>
            <TabsTrigger
              value="mechanics"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300"
            >
              ⚙️ Game Mechanics
            </TabsTrigger>
            <TabsTrigger
              value="editor"
              className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-300"
            >
              💻 Code Editor
            </TabsTrigger>
          </TabsList>

          {/* Use global gamePrompt state in all tabs */}
          <TabsContent value="ideation" className="mt-0">
            <IdeationScreen />
          </TabsContent>
          <TabsContent value="mechanics" className="mt-0">
            <GameMechanicsScreen />
          </TabsContent>
          <TabsContent value="editor" className="mt-0">
            <QueryClientProvider client={queryClient}>
              <CodeEditorAI />
            </QueryClientProvider>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function CodeEditorAI() {
  const [gamePrompt, setGamePrompt] = useGamePromptStore();
  const [framework, setFramework] = useState("nextjs");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);
    router.push(
      `/app/new?message=${encodeURIComponent(gamePrompt)}&template=${framework}`
    );
  };

  return (
    <main className="min-h-screen p-4 relative bg-slate-900 rounded-xl border border-slate-700">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-lg font-bold flex-1 sm:w-80 text-white">
          <a href="https://www.freestyle.sh">freestyle.sh</a>
        </h1>
        <Image
          className="dark:invert mx-2"
          src={LogoSvg}
          alt="Adorable Logo"
          width={36}
          height={36}
        />
        {/* Remove UserButton from here */}
      </div>

      <div>
        <div className="w-full max-w-lg px-4 sm:px-0 mx-auto flex flex-col items-center mt-16 sm:mt-24 md:mt-32">
          <p className="text-neutral-300 text-center mb-6 text-3xl sm:text-4xl md:text-5xl font-bold">
            Let AI Cook
          </p>

          <div className="w-full relative my-5">
            <div className="w-full bg-accent rounded-md relative z-10 border border-slate-700">
              <PromptInput
                leftSlot={
                  <FrameworkSelector
                    value={framework}
                    onChange={setFramework}
                  />
                }
                isLoading={isLoading}
                value={gamePrompt}
                onValueChange={setGamePrompt}
                onSubmit={handleSubmit}
                className="relative z-10 border-none bg-transparent shadow-none"
              >
              <PromptInputTextarea
                className="min-h-[100px] w-full bg-transparent dark:bg-transparent backdrop-blur-sm pr-12"
                
              />
                <PromptInputActions>
                  <Button
                    variant={"ghost"}
                    size="sm"
                    onClick={handleSubmit}
                    disabled={isLoading || !gamePrompt.trim()}
                    className="h-7 text-xs"
                  >
                    <span className="hidden sm:inline">Start Creating ⏎</span>
                    <span className="sm:hidden">Create ⏎</span>
                  </Button>
                </PromptInputActions>
              </PromptInput>
            </div>
          </div>

          <Examples setGamePrompt={setGamePrompt} />

          <div className="mt-8 mb-16">
            <a
              href="https://freestyle.sh"
              className="border rounded-md px-4 py-2 mt-4 text-sm font-semibold text-center block text-slate-300 hover:bg-slate-800"
            >
              <span className="block font-bold">
                By <span className="underline">freestyle.sh</span>
              </span>
              <span className="text-xs">
                JavaScript infrastructure for AI.
              </span>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 py-8">
        <UserApps />
      </div>
    </main>
  );
}

function Examples({ setGamePrompt }: { setGamePrompt: (text: string) => void }) {
  return (
    <div className="mt-2">
      <div className="flex flex-wrap justify-center gap-2 px-2">
        <ExampleButton
          text="Dog Food Marketplace"
          promptText="Build a dog food marketplace where users can browse and purchase premium dog food."
          onClick={(text) => setGamePrompt(text)}
        />
        <ExampleButton
          text="Personal Website"
          promptText="Create a personal website with portfolio, blog, and contact sections."
          onClick={(text) => setGamePrompt(text)}
        />
        <ExampleButton
          text="Burrito B2B SaaS"
          promptText="Build a B2B SaaS for burrito shops to manage inventory, orders, and delivery logistics."
          onClick={(text) => setGamePrompt(text)}
        />
      </div>
    </div>
  );
}