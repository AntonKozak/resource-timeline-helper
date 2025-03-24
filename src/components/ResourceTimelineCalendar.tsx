
import React, { useRef, useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventInput } from '@fullcalendar/core';
import { ResourceApi } from '@fullcalendar/resource';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { Skeleton } from '@/components/ui/skeleton';

// Sample resources data
const sampleResources = [
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

interface EventFormData {
  title: string;
  resourceId: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}

const ResourceTimelineCalendar: React.FC<ResourceTimelineCalendarProps> = ({ className }) => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [resources, setResources] = useState(sampleResources);
  const [events, setEvents] = useState<EventInput[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const form = useForm<EventFormData>({
    defaultValues: {
      title: '',
      resourceId: '',
      startDate: new Date().toISOString().split('T')[0],
      startTime: '09:00',
      endDate: new Date().toISOString().split('T')[0],
      endTime: '10:00'
    }
  });
  
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
  
  const handleAddEvent = (data: EventFormData) => {
    const startDateTime = `${data.startDate}T${data.startTime}:00`;
    const endDateTime = `${data.endDate}T${data.endTime}:00`;
    
    // Validate end time is after start time
    if (new Date(endDateTime) <= new Date(startDateTime)) {
      toast.error("End time must be after start time");
      return;
    }
    
    const newEvent: EventInput = {
      id: `event-${Date.now()}`,
      title: data.title,
      resourceId: data.resourceId,
      start: startDateTime,
      end: endDateTime
    };
    
    setEvents(prevEvents => [...prevEvents, newEvent]);
    toast.success("Event added successfully");
    setIsDialogOpen(false);
    form.reset();
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
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Resource Timeline</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddEvent)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Meeting title" {...field} required />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="resourceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resource</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        required
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a resource" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {resources.map(resource => (
                            <SelectItem key={resource.id} value={resource.id}>
                              {resource.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Add Event
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className={`overflow-hidden shadow-sm calendar-appear ${className}`}>
        <CardContent className="p-0">
          <div className="calendar-container" style={{ height: '70vh' }}>
            <FullCalendar
              ref={calendarRef}
              plugins={[resourceTimelinePlugin, timeGridPlugin, dayGridPlugin]}
              initialView="resourceTimelineWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth,timeGridWeek,dayGridMonth'
              }}
              resources={resources}
              events={events}
              resourceAreaHeaderContent="Resources"
              slotMinWidth={100}
              resourceAreaWidth="15%"
              height="100%"
              nowIndicator={true}
              slotDuration="01:00:00"
              slotLabelInterval="01:00:00"
              datesSet={handleDateSet}
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false,
                hour12: false
              }}
              views={{
                timeGridWeek: {
                  // Time grid week view settings
                  titleFormat: { year: 'numeric', month: 'short', day: 'numeric' }
                },
                dayGridMonth: {
                  // Month view settings
                  titleFormat: { year: 'numeric', month: 'long' }
                }
              }}
              resourceLabelDidMount={(info) => {
                // Apply animation to resources
                const resourceElement = info.el;
                resourceElement.classList.add('resource-appear');
                resourceElement.style.animationDelay = `${parseInt(info.resource.id.replace(/\D/g, '0'), 10) * 0.05}s`;
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
    </>
  );
};

export default ResourceTimelineCalendar;
