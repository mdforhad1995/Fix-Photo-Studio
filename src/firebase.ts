import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Validate connection to Firestore on boot as required by firebase-integration-rpc
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Defensive payload sanitization helpers synchronized with firebase-blueprint.json
export const SCHEMA_LIMITS = {
  ID_MAX: 128,
  ID_REGEX: /^[a-zA-Z0-9_\-]+$/,
  DISPLAY_NAME_MAX: 100,
  COMPANY_NAME_MAX: 120,
  MFA_HINT_MAX: 32,
  EMAIL_MAX: 254,
  PHONE_MAX: 40,
  ADDRESS_MAX: 300,
  ORDER_NUMBER_MAX: 32,
  PROJECT_TITLE_MAX: 140,
  INSTRUCTIONS_MAX: 2000,
  BATCH_ARRAY_MAX: 10,
  BATCH_ITEM_MAX: 160,
  MESSAGE_BODY_MAX: 1500,
  ATTACHMENT_NAME_MAX: 160,
  NOTIF_TITLE_MAX: 140,
  NOTIF_MESSAGE_MAX: 600,
  AMOUNT_MAX: 40,
  INVOICE_REF_MAX: 64,
};

export function sanitizeString(input: string, maxLength: number, fallback = ''): string {
  const trimmed = (input ?? '').trim();
  if (!trimmed && fallback) return fallback.slice(0, maxLength);
  return trimmed.slice(0, maxLength);
}

export function sanitizeId(id: string): string {
  const cleaned = id.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, SCHEMA_LIMITS.ID_MAX);
  return cleaned.length > 0 ? cleaned : 'doc_1';
}
