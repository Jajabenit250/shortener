"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { checkRedirect, submitPasswordDirectProtectedUrl } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Loader2, Lock, AlertCircle, LinkIcon } from "lucide-react";

export function RedirectPageClient({ alias }: { alias: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [state, setState] = useState<{
    status: "loading" | "password_required" | "redirecting" | "error";
    message?: string;
    originalUrl?: string;
  }>({ status: "loading" });

  // Immediate redirect effect
  useEffect(() => {
    if (originalUrl != "") {
      console.log(originalUrl);
      window.location.replace(originalUrl);
    }
  }, [originalUrl]);

  const fetchRedirectInfo = useCallback(async () => {
    if (!alias) return;

    try {
      const data = await checkRedirect(alias);
      console.log(data);
      if (data.originalUrl) {
        setOriginalUrl(data.originalUrl);
        setState({ status: "redirecting", originalUrl: data.originalUrl });
      } else if (data.isPasswordProtected) {
        setState({ status: "password_required" });
      } else {
        setState({ status: "error", message: data.error || "Url Not Found" });
      }
    } catch (error: any) {
      setState({ status: "error", message: "Url Not Found" });
    }
  }, [alias]);

  const handlePasswordSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!password.trim()) return setPasswordError("Password required");

      try {
        const result = await submitPasswordDirectProtectedUrl(alias, password);
        if (result.originalUrl) {
          setOriginalUrl(result.originalUrl);
          setState({ status: "redirecting", originalUrl: result.originalUrl });
        } else {
          setPasswordError("Invalid password");
          toast({ title: "Access Denied", variant: "destructive" });
        }
      } catch (error: any) {
        setPasswordError(error.toString());
        toast({
          title: "Error",
          description: error.toString(),
          variant: "destructive",
        });
      }
    },
    [alias, password]
  );

  useEffect(() => {
    fetchRedirectInfo();
  }, [fetchRedirectInfo]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {state.status === "loading" && (
          <Card className="text-center shadow-lg">
            <CardHeader>
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
              <h1 className="text-2xl font-bold">Loading...</h1>
            </CardHeader>
          </Card>
        )}

        {state.status === "password_required" && (
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <h1 className="text-2xl font-bold">Password Required</h1>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError("");
                    }}
                    required
                    autoFocus
                  />
                  {passwordError && (
                    <p className="text-red-500 text-sm">{passwordError}</p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {state.status === "error" && (
          <Card className="text-center shadow-lg">
            <CardHeader>
              <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
              <h1 className="text-2xl font-bold">Error</h1>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{state.message}</p>
              <Button onClick={() => router.push("/")} className="w-full">
                Return Home
              </Button>
            </CardContent>
          </Card>
        )}

        <footer className="mt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} URL Shortener
        </footer>
      </div>
    </div>
  );
}
