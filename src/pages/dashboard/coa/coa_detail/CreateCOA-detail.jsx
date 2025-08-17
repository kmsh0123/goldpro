import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon, Check } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

const codes = [
  { value: "R", label: "IT0001" },
  { value: "G", label: "IT0002" },
  { value: "D", label: "IT0003" },
  { value: "E", label: "IT0004" },
  { value: "F", label: "IT0005" },
  { value: "I", label: "IT0006" },
  { value: "J", label: "IT0007" },
  { value: "K", label: "IT0008" },
  { value: "L", label: "IT0009" },
  { value: "N", label: "IT0010" },
  { value: "M", label: "IT0011" },
  { value: "O", label: "IT0012" },
  { value: "Q", label: "IT0013" },
  { value: "H", label: "IT0014" },
  { value: "A", label: "IT0015" },
  { value: "B", label: "IT0016" },
  { value: "C", label: "IT0017" },
  { value: "Z", label: "IT0018" },
  { value: "X", label: "IT0019" },
  { value: "Y", label: "IT0020" },
];

const CreateCOADetail = () => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setName("")
    setCode("")
    setDescription("")
    console.log({ code, name,description });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        Create Category
      </h1>

      <div className="border-b-2"></div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xs">
        {/* Code Searchable Select */}
        <div>
          <label className="block mb-1 font-medium">Code</label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <div className="w-full">
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {code
                    ? codes.find((item) => item.value === code)?.label
                    : "Select Code"}
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 ">
              <Command>
                <CommandInput placeholder="Search code..." />
                <CommandEmpty>No code found.</CommandEmpty>
                <CommandList className="max-h-40 overflow-y-auto">
                  <CommandGroup>
                    {codes.map((item) => (
                      <CommandItem
                        key={item.value}
                        value={item.label}
                        onSelect={() => {
                          setCode(item.value);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            code === item.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {item.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Name Input */}
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <Input
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-100"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <Input
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-gray-100"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-2">
          <Button
            type="button"
            variant="outline"
            className="bg-gray-100 text-gray-700"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateCOADetail;
