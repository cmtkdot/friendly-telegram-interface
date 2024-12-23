import { Settings2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export interface AISettings {
  temperature: number;
  maxTokens: number;
  streamResponse: boolean;
  model: string;
}

interface AISettingsProps {
  settings: AISettings;
  onSettingsChange: (settings: AISettings) => void;
}

export const AISettingsPanel = ({ settings, onSettingsChange }: AISettingsProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="glass-button">
          <Settings2 className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>AI Settings</SheetTitle>
          <SheetDescription>
            Configure how the AI processes your requests
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>AI Model</Label>
            <Select
              value={settings.model}
              onValueChange={(value) =>
                onSettingsChange({ ...settings, model: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o">GPT-4 Optimized</SelectItem>
                <SelectItem value="gpt-4o-mini">GPT-4 Mini</SelectItem>
                <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
                <SelectItem value="claude-3-5-haiku">Claude 3.5 Haiku</SelectItem>
                <SelectItem value="gemini-2-flash">Gemini 2.0 Flash</SelectItem>
                <SelectItem value="gemini-1-5-flash">Gemini 1.5 Flash</SelectItem>
                <SelectItem value="gemini-1-5-flash-8b">Gemini 1.5 Flash-8B</SelectItem>
                <SelectItem value="gemini-1-5-pro">Gemini 1.5 Pro</SelectItem>
                <SelectItem value="ol">OL</SelectItem>
                <SelectItem value="ol-mini">OL Mini</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Temperature ({settings.temperature})</Label>
            <Slider
              value={[settings.temperature]}
              min={0}
              max={1}
              step={0.1}
              onValueChange={([value]) => 
                onSettingsChange({ ...settings, temperature: value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Max Tokens ({settings.maxTokens})</Label>
            <Slider
              value={[settings.maxTokens]}
              min={100}
              max={2000}
              step={100}
              onValueChange={([value]) => 
                onSettingsChange({ ...settings, maxTokens: value })
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={settings.streamResponse}
              onCheckedChange={(checked) =>
                onSettingsChange({ ...settings, streamResponse: checked })
              }
            />
            <Label>Stream Response</Label>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};