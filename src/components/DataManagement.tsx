import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { exportData, importData } from '@/services/dataService';

export const DataManagement: React.FC = () => {
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      exportData();
      toast({
        title: 'Success',
        description: 'Data exported successfully.',
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to export data.',
        variant: 'destructive',
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await importData(file);
      toast({
        title: 'Success',
        description: 'Data imported successfully. Please refresh the page to see the changes.',
      });
    } catch (error) {
      console.error('Import failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to import data. Make sure the file is a valid export file.',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Export Data</h3>
          <p className="text-sm text-muted-foreground">
            Download all your application data into a single JSON file.
          </p>
          <Button onClick={handleExport} className="mt-2">
            Export Data
          </Button>
        </div>
        <div>
          <h3 className="font-semibold">Import Data</h3>
          <p className="text-sm text-muted-foreground">
            Import data from a previously exported JSON file. This will overwrite existing data.
          </p>
          <Button onClick={handleImportClick} disabled={isImporting} className="mt-2">
            {isImporting ? 'Importing...' : 'Import Data'}
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".json"
          />
        </div>
      </CardContent>
    </Card>
  );
};
