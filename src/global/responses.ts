export const ProviderResponses = {
  providerNotFound: {
    notFound: true,
    outTime: false,
    hasAutomaticUpdate: false,
    success: false,
  },
  updateTimeExpired: {
    notFound: false,
    outTime: true,
    hasAutomaticUpdate: false,
    success: false,
  },
  automaticUpdateLimitReached: {
    notFound: false,
    outTime: false,
    hasAutomaticUpdate: true,
    success: false,
  },
  updateSuccessful: {
    notFound: false,
    outTime: false,
    hasAutomaticUpdate: false,
    success: true,
  },
};
