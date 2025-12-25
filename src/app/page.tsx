"use client";

import getDocker from "@/actions/getDocker";

export default function Home() {
  return (
    <div>
      <button
        onClick={() => {
          getDocker();
        }}
      >
        Get docker
      </button>
    </div>
  );
}
