import { LoaderCircle } from "lucide-react";
import React from "react";

export default function useSpinner() {
  const [isLoading, setIsLoading] = React.useState(false);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  const spinnerComponent = isLoading ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <LoaderCircle className="size-20 animate-spin text-white" />
    </div>
  ) : null;

  return { spinnerComponent, startLoading, stopLoading };
}
