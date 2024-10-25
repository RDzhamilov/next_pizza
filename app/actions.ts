"use server";

import { prisma } from "@/prisma/prisma-client";
import { PayOrderTemplate } from "@/shared/components";
import { VerificationUserTemplate } from "@/shared/components/shared/email-templates/verification-user";
import { CheckoutFormValues } from "@/shared/constants";
import { createPayment, sendEmail } from "@/shared/lib";
import { getUserSession } from "@/shared/lib/get-user-session";
import { OrderStatus, Prisma } from "@prisma/client";
import { hashSync } from "bcrypt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { redirect } from "next/navigation";
import { set } from "react-hook-form";

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
    const paymentUrl = process.env.PAID_CALLBACK_URL || "http://localhost:3000/?paid";

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

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
  try {
    const currentUser = await getUserSession();

    if (!currentUser) {
      throw new Error("Пользователь не найден");
    }

    const findUser = await prisma.user.findFirst({
      where: {
        id: Number(currentUser.id),
      },
    });

    await prisma.user.update({
      where: {
        id: Number(currentUser.id),
      },
      data: {
        fullName: body.fullName,
        email: body.email,
        password: body.password ? hashSync(body.password as string, 10) : findUser?.password,
      },
    });
  } catch (error) {
    console.log("Error [UPDATE_USER]", error);
    throw error;
  }
}

export async function registerUser(body: Prisma.UserCreateInput) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (user) {
      if (!user.verified) {
        throw new Error("Почта не подтверждена");
      }
      throw new Error("Пользователь уже существует");
    }

    const createUser = await prisma.user.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        password: hashSync(body.password, 10),
      },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.verificationCode.create({
      data: {
        code,
        userId: createUser.id,
      },
    });

    // await sendEmail(
    //   createUser.email,
    //   "Next Pizza | Подтверждение регистрации",
    //   VerificationUserTemplate({
    //     code,
    //   })
    // );

    // redirect(`http://localhost:3000/api/auth/verify?code=${code}`);

    // const code = req.nextUrl.searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Неверный код" }, { status: 400 });
    }

    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        code,
      },
    });

    if (!verificationCode) {
      return NextResponse.json({ error: "Неверный код" }, { status: 400 });
    }

    await prisma.user.update({
      where: {
        id: verificationCode.userId,
      },
      data: {
        verified: new Date(),
      },
    });

    await prisma.verificationCode.delete({
      where: {
        id: verificationCode.id,
      },
    });

    const verifiedUrl = process.env.VERIFIED_CALLBACK_URL || "http://localhost:3000/?verified";

    return verifiedUrl;
  } catch (error) {
    console.log("Error [REGISTER_USER]", error);
    throw error;
  }
}
