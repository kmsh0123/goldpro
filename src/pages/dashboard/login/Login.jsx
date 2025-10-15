import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useLoginMutation } from "@/feature/api/loginApi/LoginApi";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "@/feature/service/authSlice";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const nav = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // resolver: zodResolver(AdminLoginSchema),
    defaultValues: {
      // name: "09962255530",
      // password: "Mgmauk96@",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (formData) => {
    try {
      const data = await login(formData);
      dispatch(addUser({token: data?.data?.token}));
      console.log(data?.data?.token);
      nav("/")
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="flex flex-col md:flex-row items-center gap-12 max-w-5xl w-full">
        {/* Illustration */}
        <div className="flex-1 flex justify-center">
          <img
            src="/images/login_image.png"
            alt="Jewelry Shop Illustration"
            className="w-96 md:w-[420px]"
          />
        </div>

        {/* Sign In Card */}
          <form onSubmit={handleSubmit(handleLogin)} className="w-full max-w-sm shadow-lg border border-gray-100">
            <div className="p-6 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Sign In</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Enter Name</Label>
                  <Input
                    id="name"
                    type="text"
                    {...register("name")}
                    placeholder="Enter Name"
                    className="bg-gray-100 focus-visible:ring-yellow-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Enter Password</Label>
                  <div className="flex">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      {...register("password")}
                      placeholder="Enter Password"
                      className="bg-gray-100 pr-10 focus-visible:ring-yellow-500"
                    />
                    {/* <EyeIcon
                    size={18}
                    className="absolute right-3 top-[38px] text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  /> */}
                    <span
                      className="flex items-center ml-[-35px] text-gray-700 text-xl"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeIcon size={18} />
                      ) : (
                        <EyeOffIcon size={18} />
                      )}
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-md"
                >
                  {isLoading ? "Signing in..." : "Sign"}
                </Button>
              </div>
            </div>
          </form>
      </div>
    </div>
  );
}
