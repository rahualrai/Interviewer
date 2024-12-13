// app/components/ConsentForm.tsx
import React, { useState } from "react";

interface ConsentFormProps {
  onConsentAccepted: () => void;
}

const ConsentForm: React.FC<ConsentFormProps> = ({ onConsentAccepted }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [consentGiven, setConsentGiven] = useState<boolean>(false);

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

  const handleSubmit = () => {
    if (!consentGiven) { 
      alert("Please read and agree to the terms before proceeding.");
      return;
    }
    onConsentAccepted();
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
              {/* Consent sections */}
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
          {currentStep < 2 && (
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
          {currentStep === 2 && (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Start Chat
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsentForm;