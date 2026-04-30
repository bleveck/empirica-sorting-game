import React, { useState } from "react";
import { Button } from "../components/Button";

export function PlayerRegistration({ onPlayerID, connecting }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailPrefix, setEmailPrefix] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !emailPrefix.trim()) return;

    sessionStorage.setItem(
      "playerRegistration",
      JSON.stringify({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        emailPrefix: emailPrefix.trim().toLowerCase(),
      })
    );

    onPlayerID(emailPrefix.trim().toLowerCase());
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          POLI 172 Group Sorting Game
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Please enter your information below to join the experiment.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              required
              autoFocus
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-empirica-500 focus:border-empirica-500 sm:text-sm"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={connecting}
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-empirica-500 focus:border-empirica-500 sm:text-sm"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={connecting}
            />
          </div>

          <div>
            <label
              htmlFor="emailPrefix"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              UC Merced Email
            </label>
            <div className="flex items-center">
              <input
                id="emailPrefix"
                type="text"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-empirica-500 focus:border-empirica-500 sm:text-sm"
                placeholder="jdoe2"
                value={emailPrefix}
                onChange={(e) => setEmailPrefix(e.target.value)}
                disabled={connecting}
              />
              <span className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 sm:text-sm">
                @ucmerced.edu
              </span>
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit">
              {connecting ? "Joining..." : "Join Experiment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
