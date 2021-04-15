import crypto from "crypto"

export default function randomHash(): string {
  return crypto.randomBytes(5).toString("hex")
}
