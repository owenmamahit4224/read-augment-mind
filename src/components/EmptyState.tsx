
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  message: string;
}

const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
