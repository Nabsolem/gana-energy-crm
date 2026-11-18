export type ScoringWeights = {
  newCustomer: number;
  commercialInterest: number;
  source: number;
  age: number;
};

const ADMIN_HEADERS = {
  "x-agent-id": "3",
  "x-role": "ADMIN",
};

export async function getScoringConfiguration(): Promise<{
  data: ScoringWeights;
}> {
  const response = await fetch(
    "/api/scoring/configuration",
    {
      headers: ADMIN_HEADERS,
    }
  );

  if (!response.ok) {
    throw new Error(
      "No se pudo cargar la configuración"
    );
  }

  return response.json();
}

export async function updateScoringConfiguration(
  weights: ScoringWeights
) {
  const response = await fetch(
    "/api/scoring/configuration",
    {
      method: "POST",

      headers: {
        ...ADMIN_HEADERS,
        "Content-Type": "application/json",
      },

      body: JSON.stringify(weights),
    }
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new Error(
      body?.message ??
        "No se pudo guardar la configuración"
    );
  }

  return response.json();
}