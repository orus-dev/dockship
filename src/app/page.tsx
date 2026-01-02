"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import redirectAuth from "@/lib/dockship/redirect";
import { GithubIcon } from "lucide-react";
import Image from "next/image";

export default function LogIn() {
  const withGithub = () => {
    redirectAuth();
  };

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
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={withGithub}>
            <GithubIcon /> Continue with GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
