
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { ApiSettings as ApiSettingsType } from '@/types/article';
import { saveApiSettings, getApiSettings } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';

const ApiSettings = () => {
  const [settings, setSettings] = useState<ApiSettingsType>({ selectedProvider: 'openai' });
  const [showKeys, setShowKeys] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedSettings = getApiSettings();
    setSettings(savedSettings);
  }, []);

  const handleSave = () => {
    saveApiSettings(settings);
    toast({
      title: "Settings Saved",
      description: "Your API settings have been saved locally.",
    });
  };

  const updateSettings = (key: keyof ApiSettingsType, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          AI API Settings
        </CardTitle>
        <CardDescription>
          Configure your AI provider settings. All keys are stored locally on your device.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="provider">AI Provider</Label>
          <Select
            value={settings.selectedProvider}
            onValueChange={(value: 'openai' | 'anthropic') => updateSettings('selectedProvider', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select AI provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI (GPT)</SelectItem>
              <SelectItem value="anthropic">Anthropic (Claude)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {settings.selectedProvider === 'openai' && (
          <div className="space-y-2">
            <Label htmlFor="openai-key">OpenAI API Key</Label>
            <div className="relative">
              <Input
                id="openai-key"
                type={showKeys ? 'text' : 'password'}
                placeholder="sk-..."
                value={settings.openaiApiKey || ''}
                onChange={(e) => updateSettings('openaiApiKey', e.target.value)}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowKeys(!showKeys)}
              >
                {showKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}

        {settings.selectedProvider === 'anthropic' && (
          <div className="space-y-2">
            <Label htmlFor="anthropic-key">Anthropic API Key</Label>
            <div className="relative">
              <Input
                id="anthropic-key"
                type={showKeys ? 'text' : 'password'}
                placeholder="sk-ant-..."
                value={settings.anthropicApiKey || ''}
                onChange={(e) => updateSettings('anthropicApiKey', e.target.value)}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowKeys(!showKeys)}
              >
                {showKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}

        <Button onClick={handleSave} className="w-full">
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApiSettings;
