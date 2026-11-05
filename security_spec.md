# Security Specification — FixPhoto Studio (`fixphotostudio.com`)

## 1. Data Invariants

1. **Identity & Email Verification Invariant**: Every write operation requires an authenticated user with `request.auth != null` and `request.auth.token.email_verified == true`.
2. **PII Split-Collection Isolation**: Client PII (`email`, `phone`, `billingAddress`, `mfaRecoveryCodeHash`) is isolated in `/users/{userId}/private/{docId}` where `docId == 'info'`, readable and writable strictly by `isOwner(userId)` or `isAdmin()`.
3. **Self-Role Escalation Prevention**: Users creating `/users/{userId}` can only set `role == 'client'` unless they are the verified bootstrapped admin (`asiaclipp@gmail.com`) or exist in `/admins/{uid}`. During updates, `role`, `uid`, and `createdAt` are strictly immutable for non-admins.
4. **Master Gate on Order Messages**: A message in `/orders/{orderId}/messages/{messageId}` can only be read or created if the parent `/orders/{orderId}` exists and belongs to `request.auth.uid` (or `isAdmin()`), and `incoming().orderId == orderId` and `incoming().senderId == request.auth.uid`.
5. **Terminal State Locking on Orders**: Once an `/orders/{orderId}` document reaches terminal state `status == 'completed'`, non-admin clients are blocked from mutating workflow state.
6. **Strict Timestamp Integrity**: All `createdAt` and `updatedAt` fields must equal `request.time`.
7. **Query Enforcer on List Operations**: `allow list` on `/orders` and `/notifications` strictly enforces `resource.data.clientId == request.auth.uid` (or `resource.data.userId == request.auth.uid`) or `isAdmin()`, never delegating filtering to the client.

## 2. The "Dirty Dozen" Payloads

1. **Unverified Admin Email Spoof**: `{ uid: "attacker1", role: "admin" }` sent with `email: "asiaclipp@gmail.com", email_verified: false`.
2. **Privilege Escalation on Profile Create**: `{ uid: "user1", displayName: "Attacker", role: "admin", ... }` by non-admin user.
3. **Shadow Field Injection on Order Create**: `{ orderNumber: "FPS-1", ..., isPaidOverride: true }` containing undeclared key.
4. **Cross-Tenant Order Creation (Identity Spoofing)**: `{ clientId: "victim_uid", ... }` created by `attacker_uid`.
5. **Orphaned Chat Message Creation**: Creating `/orders/non_existent_order/messages/msg1` where parent order does not exist.
6. **Cross-Order Chat Intrusion**: Creating `/orders/victim_order/messages/msg1` where `victim_order.clientId != request.auth.uid`.
7. **Terminal State Mutation**: Updating `/orders/{orderId}` when `resource.data.status == 'completed'` as a regular client.
8. **Value Poisoning on Whitelisted Update Key**: Updating `progressPercent` on `/orders/{orderId}` with `"100%"` (string instead of number 0..100).
9. **Denial-of-Wallet Oversized String**: Creating `/orders/{orderId}` with a 50,000-character `instructions` string (`maxLength: 2000`).
10. **Unbounded Array Injection**: Creating `/orders/{orderId}` with `uploadedBatchNames` containing 50 items (`maxLength: 10`).
11. **Client Timestamp Forgery**: Creating `/notifications/{id}` with `createdAt` set to a past timestamp (`request.time - 1000s`).
12. **PII Horizontal Lateral Read**: Authenticated `userA` attempting `get(/users/userB/private/info)`.
