/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { rouge } from "@/config/styling";
import { createClient } from "@/utils/supabase/client";

export default function RegisterPage() {
  const initialFormState = {
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    companyCode: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const supabase = createClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOTPChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      companyCode: value,
    }));
  };

  const verifyCompanyCode = async (code: string) => {
    const response = await fetch("/api/auth/verify-company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyCode: code }),
    });

    if (!response.ok) {
      throw new Error("Code entreprise invalide");
    }

    return response.json();
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setShowPassword(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Les mots de passe ne correspondent pas");
      }

      if (formData.companyCode && formData.companyCode.length !== 4) {
        throw new Error("Le code entreprise doit contenir 4 chiffres");
      }

      // Only verify company code if provided
      let companyId = null;
      if (formData.companyCode) {
        const company = await verifyCompanyCode(formData.companyCode);
        companyId = company.id;
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            company_id: companyId,
            role: "member",
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) throw signUpError;

      toast.success(
        "Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte."
      );
      setShowEmailDialog(true);
      resetForm(); // Reset the form after successful registration
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = () => {
    setShowEmailDialog(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Email Confirmation Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="pt-4">
            <DialogTitle className="text-center flex flex-col items-center gap-4 pb-3">
              <div className="bg-emerald-100 rounded-full p-3 flex items-center justify-center">
                <Icon icon="fa:send" className="size-5 text-emerald-500" />
              </div>
              Email de confirmation envoyé
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Nous avons envoyé un email de confirmation à{" "}
              <strong>{formData.email}</strong>. Veuillez cliquer sur le lien
              dans l'email pour activer votre compte.
              <p className="mt-4 text-xs opacity-80 pt-4">
                Si vous ne trouvez pas l'email, veuillez vérifier votre dossier
                spam.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Top Logo */}
      <div className="flex-1 flex items-start justify-center pt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/logo/ks-logo-black.png"
            alt="Logo"
            width={60}
            height={80}
            className="opacity-100"
          />
        </motion.div>
      </div>

      {/* Center Form */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full space-y-6"
        >
          <div className="space-y-2 text-center">
            <h1
              className="text-7xl tracking-tight"
              style={{ fontFamily: rouge.style.fontFamily }}
            >
              Join Us
            </h1>
            <p className="text-gray-500">Créez votre compte pour commencer</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Jean Dupont"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className=" space-y-2">
                <Label htmlFor="companyCode">Code entreprise</Label>
                <InputOTP
                  maxLength={4}
                  value={formData.companyCode}
                  onChange={handleOTPChange}
                  disabled={isLoading}
                  className="justify-center gap-2"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="jean@exemple.fr"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Créez votre mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="pr-10"
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirmez votre mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="pr-10"
                  minLength={8}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Création en cours..." : "Créer un compte"}
            </Button>
          </form>
        </motion.div>
      </div>

      {/* Bottom Link */}
      <div className="flex-1 flex items-end justify-center pb-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-gray-600"
        >
          Vous avez déjà un compte ?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Se connecter
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
