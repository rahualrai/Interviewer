// app/components/DemographicsForm.tsx
import React, { useState } from "react";

interface DemographicsFormProps {
  onSubmit: (data: DemographicsData) => void;
}

interface DemographicsData {
  age: number;
  phoneNumber: string;
}

const DemographicsForm: React.FC<DemographicsFormProps> = ({ onSubmit }) => {
  const [age, setAge] = useState<number>(0);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ age, phoneNumber });
  };

  return (
    <div className="border-gray-500 bg-gray-200 mx-5 mt-20 max-w-screen-md rounded-md border-2 w-full">
      <div className="flex flex-col space-y-4 p-7">
        <h1 className="text-lg font-semibold text-black">Demographics</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default DemographicsForm;