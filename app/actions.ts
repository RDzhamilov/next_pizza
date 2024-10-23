"use server";

import { prisma } from "@/prisma/prisma-client";
import { PayOrderTemplate } from "@/shared/components";
import { CheckoutFormValues } from "@/shared/constants";
import { createPayment, sendEmail } from "@/shared/lib";
import { OrderStatus } from "@prisma/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function createOrder(data: CheckoutFormValues) {
  try {
    const cookiesStore = cookies();
    const cartToken = cookiesStore.get("cartToken")?.value;

    if (!cartToken) {
      throw new Error("Cart token not found");
    }

    /* Находим корзину по токену */
    const userCart = await prisma.cart.findFirst({
      include: {
        user: true,
        items: {
          include: {
            ingredients: true,
            productItem: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      where: {
        token: cartToken,
      },
    });

    /* Если корзина не найдена возвращаем ошибку */
    if (!userCart) {
      throw new Error("Cart not found");
    }

    /* Если корзина пустая возвращаем ошибку */
    if (userCart?.totalAmount === 0) {
      throw new Error("Cart is empty");
    }

    /* Создаем заказ */
    const order = await prisma.order.create({
      data: {
        token: cartToken,
        fullName: data.firstName + " " + data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        comment: data.comment,
        totalAmount: userCart.totalAmount,
        status: OrderStatus.PENDING,
        items: JSON.stringify(userCart.items),
      },
    });

    /* Очищаем корзину */
    await prisma.cart.update({
      where: {
        id: userCart.id,
      },
      data: {
        totalAmount: 0,
      },
    });

    await prisma.cartItem.deleteMany({
      where: {
        cartId: userCart.id,
      },
    });

    /* Создаем платеж */
    // const paymentData = await createPayment({
    //   amount: order.totalAmount,
    //   orderId: order.id,
    //   description: "Оплата заказа #" + order.id,
    // });

    // if (!paymentData) {
    //   throw new Error("Payment data not found");
    // }

    const paymentId = `PAYMENT_${order.id}`;

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        paymentId: paymentId,
      },
    });

    const orderBD = await prisma.order.findFirst({
      where: { paymentId: paymentId },
    });

    if (!orderBD) {
      return NextResponse.json({ error: "Order not found" });
    }

    await prisma.order.update({
      where: {
        id: orderBD.id,
      },
      data: {
        status: OrderStatus.SUCCEEDED,
      },
    });

    /* Отправляем письмо */
    const paymentUrl = process.env.YOOKASSA_CALLBACK_URL || "http://localhost:3000/?paid";

    // const paymentUrl = paymentData.confirmation.confirmation_url;

    // await sendEmail(
    //   data.email,
    //   "Next Pizza / Оплатите заказ #" + order.id,
    //   PayOrderTemplate({
    //     orderId: order.id,
    //     totalAmount: order.totalAmount,
    //     paymentUrl,
    //   })
    // );

    return paymentUrl;
  } catch (error) {
    console.log("[CreateOrder] Server error", error);
  }
}
