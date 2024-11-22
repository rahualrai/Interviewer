// app/components/ConsentForm.tsx
import React, { useState } from "react";

interface ConsentFormProps {
  onConsentAccepted: (demographics: DemographicsData) => void;
}

interface DemographicsData {
  age: number | string;
  gender: string;
  occupation: string;
  relationship: string;
  hispanicOrigin: string[];
  race: string[];
  educationLevel: string;
  housingSituation: string[];
  householdBudget: string;
  assistanceReceived: string[];
  maritalStatus: string;
  householdSize: number | string;
  membersUnder18: number | string;
  occupationalStatus: string[];
}

const ConsentForm: React.FC<ConsentFormProps> = ({ onConsentAccepted }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const [demographics, setDemographics] = useState<DemographicsData>({
    age: "",
    gender: "",
    occupation: "",
    relationship: "",
    hispanicOrigin: [],
    race: [],
    educationLevel: "",
    housingSituation: [],
    householdBudget: "",
    assistanceReceived: [],
    maritalStatus: "",
    householdSize: "",
    membersUnder18: "",
    occupationalStatus: [],
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    purpose: false,
    procedure: false,
    compensation: false,
    benefits: false,
    risks: false,
    confidentiality: false,
    contact: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDemographics((prev) => ({
      ...prev,
      [name]:
        ["age", "householdSize", "membersUnder18"].includes(name) &&
        (value === "" || isNaN(Number(value)))
          ? ""
          : ["age", "householdSize", "membersUnder18"].includes(name)
          ? Number(value)
          : value,
    }));
  };

  const handleMultipleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof DemographicsData
  ) => {
    const { value, checked } = e.target;
    setDemographics((prev) => {
      const currentValues = (prev[field as keyof DemographicsData] ?? []) as string[];
      if (checked) {
        // Add the value if the checkbox is checked
        return { ...prev, [field]: [...currentValues, value] };
      } else {
        // Remove the value if the checkbox is unchecked
        return {
          ...prev,
          [field]: currentValues.filter((item) => item !== value),
        };
      }
    });
  };

  const handleSubmit = () => {
    if (
      !demographics.age ||
      Number(demographics.age) <= 0 ||
      !demographics.householdSize ||
      Number(demographics.householdSize) <= 0 ||
      !demographics.membersUnder18 ||
      Number(demographics.membersUnder18) < 0 ||
      !demographics.gender ||
      !demographics.occupation ||
      !demographics.relationship ||
      !demographics.educationLevel ||
      !demographics.householdBudget ||
      !demographics.maritalStatus
    ) {
      console.log("Demographic data not filled or invalid:", demographics);
      alert("Please fill in all demographic fields.");
      return;
    }
  
    console.log("Demographic data submitted:", demographics);
    onConsentAccepted(demographics);
  };
  

  return (
    <div className="border-gray-500 bg-gray-200 sm:mx-0 mx-5 mt-20 max-w-screen-md rounded-md border-2 sm:w-full">
      <div className="flex flex-col space-y-4 p-7 sm:p-10">
        {currentStep === 1 && (
          <div>
            <h1 className="text-lg font-semibold text-black">Introduction</h1>
            <div className="mt-4">
              <p className="text-sm text-gray-700">
                Welcome! This project is a collaboration between the Princeton
                Alliance for Collaborative Research and Innovation (PACRI) and
                the Howard University School of Social Work. We are conducting a
                study to better understand user experiences and improve
                community programs. Your participation is greatly appreciated.
              </p>
              <div className="mt-4 flex space-x-4">
                <div className="flex-1">
                  <img
                    src="/pictures/princeton.png"
                    alt="PACRI Logo"
                    className="w-full h-40 object-contain rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <img
                    src="/pictures/howard.png"
                    alt="Howard University School of Social Work"
                    className="w-full h-40 object-contain rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h1 className="text-lg font-semibold text-black">Consent Form</h1>
            <div className="mt-4 space-y-2">
              {[
                {
                  key: "purpose",
                  label: "Purpose of the Interview",
                  summary:
                    "This study explores caregivers’ understanding of programs and plans to improve asthma care.",
                  detailed:
                    "This study aims to explore caregivers' understanding of healthy home programs on addressing asthma, needed resources for maintaining a healthy indoor environment for children with asthma, and understanding of the Asthma Action Plan. The information gathered during this chatbot interview will be used to improve the health of urban minority asthmatic children living in public housing.",
                },
                {
                  key: "procedure",
                  label: "Procedure",
                  summary:
                    "Participation involves a 30-45 minute chatbot interview.",
                  detailed:
                    "You will participate in a 30-45 minute interview conducted via a chatbot, which can be accessed online at your convenience. This interview is approved by the Howard University Institutional Review Board and will be automatically recorded for analysis. You may choose to end the interview at any time without affecting any services you receive.",
                },
                {
                  key: "compensation",
                  label: "Compensation",
                  summary: "Receive a $50 gift card for participating.",
                  detailed:
                    "Upon completing the chatbot interview, you will receive a $50 gift card as a token of appreciation.",
                },
                {
                  key: "benefits",
                  label: "Benefits",
                  summary:
                    "Your participation helps improve asthma care for families.",
                  detailed:
                    "The insights gained from your responses will contribute to the development of programs and resources designed to improve the quality of life for families with asthmatic children in public housing.",
                },
                {
                  key: "risks",
                  label: "Risks",
                  summary: "No significant risks expected.",
                  detailed:
                    "No significant risks are anticipated. However, if you feel uncomfortable with any question, you may pause or stop the chatbot interview at any time. Free counseling services are available at certified community mental health centers if needed.",
                },
                {
                  key: "confidentiality",
                  label: "Confidentiality",
                  summary: "Your privacy is protected.",
                  detailed:
                    "Your individual privacy will be maintained in all published data. Your responses will be coded by an identification number, and no identifiable information will be included in any reports.",
                },
                {
                  key: "contact",
                  label: "Contact Information",
                  summary: "For questions, contact Dr. Meirong Liu.",
                  detailed:
                    "If you have any questions or concerns about this chatbot-based interview, please contact Dr. Meirong Liu at meirong.liu@howard.edu or (202) 716-9712. For IRB-related questions, contact the Howard University Institutional Review Board at (202) 865-8597.",
                },
              ].map((section) => (
                <div
                  key={section.key}
                  className="bg-white border rounded-md p-3 shadow-sm cursor-pointer"
                  onClick={() => toggleSection(section.key)}
                >
                  <h2 className="font-medium text-gray-900">{section.label}</h2>
                  <p className="mt-2 text-sm text-gray-700">
                    {expandedSections[section.key]
                      ? section.detailed
                      : section.summary}
                  </p>
                </div>
              ))}
            </div>
            <label className="flex items-center mt-4">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={() => setConsentGiven(!consentGiven)}
                className="mr-2"
              />
              I have read and agree to the terms.
            </label>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h1 className="text-lg font-semibold text-black">Demographics</h1>
            <div className="mt-4 space-y-4">
              {/* Age Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={demographics.age}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  min="0"
                  required
                />
              </div>

              {/* Occupation Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Occupation
                </label>
                <input
                  type="text"
                  name="occupation"
                  value={demographics.occupation}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                />
              </div>

              {/* Relationship Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Relationship to the Child(ren)
                </label>
                <select
                  name="relationship"
                  value={demographics.relationship}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Grandparent">Grandparent</option>
                  <option value="Other">Other (specify)</option>
                </select>
              </div>

              {/* Gender Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  name="gender"
                  value={demographics.gender}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other (specify)</option>
                </select>
              </div>

              {/* Hispanic Origin Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Hispanic, Latino/a, or Spanish Origin
                </label>
                <ul className="mt-1 space-y-2">
                  {["No", "Mexican", "Puerto Rican", "Cuban", "Other"].map(
                    (option) => (
                      <li key={option} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={option}
                          checked={demographics.hispanicOrigin.includes(option)}
                          onChange={(e) =>
                            handleMultipleChange(e, "hispanicOrigin")
                          }
                          className="form-checkbox"
                        />
                        <span>
                          {option === "No"
                            ? "No, not of Hispanic, Latino/a, or Spanish origin"
                            : `Yes, ${option}`}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Race Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Race
                </label>
                <ul className="mt-1 space-y-2">
                  {[
                    "White",
                    "Black",
                    "American Indian",
                    "Asian",
                    "Native American",
                    "Pacific Islander",
                    "Other",
                  ].map((race) => (
                    <li key={race} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={race}
                        checked={demographics.race.includes(race)}
                        onChange={(e) => handleMultipleChange(e, "race")}
                        className="form-checkbox"
                      />
                      <span>{race}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Education Level Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Education Level
                </label>
                <select
                  name="educationLevel"
                  value={demographics.educationLevel}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select</option>
                  <option value="Some high school or less">
                    Some high school or less
                  </option>
                  <option value="High school diploma or GED">
                    High school diploma or GED equivalent
                  </option>
                  <option value="Some college">
                    Some college or vocational training
                  </option>
                  <option value="Bachelor's or higher">
                    Bachelor’s degree or higher
                  </option>
                </select>
              </div>

              {/* Housing Situation Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Housing Situation
                </label>
                <ul className="mt-1 space-y-2">
                  {[
                    "Public housing",
                    "Section 8 rental certificates",
                    "Section 202",
                    "Private housing",
                    "Other",
                  ].map((option) => (
                    <li key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={option}
                        checked={demographics.housingSituation.includes(option)}
                        onChange={(e) =>
                          handleMultipleChange(e, "housingSituation")
                        }
                        className="form-checkbox"
                      />
                      <span>{option}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Household Budget Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Household Budget (Last 12 months)
                </label>
                <select
                  name="householdBudget"
                  value={demographics.householdBudget}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select</option>
                  <option value="$0 to $10,000">$0 to $10,000</option>
                  <option value="$10,001 to $25,000">$10,001 to $25,000</option>
                  <option value="$25,001 to $40,000">$25,001 to $40,000</option>
                  <option value="$40,001 to $55,000">$40,001 to $55,000</option>
                  <option value="$55,001 to $75,000">$55,001 to $75,000</option>
                  <option value="$75,001 to $90,000">$75,001 to $90,000</option>
                  <option value="$90,001 to $105,000">
                    $90,001 to $105,000
                  </option>
                  <option value="More than $105,000">More than $105,000</option>
                </select>
              </div>

              {/* Assistance Received Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assistance Received (Last 12 months)
                </label>
                <ul className="mt-1 space-y-2">
                  {[
                    "TANF",
                    "Food stamps",
                    "Unemployment Insurance",
                    "Worker’s Compensation",
                    "Other",
                  ].map((assistance) => (
                    <li
                      key={assistance}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        value={assistance}
                        checked={demographics.assistanceReceived.includes(
                          assistance
                        )}
                        onChange={(e) =>
                          handleMultipleChange(e, "assistanceReceived")
                        }
                        className="form-checkbox"
                      />
                      <span>{assistance}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Marital Status Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Marital Status
                </label>
                <select
                  name="maritalStatus"
                  value={demographics.maritalStatus}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select</option>
                  <option value="Married">Married</option>
                  <option value="Living with partner">
                    Living as married or with a partner
                  </option>
                  <option value="Separated">Separated</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Single">Single, never married</option>
                </select>
              </div>

              {/* Household Size Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Household Size
                </label>
                <input
                  type="number"
                  name="householdSize"
                  value={demographics.householdSize}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  min="1"
                  required
                />
              </div>

              {/* Members Under 18 Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Members Under 18
                </label>
                <input
                  type="number"
                  name="membersUnder18"
                  value={demographics.membersUnder18}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  min="0"
                  required
                />
              </div>

              {/* Occupational Status Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Occupational Status
                </label>
                <ul className="mt-1 space-y-2">
                  {[
                    "Employed",
                    "Unemployed for 1 year or more",
                    "Unemployed for less than 1 year",
                    "Homemaker",
                    "Student",
                    "Retired",
                    "Other",
                  ].map((status) => (
                    <li key={status} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={status}
                        checked={demographics.occupationalStatus.includes(
                          status
                        )}
                        onChange={(e) =>
                          handleMultipleChange(e, "occupationalStatus")
                        }
                        className="form-checkbox"
                      />
                      <span>{status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Back
            </button>
          )}
          {currentStep < 3 && (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className={`px-4 py-2 rounded-md text-white ${
                currentStep === 2 && !consentGiven
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
              disabled={currentStep === 2 && !consentGiven}
            >
              Next
            </button>
          )}
          {currentStep === 3 && (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsentForm;
