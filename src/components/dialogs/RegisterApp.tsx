"use client";

import { useState, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getLiveNodes } from "@/lib/dockship/node";
import { Combobox } from "../ui/combobox";
import { registerApp } from "@/lib/dockship/application";
import { useAsync } from "@/hooks/use-async";

export default function RegisterAppDialog({
  children,
}: {
  children: ReactNode;
}) {
  const [name, setName] = useState("");
  const [repo, setRepo] = useState("");

  const deploy = async () => {
    console.log(await registerApp(name, repo));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Register Application</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name">
              Application name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My app"
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="repo">
              Repository <span className="text-destructive">*</span>
            </Label>
            <Input
              id="repo"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="https://github.com/me/myrepo.git"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={deploy}>Deploy</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
