"use client";

import React from "react";
import { WhiteBlock } from "../white-block";
import { FormTextarea } from "../form";
import { AddressInput } from "../address-input";
import { Controller, useFormContext } from "react-hook-form";
import { ErrorText } from "../error-text";

interface Props {
  className?: string;
}

export const CheckoutAddressForm = ({ className }: Props) => {
  const { control } = useFormContext();

  return (
    <WhiteBlock title="3. Delivery address" className={className}>
      <div className="flex flex-col gap-5">
        <Controller
          control={control}
          name="address"
          render={({ field, fieldState }) => (
            <>
             {/* TODO где-то тут ошибки */}
              <AddressInput onChange={field.onChange} />
              {fieldState.error?.message && <ErrorText text={fieldState.error.message} />}
            </>
          )}
        />

        <FormTextarea name="comment" className="text-base" placeholder="Order comments" rows={5} />
      </div>
    </WhiteBlock>
  );
};
