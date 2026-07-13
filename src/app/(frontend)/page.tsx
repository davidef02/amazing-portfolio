import React from "react";
import Skills from "@/components/Skills";

export default async function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-neo-bg text-black font-sans">
      <h1 className="text-4xl font-black uppercase border-4 border-black p-4 bg-neo-yellow shadow-neo">
        <Skills />
      </h1>
    </main>
  );
}
