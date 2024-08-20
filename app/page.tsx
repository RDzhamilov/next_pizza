import { Categories, Container, Filters, Title } from "@/components/shared";
import { ProductCard } from "@/components/shared/product-card";
import { ProductGroupList } from "@/components/shared/products-group-list";
import { TopBar } from "@/components/shared/top-bar";

export default function Home() {
  return (
    <>
      <Container className="mt-10">
        <Title className="font-extrabold" text="Все пиццы" size="lg" />
      </Container>
      <TopBar />

      <Container className="mt-10 pb-14">
        <div className="flex gap-[80px]">
          {/* Фильтрация */}
          <div className="w-[250px]">
            <Filters />
          </div>

          {/* Список товаров */}
          <div className="flex-1">
            <div className="flex flex-col gap-16">
              <ProductGroupList
                title="Пиццы"
                items={[
                  {
                    id: 1,
                    name: "Чизбургер-пицца",
                    imageUrl:
                      "https://media.dodostatic.net/image/r:584x584/11EEC3FF027DFA6ABB2C2582C8686D17.avif",
                    price: 550,
                    items: [{ price: 550 }],
                  },
                  {
                    id: 2,
                    name: "Чизбургер-пицца",
                    imageUrl:
                      "https://media.dodostatic.net/image/r:584x584/11EEC3FF027DFA6ABB2C2582C8686D17.avif",
                    price: 550,
                    items: [{ price: 550 }],
                  },
                  {
                    id: 3,
                    name: "Чизбургер-пицца",
                    imageUrl:
                      "https://media.dodostatic.net/image/r:584x584/11EEC3FF027DFA6ABB2C2582C8686D17.avif",
                    price: 550,
                    items: [{ price: 550 }],
                  },
                  {
                    id: 4,
                    name: "Чизбургер-пицца",
                    imageUrl:
                      "https://media.dodostatic.net/image/r:584x584/11EEC3FF027DFA6ABB2C2582C8686D17.avif",
                    price: 550,
                    items: [{ price: 550 }],
                  },
                  {
                    id: 5,
                    name: "Чизбургер-пицца",
                    imageUrl:
                      "https://media.dodostatic.net/image/r:584x584/11EEC3FF027DFA6ABB2C2582C8686D17.avif",
                    price: 550,
                    items: [{ price: 550 }],
                  },
                  {
                    id: 6,
                    name: "Чизбургер-пицца",
                    imageUrl:
                      "https://media.dodostatic.net/image/r:584x584/11EEC3FF027DFA6ABB2C2582C8686D17.avif",
                    price: 550,
                    items: [{ price: 550 }],
                  },
                ]}
                categoryId={1}
              />
              <ProductGroupList
                title="Комбо"
                items={[
                  {
                    id: 1,
                    name: "Чизбургер-пицца",
                    imageUrl:
                      "https://media.dodostatic.net/image/r:584x584/11EEC3FF027DFA6ABB2C2582C8686D17.avif",
                    price: 550,
                    items: [{ price: 550 }],
                  },
                  {
                    id: 2,
                    name: "Чизбургер-пицца",
                    imageUrl:
                      "https://media.dodostatic.net/image/r:584x584/11EEC3FF027DFA6ABB2C2582C8686D17.avif",
                    price: 550,
                    items: [{ price: 550 }],
                  },
                  {
                    id: 3,
                    name: "Чизбургер-пицца",
                    imageUrl:
                      "https://media.dodostatic.net/image/r:584x584/11EEC3FF027DFA6ABB2C2582C8686D17.avif",
                    price: 550,
                    items: [{ price: 550 }],
                  },
                  {
                    id: 4,
                    name: "Чизбургер-пицца",
                    imageUrl:
                      "https://media.dodostatic.net/image/r:584x584/11EEC3FF027DFA6ABB2C2582C8686D17.avif",
                    price: 550,
                    items: [{ price: 550 }],
                  },
                  {
                    id: 5,
                    name: "Чизбургер-пицца",
                    imageUrl:
                      "https://media.dodostatic.net/image/r:584x584/11EEC3FF027DFA6ABB2C2582C8686D17.avif",
                    price: 550,
                    items: [{ price: 550 }],
                  },
                  {
                    id: 6,
                    name: "Чизбургер-пицца",
                    imageUrl:
                      "https://media.dodostatic.net/image/r:584x584/11EEC3FF027DFA6ABB2C2582C8686D17.avif",
                    price: 550,
                    items: [{ price: 550 }],
                  },
                ]}
                categoryId={2}
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
