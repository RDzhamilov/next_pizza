import { PaymentCallbackData } from "@/@types/yookassa";
import { prisma } from "@/prisma/prisma-client";
import { OrderSuccessTemplate } from "@/shared/components/shared/email-templates/order-success";
import { sendEmail } from "@/shared/lib";
import { CartItemDTO } from "@/shared/services/dto/cart.dto";
import { OrderStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const orderId = Number(body.metadata.order_id);

    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" });
    }

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: OrderStatus.SUCCEEDED,
      },
    });

    const responseData = {
      success: true,
      message: "Order updated successfully.",
      description: body.description,
      metadata: {
        order_id: order.id,
      },
      confirmation: {
        return_url: process.env.YOOKASSA_CALLBACK_URL,
      },
    };

    // const items = JSON.parse(order?.items as string) as CartItemDTO[];
    // await sendEmail(
    //   order.email,
    //   "Next Pizza | Ваш заказ успешно оформлен!",
    //   OrderSuccessTemplate({ orderId: order.id, items })
    // );

    return NextResponse.json(responseData);
  } catch (error) {
    console.log("[CHECKOUT_CALLBACK] Error", error);

    return NextResponse.json({ error: "Server error" });
  }
}
