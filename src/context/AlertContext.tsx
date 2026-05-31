// src/context/AlertContext.tsx
import { createContext, useContext, useState, type ReactNode} from "react";
import { motion, AnimatePresence } from "framer-motion";

type AlertType = "success" | "error" | "info" | "confirm" | "danger";

interface AlertOptions {
  title: string;
  message: string;
  type?: AlertType;
  onConfirm?: () => void; // Only used for "confirm" or "danger" types
}

interface AlertContextType {
  showAlert: (options: AlertOptions) => void;
  closeAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alertData, setAlertData] = useState<AlertOptions | null>(null);

  const showAlert = (options: AlertOptions) => {
    setAlertData({ type: "info", ...options });
    setIsOpen(true);
  };

  const closeAlert = () => {
    setIsOpen(false);
    // Wait for the exit animation to finish before clearing the data
    setTimeout(() => setAlertData(null), 300); 
  };

  const handleConfirm = () => {
    if (alertData?.onConfirm) {
      alertData.onConfirm();
    }
    closeAlert();
  };

  return (
    <AlertContext.Provider value={{ showAlert, closeAlert }}>
      {children}

      {/* THE CUSTOM MODAL UI */}
      <AnimatePresence>
        {isOpen && alertData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* The Blurred Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAlert} // Clicking outside closes it
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            ></motion.div>

            {/* The Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 overflow-hidden z-10"
            >
              {/* Dynamic Icon based on type */}
              <div className="flex justify-center mb-4">
                {alertData.type === "success" && (
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}
                {alertData.type === "error" && (
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </div>
                )}
                {alertData.type === "danger" && (
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                )}
                {(alertData.type === "info" || alertData.type === "confirm") && (
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                )}
              </div>

              {/* Text Content */}
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{alertData.title}</h3>
                <p className="text-gray-500 text-sm">{alertData.message}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {(alertData.type === "confirm" || alertData.type === "danger") ? (
                  <>
                    <button
                      onClick={closeAlert}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirm}
                      className={`flex-1 px-4 py-3 text-white font-semibold rounded-lg transition-colors shadow-md ${
                        alertData.type === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      Confirm
                    </button>
                  </>
                ) : (
                  <button
                    onClick={closeAlert}
                    className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                  >
                    Okay
                  </button>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used within an AlertProvider");
  return context;
};