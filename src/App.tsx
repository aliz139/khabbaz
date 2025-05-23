import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import CategoryButton from "./components/category-button";
import type { DataModel, Id } from "../convex/_generated/dataModel";
import { useEffect, useState } from "react";

function Product({ product }: { product: DataModel["products"]["document"] }) {
  const sizes = product.sizes.sort((a, b) => a.price - b.price);

  return (
    <>
      <div className="flex items-center w-full justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          {product.image !== "" ? (
            <img src={product.image} alt={product.name} className="w-20 object-cover aspect-square rounded-md" />
          ) : (
            <div className="w-20 aspect-square bg-gray-100 rounded-md"></div>
          )}

          <div>
            <p className="text-xl font-semibold">{product.name}</p>
            <p className="text-sm text-gray-500">{product.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {sizes.length > 0 ? (
            <div className="mt-2 mb-6">
              {sizes.map((s, i) => (
                <div key={i} className="text-sm text-gray-500 flex gap-2 items-center justify-between">
                  <span>{s.size}</span>

                  <span>{s.price}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">{product.price}</p>
          )}
        </div>
      </div>
    </>
  );
}

function ProductsByCategory({ categoryId }: { categoryId: Id<"categories"> }) {
  const products = useQuery(api.functions.getProductByCategoryId, {
    id: categoryId,
  });

  const sortedProducts = products?.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <div className="p-4" dir="rtl">
      {sortedProducts?.map((product) => (
        <Product key={product._id} product={product} />
      ))}
    </div>
  );
}

function CategoryButtons({ categories }: { categories?: DataModel["categories"]["document"][] }) {
  const [selectedCategory, setSelectedCategory] = useState<Id<"categories"> | null>(null);

  useEffect(() => {
    if (categories?.length) {
      setSelectedCategory(categories[0]._id);
    }
  }, [categories]);

  return (
    <>
      <div className="flex gap-2 p-2 overflow-auto sticky top-0 bg-white" dir="rtl">
        {categories?.map((category) => (
          <CategoryButton key={category._id} onClick={() => setSelectedCategory(category._id)}>
            {category.name}
          </CategoryButton>
        ))}
      </div>
      {selectedCategory && <ProductsByCategory categoryId={selectedCategory} />}
    </>
  );
}

export default function App() {
  const categories = useQuery(api.functions.getActiveCategories);
  const sortedCategories = categories?.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <div className="max-w-xl w-full md:w-[96%] mx-auto min-h-screen border">
      {/* <div className="bg-red-500 w-full h-48 text-white flex items-center justify-center text-6xl font-black italic"> */}
      {/* Al-Khabbaz */}
      <img src="/hero.jpg" alt="" />
      {/* </div> */}

      {/* <div className="p-4" dir="rtl">
        {sortedBranches?.map((branch) => (
          <div key={branch._id} className="flex items-center gap-2 my-2">
            <LocationEdit size={20} className="text-gray-500" />
            <p className="text-base font-medium">{branch.name}</p>
            <p className="text-sm text-gray-500">{branch.address}</p>
            <p className="text-sm text-gray-500">{branch.phone}</p>
          </div>
        ))}
      </div> */}

      <CategoryButtons categories={sortedCategories} />
    </div>
  );
}
