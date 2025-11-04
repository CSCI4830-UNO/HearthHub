
"use client";
{/* Needed to initialize our variables */}
import { useState } from "react";

{/* "Hero" is such a dumb name but everytime I attempt to change it the interconnectedness crashes the program.  I'll probably get angry and change it sometime in the coming days*/}
export function Hero() {

 {/* Initialize the 3 variables needed, other data inputs can of course be added */}
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [yearlySalary, setYearlySalary] = useState("");

 {/* Some code to send the data to SupaDatabase goes here! */}
 {/* Some code to send the data to SupaDatabase goes here! */}
 {/* Some code to send the data to SupaDatabase goes here! */}
 {/* Some code to send the data to SupaDatabase goes here! */}

 {/* Clears out the text boxes in the three forms */}
  const clearFields = () => {
    setFirstName("");
    setLastName("");
    setYearlySalary("");
  };

  return (
      <div className="flex flex-col gap-8 items-center">
        <h1 className="text-2xl font-bold">Tenant Entry Form</h1>

        {/* Labels and entry text boxes for the three variables, we can put it in rows too if you'd like*/}
        <div className="flex flex-col gap-4 w-full max-w-md">
          <label className="flex flex-col">
            First Name
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border p-2 rounded"/>
          </label>
          <label className="flex flex-col">
            Last Name
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border p-2 rounded"/>
          </label>
          <label className="flex flex-col">
            Yearly Salary
            <input
              type="number"
              value={yearlySalary}
              onChange={(e) => setYearlySalary(e.target.value)}
              className="border p-2 rounded"/>
          </label>

          <div className="flex gap-4 justify-center mt-4">
          {/* Submit Button exists but needs to link to a command */}
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"> Submit </button>
            <button onClick={clearFields} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"> Clear </button>
          </div>

        </div>
      </div>
    );
  }