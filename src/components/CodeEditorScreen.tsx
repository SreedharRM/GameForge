"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CodeEditorScreen() {
  return (
    <div className="h-full">
      <Card className="h-[600px] bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            💻 Freestyle Code Editor
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full flex flex-col items-center justify-center">
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto bg-slate-700 rounded-lg flex items-center justify-center">
              <span className="text-6xl">📝</span>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Code Editor Coming Soon</h3>
              <p className="text-slate-400 max-w-md">
                This will be your freestyle coding environment where you can write, edit, and test your game code.
              </p>
            </div>

            <div className="space-y-3 text-slate-300">
              <div className="flex items-center gap-2 justify-center">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Syntax highlighting</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Auto-completion</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Real-time preview</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Version control</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
              disabled
            >
              Start Coding (Coming Soon)
            </Button>
          </div>

          {/* Placeholder code blocks for visual effect */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="grid grid-cols-3 gap-4 p-8 h-full">
              <div className="space-y-2">
                <div className="h-4 bg-blue-400 rounded w-3/4"></div>
                <div className="h-4 bg-green-400 rounded w-1/2"></div>
                <div className="h-4 bg-yellow-400 rounded w-5/6"></div>
                <div className="h-4 bg-purple-400 rounded w-2/3"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-red-400 rounded w-4/5"></div>
                <div className="h-4 bg-indigo-400 rounded w-1/3"></div>
                <div className="h-4 bg-pink-400 rounded w-3/4"></div>
                <div className="h-4 bg-teal-400 rounded w-1/2"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-orange-400 rounded w-2/3"></div>
                <div className="h-4 bg-cyan-400 rounded w-5/6"></div>
                <div className="h-4 bg-lime-400 rounded w-1/4"></div>
                <div className="h-4 bg-amber-400 rounded w-3/5"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
