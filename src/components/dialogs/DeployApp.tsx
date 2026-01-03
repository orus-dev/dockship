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
import { deployApp } from "@/lib/dockship/deploy";
import { useAsync } from "@/hooks/use-async";
import { Application, Port } from "@/lib/types";
import { getApps } from "@/lib/dockship/application";
import { Plus } from "lucide-react";

export default function DeployAppDialog({
  defaultApp,
  children,
}: {
  defaultApp?: string;
  children: ReactNode;
}) {
  const { value: nodes } = useAsync([], getLiveNodes);
  const { value: apps } = useAsync<Application[]>([], getApps);
  const [name, setName] = useState("");
  const [app, setApp] = useState(defaultApp || "");
  const [node, setNode] = useState("");

  const [ports, setPorts] = useState<Port[]>([]);
  const [newPort, setNewPort] = useState<Port>({
    containerPort: "",
    hostPort: "",
    protocol: "tcp",
  });

  const addPort = () => {
    if (!newPort.containerPort || !newPort.hostPort) return;
    setPorts([...ports, newPort]);
    setNewPort({ containerPort: "", hostPort: "", protocol: "tcp" });
  };

  const removePort = (index: number) => {
    setPorts(ports.filter((_, i) => i !== index));
  };

  const deploy = async () => {
    console.log("Deploying:", { name, app, node, ports });
    await deployApp(name, app, node, ports);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Deploy Application</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Name */}
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

          {/* Application */}
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

          {/* Node */}
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

          {/* Ports */}
          <div className="grid gap-3">
            <Label>Ports</Label>
            <div className="flex gap-2 items-end">
              <Input
                placeholder="Container Port"
                value={newPort.containerPort}
                onChange={(e) =>
                  setNewPort({ ...newPort, containerPort: e.target.value })
                }
              />
              <Input
                placeholder="Host Port"
                value={newPort.hostPort}
                onChange={(e) =>
                  setNewPort({ ...newPort, hostPort: e.target.value })
                }
              />
              <Combobox
                value={newPort.protocol}
                setValue={(v) =>
                  setNewPort({
                    ...newPort,
                    protocol: v as "tcp" | "udp",
                  })
                }
                data={[
                  { label: "TCP", value: "tcp" },
                  { label: "UDP", value: "udp" },
                ]}
                placeholder="Select protocol..."
                listPlaceholder="No protocols found :("
              />
              <Button onClick={addPort} variant="ghost">
                <Plus />
              </Button>
            </div>

            {ports.length > 0 && (
              <ul className="mt-2 space-y-1">
                {ports.map((p, i) => (
                  <li key={i} className="flex justify-between items-center">
                    <span>
                      {p.containerPort} → {p.hostPort} (
                      {p.protocol.toUpperCase()})
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removePort(i)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
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
