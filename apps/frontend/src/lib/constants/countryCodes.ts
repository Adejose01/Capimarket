export interface CountryCode {
  code: string;
  label: string;
  country: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: "+58", label: "🇻🇪 +58", country: "Venezuela" },
  { code: "+57", label: "🇨🇴 +57", country: "Colombia" },
  { code: "+1", label: "🇺🇸 +1", country: "Estados Unidos" },
  { code: "+52", label: "🇲🇽 +52", country: "México" },
  { code: "+54", label: "🇦🇷 +54", country: "Argentina" },
  { code: "+56", label: "🇨🇱 +56", country: "Chile" },
  { code: "+34", label: "🇪🇸 +34", country: "España" },
  { code: "+51", label: "🇵🇪 +51", country: "Perú" },
  { code: "+593", label: "🇪🇨 +593", country: "Ecuador" },
];

export const DEFAULT_COUNTRY_CODE = "+58";
