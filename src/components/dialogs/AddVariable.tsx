"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { Env, EnvVariable } from "@/lib/types";

interface Props {
  selectedApp: string;
  currentGroup: Env;
  setEnvGroups: React.Dispatch<React.SetStateAction<Record<string, Env>>>;
}

export function AddVariableDialog({
  selectedApp,
  currentGroup,
  setEnvGroups,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [key, setKey] = React.useState("");
  const [value, setValue] = React.useState("");
  const [secret, setSecret] = React.useState(false);

  const handleAdd = () => {
    if (!key) return;

    setEnvGroups((prev) => ({
      ...prev,
      [selectedApp]: {
        ...prev[selectedApp],
        variables: {
          ...prev[selectedApp].variables,
          [key]: {
            value,
            secret,
          },
        },
      },
    }));

    setKey("");
    setValue("");
    setSecret(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Variable</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Environment Variable</DialogTitle>
          <DialogDescription>
            Enter the variable name, value, and whether it should be secret.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-1">
            <label className="text-sm font-medium">Variable Name</label>
            <Input
              placeholder="PORT"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>

          <div className="grid gap-1">
            <label className="text-sm font-medium">Value</label>
            <Input
              placeholder="3000"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="secret"
              checked={secret}
              onCheckedChange={(checked) => setSecret(!!checked)}
            />
            <label htmlFor="secret" className="text-sm font-medium">
              Secret
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleAdd}>Add Variable</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
