"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUser, login } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  User,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import GithubAuthButton from "@/components/auth/GithubAuthButton";
import { motion } from "framer-motion";
import zxcvbn from "zxcvbn";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    userName?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
  }>({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (formData.password) {
      const result = zxcvbn(formData.password);
      setPasswordStrength(result.score);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error for this field when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-green-500";
      case 4:
        return "bg-green-600";
      default:
        return "bg-gray-200";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
        return "Very weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.userName) {
      newErrors.userName = "Username is required";
    } else if (formData.userName.length < 3) {
      newErrors.userName = "Username must be at least 3 characters long";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (passwordStrength < 2) {
      newErrors.password = "Password is too weak";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeTerms)
      newErrors.agreeTerms = "You must agree to the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Register the user
      await createUser({
        email: formData.email,
        userName: formData.userName,
        passwordHash: formData.password, // Note: The API will hash this
        role: "user",
      });

      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      });

      // Automatically log the user in
      await login({
        email: formData.email,
        password: formData.password,
      });

      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.toString(),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <Card className="border-0 shadow-xl">
            <CardHeader className="pb-2 space-y-3 text-center">
              <div className="flex justify-center mb-2">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create an account
              </h1>
              <p className="text-gray-500 text-sm">
                Start shortening URLs and tracking analytics in just a minute
              </p>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email address
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        className={`pl-10 ${
                          errors.email
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }`}
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.email && (
                      <div className="flex items-center text-red-500 text-xs mt-1">
                        <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>{errors.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="userName" className="text-sm font-medium">
                      Username
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="userName"
                        name="userName"
                        type="text"
                        className={`pl-10 ${
                          errors.userName
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }`}
                        placeholder="johndoe"
                        value={formData.userName}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.userName && (
                      <div className="flex items-center text-red-500 text-xs mt-1">
                        <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>{errors.userName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      className={`pl-10 ${
                        errors.password
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center mb-1">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getPasswordStrengthColor()}`}
                            style={{ width: `${(passwordStrength + 1) * 20}%` }}
                          ></div>
                        </div>
                        <span className="text-xs ml-2 text-gray-500">
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Use 8+ characters with a mix of letters, numbers &
                        symbols
                      </p>
                    </div>
                  )}

                  {errors.password && (
                    <div className="flex items-center text-red-500 text-xs mt-1">
                      <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span>{errors.password}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm password
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      className={`pl-10 ${
                        errors.confirmPassword
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <div className="flex items-center text-red-500 text-xs mt-1">
                      <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span>{errors.confirmPassword}</span>
                    </div>
                  )}
                  {formData.password &&
                    formData.confirmPassword &&
                    formData.password === formData.confirmPassword && (
                      <div className="flex items-center text-green-500 text-xs mt-1">
                        <CheckCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span>Passwords match</span>
                      </div>
                    )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          agreeTerms: checked as boolean,
                        })
                      }
                      className={
                        errors.agreeTerms ? "border-red-500 text-red-500" : ""
                      }
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="agreeTerms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-blue-600 hover:text-blue-500 hover:underline"
                        >
                          terms of service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-blue-600 hover:text-blue-500 hover:underline"
                        >
                          privacy policy
                        </Link>
                      </label>
                    </div>
                  </div>
                  {errors.agreeTerms && (
                    <div className="flex items-center text-red-500 text-xs">
                      <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span>{errors.agreeTerms}</span>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-2 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <GoogleAuthButton />
                  <GithubAuthButton />
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-center pb-6 px-8">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
