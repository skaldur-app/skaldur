"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useImprovementOptions } from "@/hooks/useImprovementOptions";

interface ImprovementSelectorsProps {
  selectedTypeId: string;
  selectedStyle: string;
  onTypeChange: (type: string) => void;
  onStyleChange: (style: string) => void;
  disabled: boolean;
}

export function ImprovementSelectors({
  selectedTypeId,
  selectedStyle,
  onTypeChange,
  onStyleChange,
  disabled
}: ImprovementSelectorsProps) {
  const { options, loading } = useImprovementOptions();
  
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Select
        value={selectedTypeId}
        onValueChange={onTypeChange}
        disabled={disabled || loading || !options}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select improvement type" />
        </SelectTrigger>
        <SelectContent>
          {options?.types.map((type) => (
            <SelectItem key={type.id} value={type.id}>
              <div className="flex items-center">
                <span className="mr-2">{type.icon}</span>
                <span>{type.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select
        value={selectedStyle}
        onValueChange={onStyleChange}
        disabled={disabled || loading || !options}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select style" />
        </SelectTrigger>
        <SelectContent>
          {options?.styles.map((style) => (
            <SelectItem key={style} value={style}>
              {style}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}