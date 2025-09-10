"use client";

import React, { createContext, useContext, useMemo, useState } from 'react';

type Tenant = {
  id: string;
  name?: string;
};

type TenantContextValue = {
  tenant: Tenant;
  setTenant: (tenant: Tenant) => void;
};

const DEFAULT_TENANT_ID = '30cec020-f26d-4daa-bef4-5aea9ed351ef';

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

export const TenantProvider = ({ children }: { children: React.ReactNode }) => {
  const [tenant, setTenant] = useState<Tenant>({ id: DEFAULT_TENANT_ID, name: 'Uniface' });

  const value = useMemo(() => ({ tenant, setTenant }), [tenant]);

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

export const useTenant = (): TenantContextValue => {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return ctx;
};

// Non-React accessor for places outside React tree (e.g., api client)
let currentTenantId: string = DEFAULT_TENANT_ID;

export const getTenantId = (): string => currentTenantId;
export const setGlobalTenantId = (tenantId: string) => {
  currentTenantId = tenantId;
};


