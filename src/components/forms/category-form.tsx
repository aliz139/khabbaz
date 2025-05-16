import { useMutation } from "convex/react";
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
import { useState } from "react";
import { toast } from "sonner";
import type { Id } from "convex/_generated/dataModel";

interface Category {
  _id: Id<"categories">;
  name: string;
  sortOrder?: number;
  active: boolean;
}

export default function CategoryForm({ category, child }: { category?: Category; child?: React.ReactNode }) {
  const createCategory = useMutation(api.functions.addCategory);
  const updateCategory = useMutation(api.functions.updateCategory);

  const [loading, setLoading] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {child ? child : <Button variant="outline">{category ? "Edit" : "Add Category"}</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
          <DialogDescription>Add a new category here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              setLoading(true);

              if (category) {
                await updateCategory({
                  id: category._id,
                  name: e.currentTarget.names.value,
                  active: true,
                  sortOrder: parseInt(e.currentTarget.sortOrder.value),
                });
              } else {
                await createCategory({
                  name: e.currentTarget.names.value,
                  active: true,
                  sortOrder: parseInt(e.currentTarget.sortOrder.value),
                });
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
              toast.success("Category saved successfully");
            } catch (error) {
              console.error(error);
              setLoading(false);
              toast.error("Failed to save category");
            }
          }}
          className="flex gap-4 flex-col"
        >
          <div>
            <label htmlFor="names">Name</label>
            <Input type="text" id="names" name="names" defaultValue={category?.name} required />
          </div>

          <div>
            <label htmlFor="sortOrder">Sort Order</label>
            <Input type="number" id="sortOrder" name="sortOrder" defaultValue={category?.sortOrder ?? 0} required />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
