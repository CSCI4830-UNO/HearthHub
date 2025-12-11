{/* Needed to initialize our variables */}
"use client";
import { useState } from "react";

{/* "Hero" is such a dumb name but everytime I attempt to change it the interconnectedness crashes the program */}
export function Hero() {
  return (
    <div className="flex flex-col gap-16 items-center">
      {/* Logo? */}
      Logo goes here?

      {/* The text below changes based on what is needed */}
      <h1 className="sr-only">Hearth Hub User Entry</h1>

      {/* Paragraph formatted block */}
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
        {/* Data & Forms goes here!*/}
        Date & Forms goes here!!
      </p>

      {/* Make is pretty!  This goes on the bottom of the paragraph block */}
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}