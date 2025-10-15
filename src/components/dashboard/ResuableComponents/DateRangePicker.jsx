import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarDays, XCircle } from "lucide-react";

/**
 * Reusable Date Range Picker Component (Auto Fetch)
 *
 * Props:
 *  - label?: string
 *  - onChange: (range: { from: string, to: string }) => void
 *  - defaultFrom?: Date
 *  - defaultTo?: Date
 */

export default function DateRangePicker({
  label = "Select Date Range",
  onChange,
  defaultFrom = null,
  defaultTo = null,
}) {
  const [fromDate, setFromDate] = useState(defaultFrom);
  const [endDate, setEndDate] = useState(defaultTo);
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  // 👇 Auto fetch whenever both dates are selected
  useEffect(() => {
    if (fromDate && endDate) {
      onChange({
        from: format(fromDate, "yyyy-MM-dd"),
        to: format(endDate, "yyyy-MM-dd"),
      });
    } else if (!fromDate && !endDate) {
      // if both cleared, notify parent to reset data
      onChange(null);
    }
  }, [fromDate, endDate]);

  const handleClear = () => {
    setFromDate(null);
    setEndDate(null);
    onChange(null);
  };
  
  return (
    <div className="flex items-center gap-3">
      {/* From Date */}
      <div className="flex flex-col space-y-1">
        <Popover open={openFrom} onOpenChange={setOpenFrom}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal"
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              {fromDate ? format(fromDate, "PPP") : "From Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Calendar
              mode="single"
              selected={fromDate}
              onSelect={(date) => {
                setFromDate(date);
                if (endDate && date > endDate) setEndDate(null);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* To Date */}
      <div className="flex flex-col space-y-1">
        <Popover open={openTo} onOpenChange={setOpenTo}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal"
              disabled={!fromDate}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : "End Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              disabled={(date) => fromDate && date < fromDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* 🧹 Clear Button */}
      {(fromDate || endDate) && (
        <Button
          variant="ghost"
          className="text-red-500 hover:text-red-600"
          onClick={handleClear}
          title="Clear date filter"
        >
          <XCircle className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
