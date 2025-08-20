'use client';

import * as React from 'react';

import { DoorClosed, DoorOpen } from 'lucide-react';

import { Badge } from '~/shared/shadcn/badge';
import { ToggleGroup, ToggleGroupItem } from '~/shared/shadcn/toggle-group';

type StoreStatusType = 'open' | 'closed';

export function StoreStatus() {
  const [status, setStatus] = React.useState<StoreStatusType>('open');
  const [openTime, setOpenTime] = React.useState('07:00');
  const [closeTime, setCloseTime] = React.useState('23:59');

  const updateBackend = async (
    nextStatus: StoreStatusType,
    nextOpen: string,
    nextClose: string
  ) => {
    await fetch('/api/store-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storeStatus: nextStatus,
        storeOpenTime: nextOpen,
        storeCloseTime: nextClose
      })
    });
  };

  const handleStatusChange = (next: StoreStatusType) => {
    setStatus(next);
    updateBackend(next, openTime, closeTime);
  };

  const handleTimeChange = (type: 'open' | 'close', value: string) => {
    if (type === 'open') {
      setOpenTime(value);
      updateBackend(status, value, closeTime);
    } else {
      setCloseTime(value);
      updateBackend(status, openTime, value);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border p-3 sm:p-4">
      {/* Status Toggle */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium sm:text-base">Mark Store</span>
          <Badge
            className={`uppercase ${
              status === 'open' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
            {status}
          </Badge>
        </div>

        <ToggleGroup
          type="single"
          value={status}
          onValueChange={(v) => v && handleStatusChange(v as StoreStatusType)}
          className="grid grid-cols-2 rounded-xl p-1">
          <ToggleGroupItem
            value="open"
            aria-label="Set store open"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm data-[state=on]:shadow sm:px-4 sm:py-2.5">
            <DoorOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Open</span>
          </ToggleGroupItem>

          <ToggleGroupItem
            value="closed"
            aria-label="Set store closed"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm data-[state=on]:shadow sm:px-4 sm:py-2.5">
            <DoorClosed className="h-4 w-4" />
            <span className="hidden sm:inline">Closed</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Time Picker */}
      <div className="flex items-end gap-4">
        {/* From Time */}
        <label className="flex flex-1 cursor-pointer flex-col">
          <span className="text-muted-foreground mb-1 text-sm font-medium">From:</span>
          <div className="group focus-within:border-primary focus-within:ring-primary/30 hover:border-primary flex w-full items-center justify-between rounded-xl border bg-white px-3 py-2 shadow-sm transition focus-within:ring-2">
            <input
              type="time"
              value={openTime}
              onChange={(e) => handleTimeChange('open', e.target.value)}
              className="w-fit cursor-pointer border-none bg-transparent text-sm font-medium text-black focus:outline-none"
            />
            <span className="ml-3 rounded-md text-xs font-medium text-gray-600 select-none group-hover:bg-gray-100 sm:px-2 sm:py-1">
              AM
            </span>
          </div>
        </label>

        {/* Till Time */}
        <label className="flex flex-1 cursor-pointer flex-col">
          <span className="text-muted-foreground mb-1 text-sm font-medium">Till:</span>
          <div className="group focus-within:border-primary focus-within:ring-primary/30 hover:border-primary flex w-full items-center justify-between rounded-xl border bg-white px-3 py-2 shadow-sm transition focus-within:ring-2">
            <input
              type="time"
              value={closeTime}
              onChange={(e) => handleTimeChange('close', e.target.value)}
              className="w-fit cursor-pointer border-none bg-transparent text-sm font-medium text-black focus:outline-none"
            />
            <span className="ml-3 rounded-md text-xs font-medium text-gray-600 select-none group-hover:bg-gray-100 sm:px-2 sm:py-1">
              PM
            </span>
          </div>
        </label>
      </div>
    </div>
  );
}
