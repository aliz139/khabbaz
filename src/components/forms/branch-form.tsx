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

interface Branch {
  _id: Id<"branches">;
  name: string;
  address: string;
  phone: string;
  sortOrder?: number;
  active: boolean;
}

export default function BranchForm({ branch, child }: { branch?: Branch; child?: React.ReactNode }) {
  const createBranch = useMutation(api.functions.addBranch);
  const updateBranch = useMutation(api.functions.updateBranch);

  const [loading, setLoading] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        {child ? child : <Button variant="outline">{branch ? "Edit" : "Add Branch"}</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{branch ? "Edit Branch" : "Add Branch"}</DialogTitle>
          <DialogDescription>Add a new branch here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              setLoading(true);

              if (branch) {
                await updateBranch({
                  id: branch._id,
                  name: e.currentTarget.names.value,
                  address: e.currentTarget.address.value,
                  phone: e.currentTarget.phone.value,
                  active: branch.active,
                  sortOrder: parseInt(e.currentTarget.sortOrder.value),
                });
              } else {
                await createBranch({
                  name: e.currentTarget.names.value,
                  address: e.currentTarget.address.value,
                  phone: e.currentTarget.phone.value,
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
              toast.success("Branch saved successfully");
            } catch (error) {
              console.error(error);
              setLoading(false);
              toast.error("Failed to save branch");
            }
          }}
          className="flex gap-4 flex-col"
        >
          <div>
            <label htmlFor="names">Name</label>
            <Input type="text" id="names" name="names" defaultValue={branch?.name} required />
          </div>

          <div>
            <label htmlFor="address">Address</label>
            <Input type="text" id="address" name="address" defaultValue={branch?.address} required />
          </div>

          <div>
            <label htmlFor="phone">Phone</label>
            <Input type="text" id="phone" name="phone" defaultValue={branch?.phone} required />
          </div>

          <div>
            <label htmlFor="sortOrder">Sort Order</label>
            <Input type="number" id="sortOrder" name="sortOrder" defaultValue={branch?.sortOrder ?? 0} required />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
