import React, { useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

interface Option {
  label: string;
  value: string;
}

interface Props {
  onChange?: (address: string) => void;
}

export const AddressInput: React.FC<Props> = ({ onChange }) => {
  const [value, setValue] = useState<Option | null>(null);

  return (
    <GooglePlacesAutocomplete
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
      selectProps={{
        value,
        onChange: (newValue: Option | null) => {
          setValue(newValue);
          if (onChange && newValue) {
            onChange(newValue.label);
          }
        },

        placeholder: "Enter the address",

        styles: {
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? "blue" : "grey",
            borderRadius: "10px",
            boxShadow: state.isFocused ? "0 0 5px rgba(0, 0, 255, 0.5)" : "none",
          }),
          menu: (base) => ({
            ...base,
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected ? "lightblue" : "transparent",
            color: state.isSelected ? "darkblue" : "black",
            padding: "10px",
          }),
        },
      }}
    />
  );
};
