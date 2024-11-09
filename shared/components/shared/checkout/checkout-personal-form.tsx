import React from "react";
import { WhiteBlock } from "../white-block";
import { FormInput } from "../form";

interface Props {
  className?: string;
}

export const CheckoutPersonalForm: React.FC<Props> = ({ className }) => {
  return (
    <WhiteBlock title="2. Personal information" className={className}>
      <div className="grid grid-cols-2 gap-5">
        <FormInput name="firstName" className="text-base" placeholder="First name" />
        <FormInput name="lastName" className="text-base" placeholder="Last name" />
        <FormInput name="email" className="text-base" placeholder="E-mail" />
        <FormInput name="phone" className="text-base" placeholder="Phone number" />
      </div>
    </WhiteBlock>
  );
};
