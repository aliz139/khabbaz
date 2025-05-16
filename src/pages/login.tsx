import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const [, setCookie] = useCookies();
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen bg-white flex items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const data = {
            username: e.currentTarget.username.value,
            password: e.currentTarget.password.value,
          };

          const username = import.meta.env.VITE_USERNAME;
          const password = import.meta.env.VITE_PASSWORD;

          if (data.username === username && data.password === password) {
            setCookie("user", data.username, {
              path: "/",
              maxAge: 60 * 60 * 24 * 10,
            });
            navigate("/admin");
          } else {
            toast.error("Invalid username or password");
          }
        }}
        className="flex flex-col gap-4 text-center border p-8 rounded-md w-full max-w-sm"
      >
        <h1 className="text-xl font-bold mb-3 italic">Al-Khabbaz</h1>
        <Input name="username" placeholder="Username" required type="text" />
        <Input name="password" placeholder="Password" required type="password" />
        <Button type="submit" className="mt-2">
          Login
        </Button>
      </form>
    </div>
  );
}
