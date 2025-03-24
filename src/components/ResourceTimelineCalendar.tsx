
import React, { useRef, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import { EventInput, ResourceInput } from '@fullcalendar/core';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Sample resources data
const sampleResources: ResourceInput[] = [
  { id: 'a', title: 'Room A', eventColor: 'hsl(var(--primary))' },
  { id: 'b', title: 'Room B', eventColor: 'hsl(120, 70%, 50%)' },
  { id: 'c', title: 'Room C', eventColor: 'hsl(48, 95%, 60%)' },
  { id: 'd', title: 'Room D', eventColor: 'hsl(280, 70%, 60%)' },
  { id: 'e', title: 'Room E', eventColor: 'hsl(200, 70%, 50%)' },
];

// Sample events data
const sampleEvents: EventInput[] = [
  { id: '1', resourceId: 'a', title: 'Meeting with Design Team', start: '2023-06-01T09:00:00', end: '2023-06-01T10:30:00' },
  { id: '2', resourceId: 'b', title: 'Product Strategy Review', start: '2023-06-01T11:00:00', end: '2023-06-01T13:00:00' },
  { id: '3', resourceId: 'c', title: 'Client Presentation', start: '2023-06-01T14:00:00', end: '2023-06-01T15:30:00' },
  { id: '4', resourceId: 'd', title: 'Team Building Workshop', start: '2023-06-01T16:00:00', end: '2023-06-01T17:30:00' },
  { id: '5', resourceId: 'e', title: 'Project Planning', start: '2023-06-02T09:00:00', end: '2023-06-02T11:00:00' },
  { id: '6', resourceId: 'a', title: 'Quarterly Review', start: '2023-06-02T13:00:00', end: '2023-06-02T14:30:00' },
  { id: '7', resourceId: 'b', title: 'Development Sprint Planning', start: '2023-06-03T10:00:00', end: '2023-06-03T12:00:00' },
  { id: '8', resourceId: 'c', title: 'Stakeholder Meeting', start: '2023-06-03T15:00:00', end: '2023-06-03T16:00:00' },
];

interface ResourceTimelineCalendarProps {
  className?: string;
}

const ResourceTimelineCalendar: React.FC<ResourceTimelineCalendarProps> = ({ className }) => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [resources, setResources] = useState<ResourceInput[]>([]);
  const [events, setEvents] = useState<EventInput[]>([]);
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setResources(sampleResources);
      
      // Set events to start from the current date
      const today = new Date();
      const adjustedEvents = sampleEvents.map(event => {
        const originalStart = new Date(event.start as string);
        const originalEnd = new Date(event.end as string);
        const dayDiff = originalEnd.getDate() - originalStart.getDate();
        
        const newStart = new Date(today);
        newStart.setHours(originalStart.getHours(), originalStart.getMinutes());
        
        const newEnd = new Date(today);
        if (dayDiff > 0) {
          newEnd.setDate(newEnd.getDate() + dayDiff);
        }
        newEnd.setHours(originalEnd.getHours(), originalEnd.getMinutes());
        
        return {
          ...event,
          start: newStart.toISOString(),
          end: newEnd.toISOString()
        };
      });
      
      setEvents(adjustedEvents);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleDateSet = (dateInfo: any) => {
    setCurrentDate(dateInfo.view.currentStart);
  };
  
  if (isLoading) {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <Skeleton className="h-8 w-64 mb-2" />
            <div className="flex space-x-4">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
          <div className="p-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex border-b p-3">
                <Skeleton className="h-6 w-24 mr-4" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={`overflow-hidden shadow-sm calendar-appear ${className}`}>
      <CardContent className="p-0">
        <div className="calendar-container" style={{ height: '70vh' }}>
          <FullCalendar
            ref={calendarRef}
            plugins={[resourceTimelinePlugin]}
            initialView="resourceTimelineWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth'
            }}
            resources={resources}
            events={events}
            resourceAreaHeaderContent="Resources"
            slotMinWidth={100}
            resourceAreaWidth="15%"
            height="100%"
            nowIndicator={true}
            allDaySlot={false}
            slotDuration="00:30:00"
            slotLabelInterval="01:00:00"
            datesSet={handleDateSet}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              meridiem: false,
              hour12: false
            }}
            resourceLabelDidMount={(info) => {
              // Apply animation to resources
              const resourceElement = info.el;
              resourceElement.classList.add('resource-appear');
              resourceElement.style.animationDelay = `${info.resource.index * 0.05}s`;
            }}
            eventDidMount={(info) => {
              // Add tooltips and styles to events
              const eventElement = info.el;
              
              // Create a tooltip
              eventElement.setAttribute('title', 
                `${info.event.title}\n${info.event.start?.toLocaleTimeString()} - ${info.event.end?.toLocaleTimeString()}`
              );
              
              // Style based on event's resource
              const resourceId = info.event.getResources()[0]?.id;
              const resourceIndex = sampleResources.findIndex(r => r.id === resourceId);
              
              // Apply animation
              eventElement.style.animationDelay = `${(resourceIndex + 1) * 0.1}s`;
              eventElement.classList.add('resource-appear');
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceTimelineCalendar;
