"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useGamePromptStore } from "@/store/gamePromptStore";

interface KeyBinding {
  id: string;
  action: string;
  key: string;
  description: string;
}

export default function GameMechanicsScreen() {
  // Use external store for gamePrompt
  const [gamePrompt, setGamePrompt] = useGamePromptStore();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [gesturesEnabled, setGesturesEnabled] = useState(false);
  const [editingKeyBinding, setEditingKeyBinding] = useState<string | null>(null);

  const [keyBindings, setKeyBindings] = useState<KeyBinding[]>([
    { id: "1", action: "Move Forward", key: "W", description: "Move character forward" },
    { id: "2", action: "Move Backward", key: "S", description: "Move character backward" },
    { id: "3", action: "Move Left", key: "A", description: "Move character left" },
    { id: "4", action: "Move Right", key: "D", description: "Move character right" },
    { id: "5", action: "Jump", key: "Space", description: "Make character jump" },
    { id: "6", action: "Run", key: "Shift", description: "Make character run" },
    { id: "7", action: "Attack", key: "Mouse1", description: "Primary attack" },
    { id: "8", action: "Block", key: "Mouse2", description: "Block or defend" },
    { id: "9", action: "Interact", key: "E", description: "Interact with objects" },
    { id: "10", action: "Inventory", key: "I", description: "Open inventory" },
    { id: "11", action: "Pause", key: "Escape", description: "Pause the game" },
    { id: "12", action: "Menu", key: "M", description: "Open main menu" },
  ]);

  const handleKeyBindingChange = (id: string, newKey: string) => {
    setKeyBindings(prev =>
      prev.map(binding =>
        binding.id === id ? { ...binding, key: newKey } : binding
      )
    );
    setEditingKeyBinding(null);
  };

  const resetToDefaults = () => {
  setKeyBindings([
      { id: "1", action: "Move Forward", key: "W", description: "Move character forward" },
      { id: "2", action: "Move Backward", key: "S", description: "Move character backward" },
      { id: "3", action: "Move Left", key: "A", description: "Move character left" },
      { id: "4", action: "Move Right", key: "D", description: "Move character right" },
      { id: "5", action: "Jump", key: "Space", description: "Make character jump" },
      { id: "6", action: "Run", key: "Shift", description: "Make character run" },
      { id: "7", action: "Attack", key: "Mouse1", description: "Primary attack" },
      { id: "8", action: "Block", key: "Mouse2", description: "Block or defend" },
      { id: "9", action: "Interact", key: "E", description: "Interact with objects" },
      { id: "10", action: "Inventory", key: "I", description: "Open inventory" },
      { id: "11", action: "Pause", key: "Escape", description: "Pause the game" },
      { id: "12", action: "Menu", key: "M", description: "Open main menu" },
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Audio and Gesture Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              🔊 Audio Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-slate-200 font-medium">Enable Audio</label>
                <p className="text-slate-400 text-sm">Turn on/off all game audio</p>
              </div>
              <Switch
                checked={audioEnabled}
                onCheckedChange={setAudioEnabled}
              />
            </div>

            <Separator className="bg-slate-600" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-200">Master Volume</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="75"
                  className="w-24"
                  disabled={!audioEnabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-200">Music Volume</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="60"
                  className="w-24"
                  disabled={!audioEnabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-200">Sound Effects</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="85"
                  className="w-24"
                  disabled={!audioEnabled}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              👋 Gesture Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-slate-200 font-medium">Enable Gestures</label>
                <p className="text-slate-400 text-sm">Use touch gestures and motion controls</p>
              </div>
              <Switch
                checked={gesturesEnabled}
                onCheckedChange={setGesturesEnabled}
              />
            </div>

            <Separator className="bg-slate-600" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-200">Swipe Sensitivity</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  defaultValue="5"
                  className="w-24"
                  disabled={!gesturesEnabled}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-200">Tap to Click</span>
                <Switch disabled={!gesturesEnabled} defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-200">Pinch to Zoom</span>
                <Switch disabled={!gesturesEnabled} defaultChecked />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Bindings */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              ⌨️ Key Bindings
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefaults}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Reset to Defaults
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keyBindings.map((binding) => (
              <div
                key={binding.id}
                className="flex items-center justify-between p-3 bg-slate-700 rounded-lg"
              >
                <div className="flex-1">
                  <div className="text-slate-200 font-medium text-sm">{binding.action}</div>
                  <div className="text-slate-400 text-xs">{binding.description}</div>
                </div>
                <div className="ml-3">
                  {editingKeyBinding === binding.id ? (
                    <Input
                      value={binding.key}
                      onChange={(e) => handleKeyBindingChange(binding.id, e.target.value)}
                      onBlur={() => setEditingKeyBinding(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          setEditingKeyBinding(null);
                        }
                      }}
                      className="w-20 h-8 text-center bg-slate-600 border-slate-500 text-white"
                      autoFocus
                    />
                  ) : (
                    <Badge
                      className="cursor-pointer bg-slate-600 hover:bg-slate-500 text-white min-w-[60px] justify-center"
                      onClick={() => setEditingKeyBinding(binding.id)}
                    >
                      {binding.key}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-slate-700 rounded-lg">
            <h4 className="text-slate-200 font-medium mb-2">Instructions</h4>
            <ul className="text-slate-400 text-sm space-y-1">
              <li>• Click on any key badge to edit the binding</li>
              <li>• Use standard key names: A-Z, Space, Shift, Ctrl, Alt, etc.</li>
              <li>• Mouse buttons: Mouse1 (left), Mouse2 (right), Mouse3 (middle)</li>
              <li>• Special keys: Arrow keys, F1-F12, Enter, Escape, Tab</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      {/* Add a button to push mechanics data to global gamePrompt */}
      <div className="mt-6">
        <Button
          className="w-full bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 hover:from-green-500 hover:to-purple-500 text-black h-12 text-lg font-semibold"
          onClick={() => {
            // Try to extract the game idea from the current gamePrompt
            let gameIdeaSection = "";
            const gameIdeaMatch = gamePrompt.match(/Game Idea:[\s\S]*?(?=\nMechanics:|$)/);
            if (gameIdeaMatch) {
              gameIdeaSection = gameIdeaMatch[0].trim();
            }
            const mechanicsText = keyBindings.map(k => `${k.action}: ${k.key} (${k.description})`).join("\n");
            const combinedPrompt = `${gameIdeaSection}\n\nMechanics:\n${mechanicsText}`;
            setGamePrompt(combinedPrompt);
          }}
        >
          Add Mechanics to Game Prompt
        </Button>
      </div>
    </div>
  );
}
