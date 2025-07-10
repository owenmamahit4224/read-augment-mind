import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MergeStats } from '@/services/dataService';

interface MergePreviewDialogProps {
  open: boolean;
  stats: MergeStats | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const MergePreviewDialog: React.FC<MergePreviewDialogProps> = ({ open, stats, onConfirm, onCancel }) => {
  if (!stats) return null;

  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Merge Preview</AlertDialogTitle>
          <AlertDialogDescription>
            Review the changes before merging the data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <p><strong>Articles:</strong> {stats.newArticles} new, {stats.updatedArticles} updated.</p>
          <p><strong>Knowledge Profile Entries:</strong> {stats.newKnowledgeEntries} new, {stats.updatedKnowledgeEntries} updated.</p>
          <p><strong>Study List Entries:</strong> {stats.newStudyListEntries} new, {stats.updatedStudyListEntries} updated.</p>
          <p><strong>Vocabulary Entries:</strong> {stats.newVocabularyEntries} new, {stats.updatedVocabularyEntries} updated.</p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm Merge</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
