const VALIDATION_ENDPOINT =
  "https://api.lemonsqueezy.com/v1/licenses/validate";

export type LicenseValidationResult =
  | {
      kind: "valid";
      licenseKey: string;
    }
  | {
      kind: "invalid";
      reason: string;
    };

type LemonSqueezyValidationResponse = {
  valid?: boolean;
  error?: string;
  license_key?: {
    status?: string;
  };
};

export async function validateLicenseKey(
  licenseKey: string,
): Promise<LicenseValidationResult> {
  const normalized = licenseKey.trim();
  if (!normalized) {
    return { kind: "invalid", reason: "License key is required." };
  }

  try {
    const response = await fetch(VALIDATION_ENDPOINT, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new URLSearchParams({ license_key: normalized }),
    });

    if (!response.ok) {
      return {
        kind: "invalid",
        reason: `Validation request failed (${response.status}).`,
      };
    }

    const data = (await response.json()) as LemonSqueezyValidationResponse;

    if (data.valid && data.license_key?.status === "active") {
      return { kind: "valid", licenseKey: normalized };
    }

    return {
      kind: "invalid",
      reason: data.error ?? "License key is not active.",
    };
  } catch (error) {
    return {
      kind: "invalid",
      reason:
        error instanceof Error
          ? `Validation failed: ${error.message}`
          : "Validation failed.",
    };
  }
}
