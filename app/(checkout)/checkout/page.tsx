"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/shared/hooks";
import {
  CheckoutSidebar,
  Container,
  Title,
  CheckoutAddressForm,
  CheckoutCart,
  CheckoutPersonalForm,
} from "@/shared/components";
import { checkoutFormSchema, CheckoutFormValues } from "@/shared/constants";
import { createOrder } from "@/app/actions";
import React, { Suspense } from "react";
import { useSession } from "next-auth/react";
import { Api } from "@/shared/services/api-client";
import { ErrorCustomToast, SuccessCustomToast } from "@/shared/services/toastService";

export default function CheckoutPage() {
  const [submitting, setSubmitting] = React.useState(false);
  const { totalAmount, updateItemQuantity, items, removeCartItem, loading } = useCart();
  const { data: session } = useSession();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      comment: "",
    },
  });

  //TODO я добавил проверку на сессию и получение информации о пользователе - ошибка не прошла
  React.useEffect(() => {
    async function fetchUserInfo() {
      try {
        if (!session) {
          console.log("Сессия не существует");
          return;
        }

        const data = await Api.auth.getMe();

        if (!data?.email || !data?.fullName) {
          return;
        }

        const [firstName, lastName] = data.fullName.split(" ");

        form.setValue("firstName", firstName || "");
        form.setValue("lastName", lastName || "");
        form.setValue("email", data.email || "");
      } catch (error) {
        console.error("Ошибка при получении информации о пользователе:", error);
      }
    }

    if (session) {
      fetchUserInfo();
    }
  }, [session, form]);

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      setSubmitting(true);

      const url = await createOrder(data);

      SuccessCustomToast({
        message: "Order successfully placed! 📝 Proceeding to payment...",
        withIcon: true,
      });

      setTimeout(() => {
        if (typeof url === "string") {
          location.href = url;
        } else {
          console.error("URL is not a valid string:", url);
        }
      }, 3000);
    } catch (err) {
      console.log(err);
      setSubmitting(false);

      ErrorCustomToast({
        message: "Failed to create the order",
        withIcon: true,
      });
    }
  };

  const onClickCountButton = (id: number, quantity: number, type: "plus" | "minus") => {
    const newQuantity = type === "plus" ? quantity + 1 : quantity - 1;
    updateItemQuantity(id, newQuantity);
  };

  return (
    <Container className="mt-10">
      <Title text="Order checkout" className="font-extrabold mb-8 text-[36px]" />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-10">
            {/* Левая часть */}
            <div className="flex flex-col gap-10 flex-1 mb-20">
              <Suspense>
                <CheckoutCart
                  onClickCountButton={onClickCountButton}
                  removeCartItem={removeCartItem}
                  items={items}
                  loading={loading}
                />
              </Suspense>

              <Suspense>
                <CheckoutPersonalForm className={loading ? "opacity-40 pointer-events-none" : ""} />
              </Suspense>

              <Suspense>
                <CheckoutAddressForm className={loading ? "opacity-40 pointer-events-none" : ""} />
              </Suspense>
            </div>

            {/* Правая часть */}
            <div className="w-[450px]">
              <CheckoutSidebar totalAmount={totalAmount} loading={loading || submitting} />
            </div>
          </div>
        </form>
      </FormProvider>
    </Container>
  );
}
