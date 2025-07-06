
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { saveApiSettings, getApiSettings } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Settings, Github } from 'lucide-react';
import GitHubSync from './GitHubSync';

const ApiSettings = () => {
  const [settings, setSettings] = useState(getApiSettings());
  const [showKeys, setShowKeys] = useState({
    openai: false,
    anthropic: false,
    gemini: false,
  });
  const { toast } = useToast();

  const handleSave = () => {
    saveApiSettings(settings);
    toast({
      title: "Settings saved",
      description: "Your API settings have been saved successfully.",
    });
  };

  const toggleKeyVisibility = (provider: keyof typeof showKeys) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <p className="text-muted-foreground">
          Configure your API keys and sync preferences.
        </p>
      </div>

      <Tabs defaultValue="api" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            API Settings
          </TabsTrigger>
          <TabsTrigger value="sync" className="flex items-center gap-2">
            <Github className="h-4 w-4" />
            Data Sync
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Provider</CardTitle>
              <CardDescription>
                Choose your preferred AI provider for insights and analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">Selected Provider</Label>
                  <Select 
                    value={settings.selectedProvider} 
                    onValueChange={(value) => updateSetting('selectedProvider', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select AI provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="gemini">Google Gemini</SelectItem>
                      <SelectItem value="lmstudio">LM Studio (Local)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Configure your API keys for different AI providers. Keys are stored locally in your browser.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* OpenAI */}
              <div className="space-y-2">
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="openai-key"
                    type={showKeys.openai ? "text" : "password"}
                    placeholder="sk-..."
                    value={settings.openaiApiKey || ''}
                    onChange={(e) => updateSetting('openaiApiKey', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => toggleKeyVisibility('openai')}
                  >
                    {showKeys.openai ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Anthropic */}
              <div className="space-y-2">
                <Label htmlFor="anthropic-key">Anthropic API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="anthropic-key"
                    type={showKeys.anthropic ? "text" : "password"}
                    placeholder="sk-ant-..."
                    value={settings.anthropicApiKey || ''}
                    onChange={(e) => updateSetting('anthropicApiKey', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => toggleKeyVisibility('anthropic')}
                  >
                    {showKeys.anthropic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Gemini */}
              <div className="space-y-2">
                <Label htmlFor="gemini-key">Google Gemini API Key</Label>
                <div className="flex gap-2">
                  <Input
                    id="gemini-key"
                    type={showKeys.gemini ? "text" : "password"}
                    placeholder="AI..."
                    value={settings.geminiApiKey || ''}
                    onChange={(e) => updateSetting('geminiApiKey', e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => toggleKeyVisibility('gemini')}
                  >
                    {showKeys.gemini ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* LM Studio */}
              <div className="space-y-2">
                <Label htmlFor="lmstudio-endpoint">LM Studio Endpoint</Label>
                <Input
                  id="lmstudio-endpoint"
                  type="url"
                  placeholder="http://localhost:1234/v1"
                  value={settings.lmstudioEndpoint || ''}
                  onChange={(e) => updateSetting('lmstudioEndpoint', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Local LM Studio server endpoint for running models locally.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave}>
              Save Settings
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="sync" className="space-y-6">
          <GitHubSync />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiSettings;
