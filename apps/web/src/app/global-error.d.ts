import React from "react";
export default function GlobalError({ error, reset }: {
    error: Error;
    reset: () => void;
}): React.JSX.Element;
