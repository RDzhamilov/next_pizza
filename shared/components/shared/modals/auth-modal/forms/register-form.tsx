"use client";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "@/app/actions";
import { TFormRegisterValue, formRegisterSchema } from "./schemas";
import { FormInput } from "../../../form";
import { Button } from "@/shared/components/ui";
import { ErrorCustomToast, SuccessCustomToast } from "@/shared/services/toastService";

interface Props {
  onClose?: VoidFunction;
  onClickLogin?: VoidFunction;
}

export const RegisterForm: React.FC<Props> = ({ onClose }) => {
  const form = useForm<TFormRegisterValue>({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: TFormRegisterValue) => {
    try {
      const url = await registerUser({
        email: data.email,
        fullName: data.fullName,
        password: data.password,
      });

      SuccessCustomToast({ message: "Регистрация успешна 📝. Подтвердите свою почту", withIcon: true });

      setTimeout(() => {
        onClose?.();
      }, 2000);

      setTimeout(() => {
        if (typeof url === "string") {
          location.href = url;
        } else {
          console.error("URL is not a valid string:", url);
        }
      }, 3000);
    } catch (error) {
      return ErrorCustomToast({ message: "Неверный E-Mail или пароль", withIcon: true });
    }
  };

  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-5" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInput name="email" label="E-Mail" required />
        <FormInput name="fullName" label="Полное имя" required />
        <FormInput name="password" label="Пароль" type="password" required />
        <FormInput name="confirmPassword" label="Подтвердите пароль" type="password" required />

        <Button loading={form.formState.isSubmitting} className="h-12 text-base" type="submit">
          Зарегистрироваться
        </Button>
      </form>
    </FormProvider>
  );
};
