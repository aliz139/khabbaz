import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import type { Id } from "../../../convex/_generated/dataModel";
import { X } from "lucide-react";

interface Size {
  size: string;
  price: number;
}

interface Product {
  _id: Id<"products">;
  name: string;
  price: number;
  description: string;
  categoryId: Id<"categories">;
  sizes: Size[];
  image: string;
  active: boolean;
  sortOrder?: number;
}

export default function ProductForm({ product, child }: { product?: Product; child?: React.ReactNode }) {
  const imageInput = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [categoryId, setCategoryId] = useState("");
  const [sizes, setSizes] = useState<Size[]>([]);
  const [newSize, setNewSize] = useState<Size>({ size: "", price: 0 });
  const [loading, setLoading] = useState(false);

  const categories = useQuery(api.functions.getCategories);
  const createProduct = useMutation(api.functions.addProduct);
  const updateProduct = useMutation(api.functions.updateProduct);

  const generateUploadUrl = useMutation(api.functions.generateUploadUrl);
  const getImageURL = useMutation(api.functions.getImage);

  const addSize = () => {
    if (newSize.size && newSize.price > 0) {
      setSizes([...sizes, newSize]);
      setNewSize({ size: "", price: 0 });
    }
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (product) {
      setCategoryId(product.categoryId);
      setSizes(product.sizes);
    }
  }, [product]);

  async function uploadImage() {
    if (selectedImage === null) return;

    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": selectedImage!.type },
      body: selectedImage,
    });

    const { storageId } = await result.json();

    const uploadedImageURL = await getImageURL({ storageId });

    setSelectedImage(null);
    imageInput.current!.value = "";

    return uploadedImageURL;
  }

  return (
    <Dialog
      onOpenChange={() => {
        setSelectedImage(null);
        setSizes([]);
        setNewSize({ size: "", price: 0 });
        setCategoryId("");
      }}
    >
      <DialogTrigger asChild>
        {child ? child : <Button variant="outline">{product ? "Edit" : "Add Product"}</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[96vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
          <DialogDescription>Add a new product here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            try {
              setLoading(true);

              const data = {
                name: e.currentTarget.names.value,
                categoryId: categoryId as Id<"categories">,
                description: e.currentTarget.description.value,
                price: Number(e.currentTarget.price.value),
                sizes: sizes,
                active: true,
                image: product?.image ?? "",
                sortOrder: parseInt(e.currentTarget.sortOrder.value),
              };

              if (selectedImage !== null) {
                const imageUrl = await uploadImage();
                data.image = imageUrl ?? "";
              }

              if (product) {
                data.active = product.active;

                console.log(data);
                await updateProduct({ id: product._id, ...data });
              } else {
                console.log(data);
                await createProduct(data);
              }

              setLoading(false);
              const escEvent = new KeyboardEvent("keydown", {
                key: "Escape",
                code: "Escape",
                keyCode: 27,
                which: 27,
                bubbles: true,
              });

              document.dispatchEvent(escEvent);

              setSelectedImage(null);
              setSizes([]);
              setNewSize({ size: "", price: 0 });
              setCategoryId("");

              toast.success("Product created successfully");
            } catch (error) {
              console.error(error);
              setLoading(false);
              toast.error("Failed to create product");
            }
          }}
          className="flex gap-4 flex-col"
        >
          <div>
            <label htmlFor="names">Name</label>
            <Input type="text" id="names" defaultValue={product?.name} name="names" required />
          </div>

          <div>
            <label htmlFor="sortOrder">Sort Order</label>
            <Input type="number" id="sortOrder" defaultValue={product?.sortOrder ?? 0} name="sortOrder" required />
          </div>

          <div>
            <label>Category</label>
            <Select required value={categoryId} onValueChange={(value) => setCategoryId(value)}>
              <SelectTrigger className="w-full" value={categoryId}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="price">Base Price</label>
            <Input type="number" min={0} id="price" defaultValue={product?.price} name="price" required />
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <Textarea id="description" defaultValue={product?.description} name="description" />
          </div>

          <Input
            type="file"
            accept="image/*"
            ref={imageInput}
            onChange={(event) => setSelectedImage(event.target.files![0])}
            disabled={selectedImage !== null}
          />

          {selectedImage || product?.image ? (
            <img
              src={selectedImage ? URL.createObjectURL(selectedImage) : product?.image}
              alt="Product"
              className="w-full h-40 object-cover"
            />
          ) : (
            <div className="w-full h-40 bg-gray-200"></div>
          )}

          <div className="space-y-4">
            <label>Sizes</label>
            <div className="space-y-2">
              {sizes.map((size, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input value={size.size} disabled placeholder="Size title" />
                  </div>
                  <div className="flex-1">
                    <Input value={size.price} disabled type="number" placeholder="Price" />
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeSize(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    value={newSize.size}
                    onChange={(e) => setNewSize({ ...newSize, size: e.target.value })}
                    placeholder="Size title"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    value={newSize.price}
                    onChange={(e) => setNewSize({ ...newSize, price: Number(e.target.value) })}
                    type="number"
                    placeholder="Price"
                    min={0}
                  />
                </div>
                <Button type="button" variant="outline" onClick={addSize}>
                  Add
                </Button>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
