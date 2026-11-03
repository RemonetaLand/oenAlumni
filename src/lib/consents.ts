import type { Member } from "../generated/prisma/client";
import type { OptionalConsents } from "./validation";

export const consentsOf = (m: Pick<Member, "consentEvents" | "consentShareOxford" | "consentShareThirdParties" | "consentCommGroups" | "consentVolunteer">): OptionalConsents => ({
  events: m.consentEvents, shareOxford: m.consentShareOxford, shareThirdParties: m.consentShareThirdParties,
  commGroups: m.consentCommGroups, volunteer: m.consentVolunteer,
});
