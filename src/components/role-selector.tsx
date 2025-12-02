import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePermissions } from '@/hooks/usePermissions';
import { ROLE_LABELS } from '@/types/permissions';

interface RoleSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function RoleSelector({ value, onValueChange, disabled }: RoleSelectorProps) {
  const { getCreatableRoles } = usePermissions();
  const creatableRoles = getCreatableRoles();

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder="Selecciona un rol" />
      </SelectTrigger>
      <SelectContent>
        {creatableRoles.map((role) => (
          <SelectItem key={role} value={role}>
            {ROLE_LABELS[role]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}