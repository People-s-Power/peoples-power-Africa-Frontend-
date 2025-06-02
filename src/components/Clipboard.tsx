import React, { useState } from "react";

interface ClipboardButtonProps {
    textToCopy: string;
    onSuccess?: () => void;
    className?: string;
    children: React.ReactNode
}

export function ClipboardButton({ textToCopy, onSuccess, className, children }: ClipboardButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            onSuccess && onSuccess();

            setTimeout(() => setCopied(false), 2000); // Reset copied state after 2s
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`btn btn-primary ${className || ""}`}
            aria-label="Copy link to clipboard"
        >
            {copied ? "Copied!" : children}
        </button>
    );
}
