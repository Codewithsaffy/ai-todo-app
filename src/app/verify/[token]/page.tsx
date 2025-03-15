"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { verifyUser } from "@/actions/auth";

export default function VerificationPage() {
  const { token } = useParams();
  const router = useRouter();
  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      verifyUser(token as string)
        .then(() => {
          setMessage("Your email has been verified successfully. Redirecting to home page...");
          setTimeout(() => {
            router.push("/");
          }, 5000);
        })
        .catch((err) => {
          setError(err.message || "Verification failed. Please try again.");
        });
    }
  }, [token, router]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Email Verification</h1>
      {error ? <p style={{ color: "red" }}>{error}</p> : <p>{message}</p>}
    </div>
  );
}
