import { useMutation } from "convex/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

import { toast } from "sonner";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import type { Id } from "../../convex/_generated/dataModel";

type Props =
  | {
      _type: "branch";
      id: Id<"branches">;
    }
  | {
      _type: "product";
      id: Id<"products">;
    }
  | {
      _type: "category";
      id: Id<"categories">;
    };

export function Delete(props: Props) {
  const [loading, setLoading] = useState(false);

  const deleteProduct = useMutation(api.functions.removeProduct);
  const deleteCategory = useMutation(api.functions.removeCategory);
  const deleteBranch = useMutation(api.functions.removeBranch);

  return (
    <AlertDialog>
      <AlertDialogTrigger className="text-red-500">Delete</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete item from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              setLoading(true);

              try {
                if (props._type === "product") {
                  await deleteProduct({ id: props.id });
                } else if (props._type === "branch") {
                  await deleteBranch({ id: props.id });
                } else if (props._type === "category") {
                  await deleteCategory({ id: props.id });
                }

                toast.success("Deleted Successfully!");
              } catch (e) {
                toast.warning("Error while deleting!");
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
