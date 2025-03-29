import { createActor, canisterId } from "../../../declarations/decentralearn_backend";
import { AuthClient } from "@dfinity/auth-client";

export const getBackendActor = async () => {
  const authClient = await AuthClient.create();
  const identity = authClient.getIdentity();

  return createActor(canisterId, {
    agentOptions: { identity }
  });
};