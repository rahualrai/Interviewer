// app/components/ConsentForm.tsx
import React, { useState } from 'react';

interface ConsentFormProps {
  onConsentAccepted: (demographics: DemographicsData) => void;
}

interface DemographicsData {
  age: number;
  gender: string;
  occupation: string;
}

const ConsentForm: React.FC<ConsentFormProps> = ({ onConsentAccepted }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const [demographics, setDemographics] = useState<DemographicsData>({
    age: 0,
    gender: '',
    occupation: '',
  });
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    purpose: false,
    procedure: false,
    compensation: false,
    benefits: false,
    risks: false,
    confidentiality: false,
    contact: false,
  });

  const handleNext = () => {
    if (currentStep === 2 && !consentGiven) {
      alert('You must give consent to proceed.');
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    if (demographics.age <= 0 || !demographics.gender || !demographics.occupation) {
      alert('Please fill in all demographic fields.');
      return;
    }
    onConsentAccepted(demographics);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDemographics((prev) => ({
      ...prev,
      [name]: name === 'age' ? Number(value) : value,
    }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="border-gray-500 bg-gray-200 sm:mx-0 mx-5 mt-20 max-w-screen-md rounded-md border-2 sm:w-full">
      <div className="flex flex-col space-y-4 p-7 sm:p-10">
        {currentStep === 1 && (
          <div>
            <h1 className="text-lg font-semibold text-black">Introduction</h1>
            <p className="text-sm text-gray-700 mt-4">
              Welcome! We are conducting a study to understand user experiences. Your participation is greatly appreciated.
            </p>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h1 className="text-lg font-semibold text-black">Consent Form</h1>
            <div className="mt-4 space-y-2">
              {[
                {
                  key: 'purpose',
                  label: 'Purpose of the Interview',
                  summary: 'This study explores caregivers’ understanding of programs and plans to improve asthma care.',
                  detailed: 'This study aims to explore caregivers\' understanding of healthy home programs on addressing asthma, needed resources for maintaining a healthy indoor environment for children with asthma, and understanding of the Asthma Action Plan. The information learned will be used to improve the health of urban minority asthmatic children living in public housing.',
                },
                {
                  key: 'procedure',
                  label: 'Procedure',
                  summary: 'Participation involves a 30-45 minute interview.',
                  detailed: 'You will be asked to participate in a 30-45 minute interview, which can be in-person or online based on your preference. This interview is approved by the Howard University Institutional Review Board and will be audio-recorded with a note-taker present. You may withdraw at any time without affecting any services you receive.',
                },
                {
                  key: 'compensation',
                  label: 'Compensation',
                  summary: 'Receive a $50 gift card for participating.',
                  detailed: 'Upon completion of the interview, you will receive a $50 gift card as a token of appreciation.',
                },
                {
                  key: 'benefits',
                  label: 'Benefits',
                  summary: 'Your participation helps improve asthma care for families.',
                  detailed: 'The results of this research will contribute to the potential development of healthy home initiatives and programs designed to improve the quality of life for families with asthmatic children.',
                },
                {
                  key: 'risks',
                  label: 'Risks',
                  summary: 'No significant risks expected.',
                  detailed: 'No significant risks are anticipated. However, if you feel uncomfortable answering any questions, you can take a break or stop the interview. Free counseling services are available at certified community mental health centers if needed.',
                },
                {
                  key: 'confidentiality',
                  label: 'Confidentiality',
                  summary: 'Your privacy is protected.',
                  detailed: 'Your individual privacy will be maintained in all published data. Your responses will be coded by an identification number, and no identifiable information will be included in any reports.',
                },
                {
                  key: 'contact',
                  label: 'Contact Information',
                  summary: 'For questions, contact Dr. Meirong Liu.',
                  detailed: 'For questions or concerns regarding this study, contact Dr. Meirong Liu at meirong.liu@howard.edu or (202) 716-9712. For IRB-related questions, contact the Howard University Institutional Review Board at (202) 865-8597.',
                },
              ].map((section) => (
                <div
                  key={section.key}
                  className="bg-white border rounded-md p-3 shadow-sm cursor-pointer"
                  onClick={() => toggleSection(section.key)}
                >
                  <h2 className="font-medium text-gray-900">{section.label}</h2>
                  <p className="mt-2 text-sm text-gray-700">
                    {expandedSections[section.key] ? section.detailed : section.summary}
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
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
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
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
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
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={demographics.occupation}
                  onChange={handleChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Back
            </button>
          )}
          {currentStep < 3 && (
            <button
              type="button"
              onClick={handleNext}
              className={`px-4 py-2 rounded-md text-white ${
                currentStep === 2 && !consentGiven
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
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
