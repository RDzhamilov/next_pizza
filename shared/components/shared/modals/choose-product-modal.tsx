"use client";

import { Dialog, DialogContent, DialogTitle } from "@/shared/components/ui";
import { cn } from "@/shared/lib/utils";
import React from "react";
import { useRouter } from "next/navigation";
import { ProductWithRelations } from "@/@types/prisma";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // Импорт компонента для скрытия
import { ProductForm } from "../product-form";

interface Props {
  product: ProductWithRelations;
  className?: string;
}

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
  const router = useRouter();

  return (
    <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
      <DialogContent
        className={cn(
          "p-0 w-[1060px] max-w-[1060px] min-h-[500px] bg-white overflow-hidden",
          className
        )}
        aria-describedby={undefined} //just to avoid making a mistake
      >
        {/* just to avoid making a mistake */}
        <VisuallyHidden>
          <DialogTitle>Product Details</DialogTitle>
        </VisuallyHidden>

        <ProductForm product={product} onSubmit={() => router.back()} />
      </DialogContent>
    </Dialog>
  );
};
