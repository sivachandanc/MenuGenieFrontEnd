import { useEffect, useState } from "react";
import { supabaseClient } from "../../supabase-utils/SupaBaseClient";

function MiddlewareTest() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const testProtectedEndpoint = async () => {
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    if (!session) {
      setError("No active session found. Please log in.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Unknown error");
      setResponse(result);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    testProtectedEndpoint();
  }, []);

  return (
    <div className="text-sm bg-white border p-4 rounded shadow">
      <h3 className="font-semibold mb-2">Middleware Test Result</h3>
      {response && <pre className="text-green-600">{JSON.stringify(response, null, 2)}</pre>}
      {error && <pre className="text-red-600">{error}</pre>}
    </div>
  );
}

export default MiddlewareTest;
