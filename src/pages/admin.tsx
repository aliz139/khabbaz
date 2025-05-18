import { api } from "../../convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Link, Navigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import CategoryForm from "@/components/forms/category-form";
import ProductForm from "@/components/forms/product-form";
import BranchForm from "@/components/forms/branch-form";
import { useCookies } from "react-cookie";
import type { DataModel } from "convex/_generated/dataModel";
import { useState } from "react";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function BranchesTable() {
  const branches = useQuery(api.functions.getBranches);

  const activateBranch = useMutation(api.functions.activateBranch);
  const deactivateBranch = useMutation(api.functions.deActivateBranch);
  const deleteBranch = useMutation(api.functions.removeBranch);

  return (
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr className="bg-gray-50">
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sort Order</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {branches?.map((branch, i) => (
          <tr key={branch._id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-fit">{i + 1}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{branch.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{branch.address}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{branch.phone}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{branch.sortOrder}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
              <Switch
                id={branch._id}
                defaultChecked={branch.active}
                onCheckedChange={async (v) => {
                  if (v) {
                    await activateBranch({ id: branch._id });
                  } else {
                    await deactivateBranch({ id: branch._id });
                  }
                }}
              />
              <label htmlFor={branch._id}>{branch.active ? "Active" : "Inactive"}</label>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <BranchForm
                branch={branch}
                child={<button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>}
              />
              <button
                className="text-red-600 hover:text-red-900"
                onClick={async () => {
                  await deleteBranch({ id: branch._id });
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CategoriesTable({ categories }: { categories: DataModel["categories"]["document"][] }) {
  const activateCategory = useMutation(api.functions.activateCategory);
  const deactivateCategory = useMutation(api.functions.deActivateCategory);
  const deleteCategory = useMutation(api.functions.removeCategory);

  return (
    <table className="min-w-full bg-white border border-gray-200">
      <thead>
        <tr className="bg-gray-50">
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sort Order</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-200">
        {categories?.map((category, i) => (
          <tr key={category._id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-fit">{i + 1}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {new Date(category._creationTime).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.sortOrder}</td>

            <td>
              <div className="flex items-center space-x-2">
                <Switch
                  id={category._id}
                  defaultChecked={category.active}
                  onCheckedChange={async (v) => {
                    if (v) {
                      await activateCategory({ id: category._id });
                    } else {
                      await deactivateCategory({ id: category._id });
                    }
                  }}
                />
                <label htmlFor={category._id}>{category.active ? "Active" : "Inactive"}</label>
              </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <CategoryForm
                category={category}
                child={<button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>}
              />
              <button
                className="text-red-600 hover:text-red-900"
                onClick={async () => {
                  await deleteCategory({ id: category._id });
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ProductsTable({ categories }: { categories: DataModel["categories"]["document"][] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>();

  const products = useQuery(api.functions.getProducts);
  const deleteProduct = useMutation(api.functions.removeProduct);
  const activateProduct = useMutation(api.functions.activateProduct);
  const deactivateProduct = useMutation(api.functions.deActivateProduct);

  return (
    <>
      <div className="mb-6">
        <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {categories.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <p className="text-gray-500 text-sm m-1">Select a category to view products from that category only.</p>
      </div>

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sort Order
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products?.map((product, i) => {
            if (selectedCategory && selectedCategory !== product.categoryId) return <></>;
            return (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-fit">{i + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sortOrder}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                  <Switch
                    id={product._id}
                    defaultChecked={product.active}
                    onCheckedChange={async (v) => {
                      if (v) {
                        await activateProduct({ id: product._id });
                      } else {
                        await deactivateProduct({ id: product._id });
                      }
                    }}
                  />
                  <label htmlFor={product._id}>{product.active ? "Active" : "Inactive"}</label>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <ProductForm
                    product={product}
                    child={<button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>}
                  />

                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={async () => {
                      await deleteProduct({ id: product._id });
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default function Admin() {
  const [cookies] = useCookies();
  const categories = useQuery(api.functions.getCategories);

  if (!cookies.user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="w-full p-4 border flex items-baseline gap-4 sticky top-0 bg-white">
        <ul className="flex items-baseline gap-8 h-full">
          <li>
            <Link to="/admin" className="italic font-black text-3xl">
              Al-Khabbaz
            </Link>
          </li>
          <li className="hidden md:block">
            <a href="#categories" className="hover:underline">
              Categories
            </a>
          </li>

          <li className="hidden md:block">
            <a href="#products" className="hover:underline">
              Products
            </a>
          </li>

          <li className="hidden md:block">
            <a href="#branches" className="hover:underline">
              Branches
            </a>
          </li>
        </ul>
      </nav>

      <div id="categories" className="p-4 pt-[70px]">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black mb-4">Categories</h2>
          <CategoryForm />
        </div>
        <div className="overflow-x-auto">
          <CategoriesTable categories={categories ?? []} />
        </div>
      </div>

      <div id="products" className="p-4 pt-[70px]">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black mb-4">Products</h2>
          <ProductForm />
        </div>

        <div className="overflow-x-auto">
          <ProductsTable categories={categories ?? []} />
        </div>
      </div>

      <div id="branches" className="p-4 pt-[70px]">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black mb-4">Branches</h2>
          <BranchForm />
        </div>

        <div className="overflow-x-auto">
          <BranchesTable />
        </div>
      </div>
    </div>
  );
}
