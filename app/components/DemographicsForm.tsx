// app/components/DemographicsForm.tsx
import React, { useState } from "react";

interface DemographicsFormProps {
  onSubmit: (data: DemographicsData) => void;
}

interface DemographicsData {
  age: number;
  relationshipWithChild: string;
  gender: string;
  hispanicLatinoSpanish: string[];  // Multiple selections
  race: string[];                   // Multiple selections
  highestGrade: string;
  housingStatus: string[];          
  householdBudget?: number;         // Could be a number or string range
  householdBudgetExact?: number;    // Optionally store exact amount if entered
  householdReceived: string[];      
  maritalStatus: string;
  householdSize: number;
  householdUnder18: number;
  occupationalStatus: string[];     
  phoneNumber: string;
}

const DemographicsForm: React.FC<DemographicsFormProps> = ({ onSubmit }) => {
  // Existing fields
  const [age, setAge] = useState<number>(0);
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  // New fields:
  const [relationshipWithChild, setRelationshipWithChild] = useState<string>("");
  const [gender, setGender] = useState<string>("");

  // For the checkboxes that allow multiple selections, we can store arrays:
  const [hispanicLatinoSpanish, setHispanicLatinoSpanish] = useState<string[]>([]);
  const [race, setRace] = useState<string[]>([]);
  const [housingStatus, setHousingStatus] = useState<string[]>([]);
  const [householdReceived, setHouseholdReceived] = useState<string[]>([]);
  const [occupationalStatus, setOccupationalStatus] = useState<string[]>([]);

  const [highestGrade, setHighestGrade] = useState<string>("");
  const [householdBudget, setHouseholdBudget] = useState<number>(0);        // If they select from a range
  const [householdBudgetExact, setHouseholdBudgetExact] = useState<number>(); // If they enter exact amount
  const [maritalStatus, setMaritalStatus] = useState<string>("");
  const [householdSize, setHouseholdSize] = useState<number>(0);
  const [householdUnder18, setHouseholdUnder18] = useState<number>(0);

  // Helper for toggling items in a multiple checkbox array
  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    selectedArray: string[],
    setSelectedArray: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const { value, checked } = e.target;
    if (checked) {
      // Add the value
      setSelectedArray([...selectedArray, value]);
    } else {
      // Remove the value
      setSelectedArray(selectedArray.filter(item => item !== value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct the object that matches DemographicsData
    const formData: DemographicsData = {
      age,
      phoneNumber,
      relationshipWithChild,
      gender,
      hispanicLatinoSpanish,
      race,
      highestGrade,
      housingStatus,
      householdBudget,
      householdBudgetExact,
      householdReceived,
      maritalStatus,
      householdSize,
      householdUnder18,
      occupationalStatus,
    };

    onSubmit(formData);
  };

  return (
    <div className="border-gray-500 bg-gray-200 mx-5 mt-20 max-w-screen-md rounded-md border-2 w-full">
      <div className="flex flex-col space-y-4 p-7">
        <h1 className="text-lg font-semibold text-black">Demographics</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* D1. Age */}
          <div>
            <label htmlFor="age" className="block font-medium text-gray-700">
              D1. What is your age?
            </label>
            <input
              type="number"
              id="age"
              value={age}
              placeholder="Enter your age"
              onChange={(e) => setAge(Number(e.target.value))}
              onWheel={(e) => e.preventDefault()}
            
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />

          </div>

          {/* D2. Relationship with the child(ren) */}
          <div>
            <label htmlFor="relationshipWithChild" className="block font-medium text-gray-700">
              D2. What is your relationship with the child(ren)?
            </label>
            <select
              id="relationshipWithChild"
              value={relationshipWithChild}
              onChange={(e) => setRelationshipWithChild(e.target.value)}
            
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            >
              <option value="">Select</option>
              <option value="Parent">Parent</option>
              <option value="Grandparent">Grandparent</option>
              <option value="Guardian">Guardian</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* D3. Gender */}
          <div>
            <label htmlFor="gender" className="block font-medium text-gray-700">
              D3. What is your gender?
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            >
              <option value="">Select</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* D4. Are you of Hispanic, Latino/a, or Spanish origin? Mark all that apply. */}
          <div>
            <label className="block font-medium text-gray-700">
              D4. Are you of Hispanic, Latino/a, or Spanish origin? (Mark all that apply)
            </label>
            <div className="flex flex-col space-y-1 mt-1">
              {["No", "Mexican", "Puerto Rican", "Cuban", "Other"].map((option) => (
                <label key={option} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={option}
                    checked={hispanicLatinoSpanish.includes(option)}
                    onChange={(e) => handleCheckboxChange(e, hispanicLatinoSpanish, setHispanicLatinoSpanish)}
                    className="form-checkbox h-4 w-4 text-green-600"
                  />
                  <span className="ml-2">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* D5. What is your race? Mark all that apply. */}
          <div>
            <label className="block font-medium text-gray-700">
              D5. What is your race? (Mark all that apply)
            </label>
            <div className="flex flex-col space-y-1 mt-1">
              {[
                "White or Caucasian",
                "Black or African American",
                "American Indian or Alaska Native",
                "Asian",
                "Native American",
                "Pacific Islander",
                "Other",
              ].map((option) => (
                <label key={option} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={option}
                    checked={race.includes(option)}
                    onChange={(e) => handleCheckboxChange(e, race, setRace)}
                    className="form-checkbox h-4 w-4 text-green-600"
                  />
                  <span className="ml-2">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* D6. Highest grade or level of schooling completed */}
          <div>
            <label htmlFor="highestGrade" className="block font-medium text-gray-700">
              D6. What is the highest grade or level of schooling you have completed?
            </label>
            <select
              id="highestGrade"
              value={highestGrade}
              onChange={(e) => setHighestGrade(e.target.value)}
            
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            >
              <option value="">Select</option>
              <option value="Less than high school">Less than high school</option>
              <option value="High school graduate or GED">High school graduate or GED</option>
              <option value="Some college">Some college</option>
              <option value="Associate degree">Associate degree</option>
              <option value="Bachelor’s degree">Bachelor’s degree</option>
              <option value="Graduate degree">Graduate degree</option>
            </select>
          </div>

          {/* D7. Housing Status (multiple) */}
          <div>
            <label className="block font-medium text-gray-700">
              D7. Are you in/on ________. (Please mark all that apply)
            </label>
            <div className="flex flex-col space-y-1 mt-1">
              {["Public housing", "Section 8 rental certificates", "Section 202", "Private housing", "Other"].map(
                (option) => (
                  <label key={option} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={option}
                      checked={housingStatus.includes(option)}
                      onChange={(e) => handleCheckboxChange(e, housingStatus, setHousingStatus)}
                      className="form-checkbox h-4 w-4 text-green-600"
                    />
                    <span className="ml-2">{option}</span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* D8. Household budget */}
          <div>
            <label className="block font-medium text-gray-700">
              D8. In the past 12 months, what was your proximate household budget?
            </label>
            <div className="space-y-2 mt-1">
              {/* Exact amount */}
              <div className="flex items-center space-x-2">
              <input
                type="number"
                id="householdBudget"
                value={householdBudget}
                onChange={(e) => setHouseholdBudget(Number(e.target.value))}
                onWheel={(e) => e.preventDefault()}
              
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />

              </div>
            </div>
          </div>

          {/* D9. In the last 12 months, have you or anyone else in your household received...? */}
          <div>
            <label className="block font-medium text-gray-700">
              D9. In the last 12 months, have you or anyone else in your household received? (Mark all that apply)
            </label>
            <div className="flex flex-col space-y-1 mt-1">
              {["TANF", "Food stamp or EBT", "Unemployment Insurance", "Worker’s Compensation", "Other"].map(
                (option) => (
                  <label key={option} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={option}
                      checked={householdReceived.includes(option)}
                      onChange={(e) => handleCheckboxChange(e, householdReceived, setHouseholdReceived)}
                      className="form-checkbox h-4 w-4 text-green-600"
                    />
                    <span className="ml-2">{option}</span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* D10. Marital status */}
          <div>
            <label htmlFor="maritalStatus" className="block font-medium text-gray-700">
              D10. Marital status
            </label>
            <select
              id="maritalStatus"
              value={maritalStatus}
              onChange={(e) => setMaritalStatus(e.target.value)}
            
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            >
              <option value="">Select</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
              <option value="Separated">Separated</option>
            </select>
          </div>

          {/* D11. Household size */}
          <div>
            <label htmlFor="householdSize" className="block font-medium text-gray-700">
              D11. Including yourself, how many people currently live in your household?
            </label>
            <input
              type="number"
              id="householdSize"
              value={householdSize}
              onChange={(e) => setHouseholdSize(Number(e.target.value))}
              onWheel={(e) => e.preventDefault()}
            
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          {/* D12. Number under 18 */}
          <div>
            <label htmlFor="householdUnder18" className="block font-medium text-gray-700">
              D12. How many of your household members are under the age of 18?
            </label>
            <input
              type="number"
              id="householdUnder18"
              value={householdUnder18}
              onChange={(e) => setHouseholdUnder18(Number(e.target.value))}
              onWheel={(e) => e.preventDefault()}
            
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          {/* D13. Occupational status (multi) */}
          <div>
            <label className="block font-medium text-gray-700">
              D13. Which of the following best describes your current occupational status? (Mark all that apply)
            </label>
            <div className="flex flex-col space-y-1 mt-1">
              {[
                "Employed",
                "Unemployed for 1 year or more",
                "Unemployed for less than 1 year",
                "Homemaker",
                "Student",
                "Retired",
                "Other",
              ].map((option) => (
                <label key={option} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={option}
                    checked={occupationalStatus.includes(option)}
                    onChange={(e) => handleCheckboxChange(e, occupationalStatus, setOccupationalStatus)}
                    className="form-checkbox h-4 w-4 text-green-600"
                  />
                  <span className="ml-2">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Phone Number (repeated for clarity at the end of the survey) */}
          <div>
            <label htmlFor="phoneNumber" className="block font-medium text-gray-700">
              What is your phone number?
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          {/* Submit button */}
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
