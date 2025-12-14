import React, { useReducer, useCallback, useEffect } from "react";

// Create a context for sharing health analysis data
const HealthContext = React.createContext<{
  analysisHistory: string[];
  addAnalysis: (analysis: string) => void;
} | null>(null);

interface HealthState {
  symptoms: string[];
  diagnosis: string | null;
  recommendations: string[];
  isAnalyzing: boolean;
  petInfo: {
    name: string;
    age: number;
    type: string;
  };
}

type HealthAction =
  | { type: "ADD_SYMPTOM"; symptom: string }
  | { type: "REMOVE_SYMPTOM"; index: number }
  | { type: "SET_PET_INFO"; info: Partial<HealthState["petInfo"]> }
  | { type: "START_ANALYSIS" }
  | { type: "COMPLETE_ANALYSIS"; diagnosis: string; recommendations: string[] }
  | { type: "RESET" };

const initialState: HealthState = {
  symptoms: [],
  diagnosis: null,
  recommendations: [],
  isAnalyzing: false,
  petInfo: {
    name: "",
    age: 0,
    type: "",
  },
};

const healthReducer = (
  state: HealthState,
  action: HealthAction
): HealthState => {
  switch (action.type) {
    case "ADD_SYMPTOM":
      return {
        ...state,
        symptoms: [...state.symptoms, action.symptom],
      };
    case "REMOVE_SYMPTOM":
      return {
        ...state,
        symptoms: state.symptoms.filter((_, index) => index !== action.index),
      };
    case "SET_PET_INFO":
      return {
        ...state,
        petInfo: {
          ...state.petInfo,
          ...action.info,
        },
      };
    case "START_ANALYSIS":
      return {
        ...state,
        isAnalyzing: true,
      };
    case "COMPLETE_ANALYSIS":
      return {
        ...state,
        isAnalyzing: false,
        diagnosis: action.diagnosis,
        recommendations: action.recommendations,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

interface PetHealthAnalyzerProps {
  onHealthAnalyze?: (
    petInfo: HealthState["petInfo"],
    symptoms: string[]
  ) => void;
  onPrescription?: (diagnosis: string) => void;
  initialPetInfo?: Partial<HealthState["petInfo"]>;
}

const PetHealthAnalyzer: React.FC<PetHealthAnalyzerProps> = ({
  onHealthAnalyze,
  onPrescription,
  initialPetInfo = {},
}) => {
  const [state, dispatch] = useReducer(healthReducer, {
    ...initialState,
    petInfo: {
      ...initialState.petInfo,
      ...initialPetInfo,
    },
  });

  const [analysisHistory, setAnalysisHistory] = React.useState<string[]>([]);

  useEffect(() => {
    if (state.diagnosis) {
      const analysis = `${new Date().toLocaleString()}: ${
        state.petInfo.name
      } - ${state.diagnosis}`;
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setAnalysisHistory((prev) => [analysis, ...prev.slice(0, 4)]);
      }, 0);
    }
  }, [state.diagnosis, state.petInfo.name]);

  const contextValue = React.useMemo(
    () => ({
      analysisHistory,
      addAnalysis: (analysis: string) =>
        setAnalysisHistory((prev) => [analysis, ...prev.slice(0, 4)]),
    }),
    [analysisHistory]
  );

  const commonSymptoms = [
    "Loss of appetite",
    "Lethargy",
    "Vomiting",
    "Diarrhea",
    "Coughing",
    "Difficulty breathing",
    "Excessive thirst",
    "Weight loss",
    "Skin irritation",
    "Limping",
  ];

  const generateDiagnosis = useCallback(
    (petInfo: HealthState["petInfo"], symptoms: string[]): string => {
      if (symptoms.includes("Difficulty breathing")) {
        return "Respiratory distress - immediate veterinary attention required";
      } else if (
        symptoms.includes("Vomiting") &&
        symptoms.includes("Diarrhea")
      ) {
        return "Gastrointestinal upset - possible food poisoning or infection";
      } else if (symptoms.includes("Limping")) {
        return "Musculoskeletal injury - possible sprain or fracture";
      } else {
        return "General health concern - further examination recommended";
      }
    },
    []
  );

  const generateRecommendations = useCallback(
    (symptoms: string[]): string[] => {
      const recommendations = [];

      if (symptoms.includes("Loss of appetite")) {
        recommendations.push("Monitor food intake and offer favorite treats");
      }
      if (symptoms.includes("Lethargy")) {
        recommendations.push("Ensure rest and comfortable environment");
      }
      if (symptoms.includes("Vomiting") || symptoms.includes("Diarrhea")) {
        recommendations.push("Provide plenty of fresh water");
        recommendations.push("Consider bland diet (boiled chicken and rice)");
      }
      if (symptoms.includes("Difficulty breathing")) {
        recommendations.push("Seek immediate veterinary care");
      }
      if (symptoms.includes("Skin irritation")) {
        recommendations.push("Check for parasites or allergies");
      }

      recommendations.push("Schedule regular veterinary check-up");
      return recommendations;
    },
    []
  );

  const handleAnalyze = useCallback(() => {
    if (!state.petInfo.name || state.symptoms.length === 0) {
      alert("Please enter pet information and select symptoms");
      return;
    }

    dispatch({ type: "START_ANALYSIS" });

    setTimeout(() => {
      const diagnosis = generateDiagnosis(state.petInfo, state.symptoms);
      const recommendations = generateRecommendations(state.symptoms);

      dispatch({
        type: "COMPLETE_ANALYSIS",
        diagnosis,
        recommendations,
      });

      onHealthAnalyze?.(state.petInfo, state.symptoms);
    }, 2000);
  }, [
    state.petInfo,
    state.symptoms,
    onHealthAnalyze,
    generateDiagnosis,
    generateRecommendations,
  ]);

  const handlePrescription = () => {
    if (state.diagnosis) {
      onPrescription?.(state.diagnosis);
    }
  };

  return (
    <HealthContext.Provider value={contextValue}>
      <div
        style={{
          padding: "2rem",
          border: "1px solid #e5e7eb",
          borderRadius: "0.5rem",
          margin: "1rem 0",
        }}
      >
        <h2 style={{ color: "#1f2937", marginBottom: "1.5rem" }}>
          Pet Health Analyzer
        </h2>

        <div style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ color: "#374151", marginBottom: "1rem" }}>
            Pet Information
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
            }}
          >
            <input
              type="text"
              placeholder="Pet Name"
              value={state.petInfo.name}
              onChange={(e) =>
                dispatch({
                  type: "SET_PET_INFO",
                  info: { name: e.target.value },
                })
              }
              style={{
                padding: "0.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
              }}
            />
            <input
              type="number"
              placeholder="Age"
              value={state.petInfo.age || ""}
              onChange={(e) =>
                dispatch({
                  type: "SET_PET_INFO",
                  info: { age: parseInt(e.target.value) || 0 },
                })
              }
              style={{
                padding: "0.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
              }}
            />
            <input
              type="text"
              placeholder="Type (Dog/Cat/etc)"
              value={state.petInfo.type}
              onChange={(e) =>
                dispatch({
                  type: "SET_PET_INFO",
                  info: { type: e.target.value },
                })
              }
              style={{
                padding: "0.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ color: "#374151", marginBottom: "1rem" }}>Symptoms</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "0.5rem",
            }}
          >
            {commonSymptoms.map((symptom, index) => (
              <label
                key={index}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <input
                  type="checkbox"
                  checked={state.symptoms.includes(symptom)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      dispatch({ type: "ADD_SYMPTOM", symptom });
                    } else {
                      const symptomIndex = state.symptoms.indexOf(symptom);
                      dispatch({ type: "REMOVE_SYMPTOM", index: symptomIndex });
                    }
                  }}
                />
                {symptom}
              </label>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ color: "#374151", marginBottom: "0.5rem" }}>
            Selected Symptoms:
          </h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {state.symptoms.map((symptom, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: "#dbeafe",
                  color: "#1e40af",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "0.25rem",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                }}
                onClick={() => dispatch({ type: "REMOVE_SYMPTOM", index })}
              >
                {symptom} ×
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
          <button
            onClick={handleAnalyze}
            disabled={state.isAnalyzing}
            style={{
              backgroundColor: state.isAnalyzing ? "#9ca3af" : "#2563eb",
              color: "white",
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "0.375rem",
              cursor: state.isAnalyzing ? "not-allowed" : "pointer",
            }}
          >
            {state.isAnalyzing ? "Analyzing..." : "Analyze Health"}
          </button>
          <button
            onClick={() => dispatch({ type: "RESET" })}
            style={{
              backgroundColor: "#f3f4f6",
              color: "#374151",
              padding: "0.75rem 1.5rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>

        {state.diagnosis && (
          <div
            style={{
              backgroundColor: "#f0fdf4",
              padding: "1rem",
              borderRadius: "0.375rem",
              marginBottom: "1rem",
            }}
          >
            <h3 style={{ color: "#166534", marginBottom: "0.5rem" }}>
              Diagnosis:
            </h3>
            <p style={{ color: "#15803d", marginBottom: "1rem" }}>
              {state.diagnosis}
            </p>

            <h4 style={{ color: "#166534", marginBottom: "0.5rem" }}>
              Recommendations:
            </h4>
            <ul style={{ color: "#15803d", paddingLeft: "1.5rem" }}>
              {state.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>

            <button
              onClick={handlePrescription}
              style={{
                backgroundColor: "#059669",
                color: "white",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
                marginTop: "1rem",
              }}
            >
              Get Prescription
            </button>
          </div>
        )}
      </div>
    </HealthContext.Provider>
  );
};

export default PetHealthAnalyzer;
