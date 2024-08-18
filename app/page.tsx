import { Categories, Container, Filters, Title } from "@/components/shared";
import { ProductCard } from "@/components/shared/product-card";
import { TopBar } from "@/components/shared/top-bar";

export default function Home() {
  return (
    <>
      <Container className="mt-10">
        <Title className="font-extrabold" text="Все пиццы" size="lg" />
      </Container>
      <TopBar />

      <Container className="mt-10 pb-14">
        <div className="flex gap-[60px]">
          {/* Фильтрация */}
          <div className="w-[250px]">
            <Filters />
          </div>

          {/* Список товаров */}
          <div className="flex-1">
            <div className="flex flex-col gap-16">
              <ProductCard
                id={0}
                name="Чизбургер-пицца"
                price={555}
                imageUrl={
                  "https://media.dodostatic.net/image/r:584x584/11EE7D611ADF5AAD898B8B651186E023.avif"
                }
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
