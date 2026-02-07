"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { apiClient } from "@/services/apiClient";

export default function OnboardingForm() {
  const { data: session, update } = useSession();
  const user = session?.user;

  
  const [step, setStep] = useState<"choose" | "business">("choose");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    address: "",
    gstNumber: "",
    registrationNumber: "",
    businessPhone: "",
    businessEmail: "",
  });

  async function handlePersonalSubmit() {
    setLoading(true);
    setError(null);
    try {
      var tenant = await apiClient.post("/tenants", {
        name: user?.name || "Personal",
        type: "PERSONAL",
      });
      if (tenant && typeof tenant === "object" && "id" in tenant) {
        await apiClient.post("/users", {
          tenantId: tenant.id,
          name: user?.name,
          email: user?.email,
          image: user?.image,
          role: "OWNER",
        });
      }
      await update();
      
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err?.message || "Failed to register personal account.");
    } finally {
      setLoading(false);
    }
  }


  async function handleBusinessSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      var tenant = await apiClient.post("/tenants", {
        name: form.name,
        type: "BUSINESS",
        address: form.address,
        gstNumber: form.gstNumber,
        registrationNumber: form.registrationNumber,
        businessPhone: form.businessPhone,
        businessEmail: form.businessEmail,
      });

      if (tenant && typeof tenant === "object" && "id" in tenant) {
       await apiClient.post("/users", {
        tenantId: tenant.id,
        name: user?.name,
        email: user?.email,
        image: user?.image,
        role: "ADMIN",
      });
      }

      await update();
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err?.message || "Failed to register business.");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-8 shadow-lg border border-gray-200 bg-white">
        <h1 className="text-2xl font-semibold mb-6 text-center">Welcome to ByteBook</h1>
        <Separator className="mb-6" />
        {step === "choose" && (
          <div className="flex flex-col gap-4">
            <Button className="w-full" variant="default" size="lg" onClick={() => handlePersonalSubmit()}>
              Register for Personal Use
            </Button>
            <Button className="w-full" variant="outline" size="lg" onClick={() => setStep("business")}>Register for Business</Button>
          </div>
        )}
        {step === "business" && (
          <form className="flex flex-col gap-4" onSubmit={handleBusinessSubmit}>
            <Label htmlFor="name">Business Name</Label>
            <Input id="name" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your business name" />
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Business address" />
            <Label htmlFor="gstNumber">GST Number</Label>
            <Input id="gstNumber" value={form.gstNumber} onChange={e => setForm(f => ({ ...f, gstNumber: e.target.value }))} placeholder="GSTIN (15 characters)" maxLength={15} />
            <Label htmlFor="registrationNumber">Registration Number</Label>
            <Input id="registrationNumber" value={form.registrationNumber} onChange={e => setForm(f => ({ ...f, registrationNumber: e.target.value }))} placeholder="Company PAN/CIN, Shop Act, etc." />
            <Label htmlFor="businessPhone">Business Phone</Label>
            <Input id="businessPhone" value={form.businessPhone} onChange={e => setForm(f => ({ ...f, businessPhone: e.target.value }))} placeholder="Business phone number" />
            <Label htmlFor="businessEmail">Business Email</Label>
            <Input id="businessEmail" type="email" value={form.businessEmail} onChange={e => setForm(f => ({ ...f, businessEmail: e.target.value }))} placeholder="Business email address" />
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            <Button type="submit" className="mt-4" disabled={loading}>
              {loading ? "Registering..." : "Register Business"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setStep("choose")}>Back</Button>
          </form>
        )}
      </Card>
    </div>
  );
}