"use client";

import { useState, ReactNode, useEffect } from "react";
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
import { Node, NodeLiveData } from "@/lib/types";
import { installApp } from "@/lib/dockship/application";
import { useAsync } from "@/hooks/use-async";

export default function InstallApplicationDialog({
  children,
}: {
  children: ReactNode;
}) {
  const { value: nodes } = useAsync([], getLiveNodes);
  const [name, setName] = useState("");
  const [repo, setRepo] = useState("");
  const [node, setNode] = useState("");

  const deploy = async () => {
    console.log(await installApp(name, repo, node));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Install Application</DialogTitle>
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

          <div className="grid gap-3">
            <Label htmlFor="node">
              Node <span className="text-destructive">*</span>
            </Label>
            <Combobox
              value={node}
              setValue={setNode}
              data={nodes
                .filter((node) => node.liveData)
                .map((node) => ({ label: node.name, value: node.node_id }))}
              placeholder="Select Node..."
              listPlaceholder="No nodes found :("
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
