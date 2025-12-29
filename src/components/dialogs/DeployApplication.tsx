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
import { Textarea } from "../ui/textarea";
import {
  authNode,
  getLiveNodes,
  getNodes,
  setNodes as updateNodes,
} from "@/core/node";
import { Combobox } from "../ui/combobox";
import { Node, NodeLiveData } from "@/lib/types";

export default function DeployApplication({
  children,
}: {
  children: ReactNode;
}) {
  const [nodeList, setNodeList] = useState<(NodeLiveData & Node)[]>([]);
  const [name, setName] = useState("");
  const [repo, setRepo] = useState("");
  const [node, setNode] = useState("");

  useEffect(() => {
    const fetchNodes = async () => {
      setNodeList(await getLiveNodes());
    };
    fetchNodes();
  }, []);

  const deploy = () => {};

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Deploy Application</DialogTitle>
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
              data={nodeList
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
