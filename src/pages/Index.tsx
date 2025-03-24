
import React from 'react';
import ResourceTimelineCalendar from '../components/ResourceTimelineCalendar';
import { Badge } from "@/components/ui/badge";

const Index = () => {
  return (
    <div className="min-h-screen bg-background px-6 py-8 md:px-10 md:py-12 lg:px-12 lg:py-16 animate-in fade-in duration-500">
      <header className="mb-10 max-w-4xl mx-auto">
        <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-none">Resource Timeline</Badge>
        <h1 className="text-4xl font-bold tracking-tight mb-3">Resource Scheduler</h1>
        <p className="text-muted-foreground text-lg max-w-prose">
          A minimalist, elegant resource timeline calendar for managing your scheduling needs with precision and simplicity.
        </p>
      </header>
      
      <main className="max-w-7xl mx-auto">
        <ResourceTimelineCalendar className="w-full" />
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-card rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-2">Intuitive Interface</h3>
            <p className="text-muted-foreground">
              Clean, distraction-free timeline view that highlights what matters most.
            </p>
          </div>
          
          <div className="p-6 bg-card rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-2">Resource Management</h3>
            <p className="text-muted-foreground">
              Easily organize and visualize resources across time with precision.
            </p>
          </div>
          
          <div className="p-6 bg-card rounded-lg shadow-sm border">
            <h3 className="text-lg font-medium mb-2">Responsive Design</h3>
            <p className="text-muted-foreground">
              Perfectly adapts to any screen size without compromising functionality.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
