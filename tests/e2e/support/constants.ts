export const ROUTES = {
  home: "/",
} as const

export const TEST_DATA = {
  domains: {
    knownDomain: "User Management",
    otherDomain: "Reporting",
  },
  subdomains: {
    knownSubdomain: "Authentication",
  },
  capabilities: {
    knownCapability: "Login",
    // This capability belongs to "Reporting" domain, not "User Management"
    incompatibleCapability: "Usage Metrics",
  },
  requirements: {
    knownReqId: "AUTH-LOGIN-001",
  },
} as const

export const TIMEOUTS = {
  dataLoad: 30_000,
  animation: 500,
} as const
