/**
 * Firestore Security Rules Test Suite — FixPhoto Studio
 * Verifies all "Dirty Dozen" adversarial payloads return PERMISSION_DENIED.
 */

export interface DirtyDozenTestCase {
  id: number;
  name: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  path: string;
  auth: { uid: string; email?: string; email_verified?: boolean } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED';
}

export const DIRTY_DOZEN_TESTS: DirtyDozenTestCase[] = [
  {
    id: 1,
    name: 'Unverified Admin Email Spoof',
    operation: 'create',
    path: '/users/attacker1',
    auth: { uid: 'attacker1', email: 'asiaclipp@gmail.com', email_verified: false },
    payload: { uid: 'attacker1', displayName: 'Spoofer', role: 'admin' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Privilege Escalation on Profile Create',
    operation: 'create',
    path: '/users/user1',
    auth: { uid: 'user1', email: 'user1@example.com', email_verified: true },
    payload: { uid: 'user1', displayName: 'User 1', role: 'admin' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Shadow Field Injection on Order Create',
    operation: 'create',
    path: '/orders/order_shadow_1',
    auth: { uid: 'user1', email: 'user1@example.com', email_verified: true },
    payload: {
      orderNumber: 'FPS-101',
      clientId: 'user1',
      isPaidOverride: true,
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Cross-Tenant Order Creation (Identity Spoofing)',
    operation: 'create',
    path: '/orders/order_spoof_1',
    auth: { uid: 'attacker1', email: 'attacker@example.com', email_verified: true },
    payload: {
      orderNumber: 'FPS-102',
      clientId: 'victim_uid',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Orphaned Chat Message Creation',
    operation: 'create',
    path: '/orders/missing_order_999/messages/msg_1',
    auth: { uid: 'user1', email: 'user1@example.com', email_verified: true },
    payload: {
      orderId: 'missing_order_999',
      senderId: 'user1',
      senderName: 'User 1',
      senderRole: 'client',
      body: 'Hello',
      attachmentName: '',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Cross-Order Chat Intrusion',
    operation: 'create',
    path: '/orders/victim_order_1/messages/msg_2',
    auth: { uid: 'attacker1', email: 'attacker@example.com', email_verified: true },
    payload: {
      orderId: 'victim_order_1',
      senderId: 'attacker1',
      senderName: 'Attacker',
      senderRole: 'client',
      body: 'Snooping on order',
      attachmentName: '',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Terminal State Mutation on Completed Order',
    operation: 'update',
    path: '/orders/completed_order_1',
    auth: { uid: 'user1', email: 'user1@example.com', email_verified: true },
    payload: {
      status: 'clipping',
      progressPercent: 20,
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Value Poisoning on Whitelisted Update Key',
    operation: 'update',
    path: '/orders/active_order_1',
    auth: { uid: 'user1', email: 'user1@example.com', email_verified: true },
    payload: {
      progressPercent: 'ONE_HUNDRED_PERCENT',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Denial-of-Wallet Oversized String',
    operation: 'create',
    path: '/orders/oversized_order_1',
    auth: { uid: 'user1', email: 'user1@example.com', email_verified: true },
    payload: {
      instructions: 'A'.repeat(5000),
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Unbounded Array Injection',
    operation: 'create',
    path: '/orders/array_overflow_1',
    auth: { uid: 'user1', email: 'user1@example.com', email_verified: true },
    payload: {
      uploadedBatchNames: Array.from({ length: 25 }, (_, i) => `file_${i}.raw`),
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Client Timestamp Forgery',
    operation: 'create',
    path: '/notifications/notif_forged_1',
    auth: { uid: 'user1', email: 'user1@example.com', email_verified: true },
    payload: {
      userId: 'user1',
      createdAt: '2020-01-01T00:00:00Z',
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'PII Horizontal Lateral Read',
    operation: 'get',
    path: '/users/victim_user/private/info',
    auth: { uid: 'attacker_user', email: 'attacker@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
];
