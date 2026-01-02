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
import { Application, Node, NodeLiveData } from "@/lib/types";
import { getApplications } from "@/core/application";
import { deployApp } from "@/lib/dockship/deploy";

export default function DeployAppDialog({
  defaultApp,
  children,
}: {
  defaultApp?: string;
  children: ReactNode;
}) {
  const [nodeList, setNodeList] = useState<(NodeLiveData & Node)[]>([]);
  const [apps, setApps] = useState<Application[]>([]);

  const [name, setName] = useState("");
  const [app, setApp] = useState(defaultApp || "");
  const [node, setNode] = useState("");

  useEffect(() => {
    const fetchNodes = async () => {
      setNodeList(await getLiveNodes());
      setApps(await getApplications());
    };
    fetchNodes();
  }, []);

  const deploy = async () => {
    console.log(name, app, node);
    await deployApp(name, app, node);
  };

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
              Deployment name <span className="text-destructive">*</span>
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
              Application <span className="text-destructive">*</span>
            </Label>
            <Combobox
              value={app}
              setValue={setApp}
              data={apps.map((app) => ({
                label: app.name,
                value: app.id,
              }))}
              placeholder="Select App..."
              listPlaceholder="No apps found :("
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
