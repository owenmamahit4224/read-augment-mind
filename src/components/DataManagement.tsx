import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { exportData, importData, mergeData, MergeStats } from '@/services/dataService';
import { MergePreviewDialog } from './MergePreviewDialog';

export const DataManagement: React.FC = () => {
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeStats, setMergeStats] = useState<MergeStats | null>(null);
  const [filesToMerge, setFilesToMerge] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mergeFileInputRef = useRef<HTMLInputElement>(null);

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

  const handleMergeClick = () => {
    mergeFileInputRef.current?.click();
  };

  const handleMergeFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    setFilesToMerge(fileList);

    // For simplicity, we'll generate preview stats from the first file.
    // A more advanced implementation might process all files for a more accurate preview.
    try {
      const fileContent = await fileList[0].text();
      const data = JSON.parse(fileContent);
      const stats = await mergeData(fileList);
      setMergeStats(stats);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to read or parse file for preview.',
        variant: 'destructive',
      });
    }
  };

  const handleMergeConfirm = async () => {
    if (filesToMerge.length === 0) return;

    setIsMerging(true);
    setMergeStats(null);
    try {
      await mergeData(filesToMerge);
      toast({
        title: 'Success',
        description: 'Data merged successfully. Please refresh the page to see the changes.',
      });
    } catch (error) {
      console.error('Merge failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to merge data.',
        variant: 'destructive',
      });
    } finally {
      setIsMerging(false);
      setFilesToMerge([]);
      if (mergeFileInputRef.current) {
        mergeFileInputRef.current.value = '';
      }
    }
  };

  const handleMergeCancel = () => {
    setMergeStats(null);
    setFilesToMerge([]);
    if (mergeFileInputRef.current) {
      mergeFileInputRef.current.value = '';
    }
  };

  return (
    <>
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
          <div>
            <h3 className="font-semibold">Merge Backups</h3>
            <p className="text-sm text-muted-foreground">
              Merge data from one or more backup files with your existing data.
            </p>
            <Button onClick={handleMergeClick} disabled={isMerging} className="mt-2">
              {isMerging ? 'Merging...' : 'Merge Backups'}
            </Button>
            <input
              type="file"
              ref={mergeFileInputRef}
              onChange={handleMergeFileChange}
              className="hidden"
              accept=".json"
              multiple
            />
          </div>
        </CardContent>
      </Card>
      <MergePreviewDialog
        open={!!mergeStats}
        stats={mergeStats}
        onConfirm={handleMergeConfirm}
        onCancel={handleMergeCancel}
      />
    </>
  );
};
