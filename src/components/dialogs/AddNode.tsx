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
import { Textarea } from "../ui/textarea";
import {
  authNode,
  getNodes,
  setNodes as updateNodes,
} from "@/core/client/node";

export default function AddNode({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [ip, setIp] = useState("");
  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [auth, setAuth] = useState<{ node_id: string; os: string }>();

  const authenticateNode = async () => {
    setLoading(true);

    try {
      setAuth(await authNode(ip.trim(), key.trim()));
      setStep(2);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const addNode = async () => {
    if (!auth) return;
    const nodes = await getNodes();

    await updateNodes([
      ...nodes,
      {
        node_id: auth.node_id,
        key,
        name,
        description,
        ip,
        os: auth.os,
        labels: [],
      },
    ]);
    setStep(1);
    setAuth(undefined);
    setIp("");
    setKey("");
    setName("");
    setDescription("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && "Add Node"}
            {step === 2 && "Node Details"}
          </DialogTitle>
        </DialogHeader>

        {/* STEP 1: IP & Node Key */}
        {step === 1 && (
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="ip">
                IP address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ip"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="10.7.1.21"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="key">
                Node Key <span className="text-destructive">*</span>
              </Label>
              <Input
                id="key"
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="xxxxxxxxxxxxxxxx"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Node Name & Description */}
        {step === 2 && (
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">
                Node Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Captain's node"
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description">
                Node Description{" "}
                <span className="text-muted-foreground/60">(optional)</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A node for the Captain's main operations"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 1 && (
            <>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={authenticateNode} disabled={loading}>
                Next
              </Button>
            </>
          )}
          {step === 2 && (
            <>
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <DialogClose asChild>
                <Button onClick={addNode}>Add Node</Button>
              </DialogClose>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
