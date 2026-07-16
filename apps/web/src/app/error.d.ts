import React from "react";
export default function ErrorBoundary({ error, reset }: {
    error: Error;
    reset: () => void;
}): React.JSX.Element;
