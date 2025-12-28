"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState } from "react";

export default function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const logIn = async () => {};

  return (
    <div className="w-full h-svh flex items-center">
      <Card className="mx-auto w-sm">
        <CardHeader>
          <CardTitle className="text-2xl mx-auto">
            <Image
              src={"/dockship.svg"}
              alt="Dockship"
              width={80}
              height={80}
            />
          </CardTitle>
          <CardTitle className="text-2xl mx-auto">Log in</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="key">Username</Label>
              <Input
                id="key"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="key">Password</Label>
              <Input
                id="key"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button className="mt-2" onClick={logIn}>
              Log in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
