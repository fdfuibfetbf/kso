'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Input } from './input';
import { Label } from './label';

interface AutocompleteInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onAddNew?: (value: string) => Promise<void>;
  options: string[];
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function AutocompleteInput({
  id,
  label,
  value,
  onChange,
  onAddNew,
  options,
  placeholder,
  className = '',
  required = false,
  disabled = false,
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState(value);
  const [isAdding, setIsAdding] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter((opt) =>
        opt.toLowerCase().includes(inputValue.toLowerCase())
      );
      // If the exact value doesn't exist and user typed something, show option to add it
      if (!options.includes(inputValue) && inputValue.trim() !== '') {
        setFilteredOptions([...filtered, `+ Add "${inputValue}"`]);
      } else {
        setFilteredOptions(filtered);
      }
    }
  }, [inputValue, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleSelectOption = async (option: string) => {
    if (option.startsWith('+ Add "')) {
      // Extract the value to add
      const newValue = option.replace('+ Add "', '').replace('"', '');
      if (onAddNew && newValue.trim()) {
        setIsAdding(true);
        try {
          await onAddNew(newValue.trim());
          setInputValue(newValue.trim());
          onChange(newValue.trim());
        } catch (error) {
          console.error('Failed to add new value:', error);
        } finally {
          setIsAdding(false);
        }
      }
    } else {
      setInputValue(option);
      onChange(option);
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim() && !options.includes(inputValue.trim())) {
        // Add new value on Enter
        if (onAddNew) {
          setIsAdding(true);
          onAddNew(inputValue.trim())
            .then(() => {
              setInputValue(inputValue.trim());
              onChange(inputValue.trim());
            })
            .catch((error) => {
              console.error('Failed to add new value:', error);
            })
            .finally(() => {
              setIsAdding(false);
            });
        }
      }
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      // Could implement keyboard navigation here if needed
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  return (
    <div className={`space-y-2 relative ${className}`} ref={wrapperRef}>
      <Label htmlFor={id} className="text-sm font-semibold text-gray-700 block h-5 flex items-center">
        {label} {required && <span className="text-red-500 font-bold ml-1">*</span>}
      </Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          required={required}
          disabled={disabled || isAdding}
          className="border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 h-11"
        />
        {isAdding && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <svg className="animate-spin h-4 w-4 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
        {isOpen && filteredOptions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                onClick={() => handleSelectOption(option)}
                className={`px-4 py-2 cursor-pointer hover:bg-primary-50 ${
                  option.startsWith('+ Add "') ? 'text-primary-600 font-medium border-t border-gray-200' : 'text-gray-900'
                }`}
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
