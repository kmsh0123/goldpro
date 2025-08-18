import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon, Check } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useCreateCoaMutation } from "@/feature/api/coaApi/coaApi";
import { useForm } from 'react-hook-form';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



const EditCOA = () => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const [coaCreate] = useCreateCoaMutation();

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm();

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setName("")
  //   setCode("")
  //   setDescription("")
  //   console.log({ code, name,description });
  // };

  const handleCreateCoa = async (formData) => {
  try {
    const {data} = await coaCreate(formData);
    console.log("COA created successfully:", data);
    toast.success("COA created successfully!");
    reset();
    nav("/coa/coa-list");
  } catch (error) {
    console.error("Error create customer");
  } 
}


  return (
    <div className="space-y-4">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Header */}
      <h1 className="flex items-center gap-2 text-xl font-semibold text-yellow-600 mt-5 mb-5">
        <span onClick={() => window.history.back()} className="cursor-pointer">
          <ChevronLeftIcon />
        </span>
        Edit Charts of Accounts
      </h1>

      <div className="border-b-2"></div>

      <form onSubmit={handleSubmit(handleCreateCoa)} className="space-y-6 max-w-xs">
        {/* Code Searchable Select */}
        <div>
          <label className="block mb-1 font-medium">Code</label>
          {/* <Popover open={open} onOpenChange={setOpen}>
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
          </Popover> */}
           <Input
            placeholder="Enter Code"
            {...register("code")}
            // value={code}
            // onChange={(e) => setCode(e.target.value)}
            className="bg-gray-100"
          />
        </div>

        {/* Name Input */}
        <div>
          <label className="block mb-1 font-medium">Type</label>
          <Input
            placeholder="Enter Type"
            {...register("type")} 
            // value={name}
            // onChange={(e) => setName(e.target.value)}
            className="bg-gray-100"
          />
        </div>

         {/* <div>
          <label className="block mb-1 font-medium">Description</label>
          <Input
            placeholder="Enter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-gray-100"
          />
        </div> */}

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

export default EditCOA;
