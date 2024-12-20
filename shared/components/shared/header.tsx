"use client";

import { cn } from "@/shared/lib/utils";
import React, { Suspense } from "react";
import { Container } from "./container";
import Image from "next/image";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { CartButton } from "./cart-button";
import { useRouter, useSearchParams } from "next/navigation";
import { ProfileButton } from "./profile-button";
import { AuthModal } from "./modals";
import { SuccessCustomToast } from "@/shared/services/toastService";

interface Props {
  hasSearch?: boolean;
  hasCart?: boolean;
  className?: string;
}

export const Header: React.FC<Props> = ({ hasSearch = true, hasCart = true, className }) => {
  const router = useRouter();

  const [openAuthModal, setOpenAuthModal] = React.useState(false);

  const searchParams = useSearchParams();

  React.useEffect(() => {
    let toastMessage = "";

    if (searchParams.has("paid")) {
      toastMessage = "Order successfully paid! Information has been sent to your email.";
    }

    if (searchParams.has("verified")) {
      toastMessage = "Email successfully confirmed!";
    }

    if (toastMessage) {
      setTimeout(() => {
        router.replace("/");
        SuccessCustomToast({ message: toastMessage, duration: 3000 });
      }, 1000);
    }
  }, [router, searchParams]);

  return (
    <header className={cn("border-b", className)}>
      <Container className="flex items-center justify-between py-8">
        {/* Левая часть */}
        <Link href="/">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Logo" width={35} height={35} />
            <div>
              <h1 className="text-2xl uppercase font-black">Next Pizza</h1>
              <p className="text-sm text-gray-400 leading-3">This is the best taste!</p>
            </div>
          </div>
        </Link>

        {hasSearch && (
          <Suspense>
            <div className="mx-10 flex-1">
              <SearchInput />
            </div>
          </Suspense>
        )}

        {/* Правая часть */}
        <div className="flex items-center gap-3">
          <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)} />

          <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />

          {hasCart && <CartButton />}
        </div>
      </Container>
    </header>
  );
};
