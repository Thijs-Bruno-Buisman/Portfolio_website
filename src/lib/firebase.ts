import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  collection, 
  getDocFromServer, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, EvidenceItem } from '../types';
import { initialProfile, initialEvidenceItems } from '../data/initialData';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Must include firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

export async function testConnection() {
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

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
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

// -------------------------------------------------------------
// Database Operations: Profile & Evidence
// -------------------------------------------------------------

export function subscribeProfile(
  onProfileChange: (profile: UserProfile) => void
) {
  const profileDocRef = doc(db, 'profiles', 'main');
  return onSnapshot(
    profileDocRef,
    async (snapshot) => {
      if (snapshot.exists()) {
        onProfileChange(snapshot.data() as UserProfile);
      } else {
        // First-time seed
        try {
          await setDoc(profileDocRef, initialProfile);
          onProfileChange(initialProfile);
        } catch (e) {
          // If unauthenticated, fallback to initialProfile
          onProfileChange(initialProfile);
        }
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'profiles/main');
    }
  );
}

/**
 * Recursively removes undefined values or replaces with defaults to ensure Firestore never throws
 * "Function setDoc() called with invalid data. Unsupported field value: undefined"
 */
function sanitizeForFirestore<T>(data: T): T {
  if (data === undefined) {
    return '' as unknown as T;
  }
  if (data === null || typeof data !== 'object') {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map(item => sanitizeForFirestore(item)) as unknown as T;
  }
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(data as Record<string, any>)) {
    if (value !== undefined) {
      result[key] = sanitizeForFirestore(value);
    } else {
      result[key] = '';
    }
  }
  return result as T;
}

export async function saveProfileToFirestore(profile: UserProfile) {
  const profileDocRef = doc(db, 'profiles', 'main');
  const safeProfile = sanitizeForFirestore({
    ...profile,
    name: profile.name || '',
    studentNumber: profile.studentNumber || '',
    institution: profile.institution || '',
    minor: profile.minor || '',
    studyTrack: profile.studyTrack || '',
    bio: profile.bio || '',
    avatarUrl: profile.avatarUrl || '',
    talents: profile.talents || [],
    passions: profile.passions || [],
    dreams: profile.dreams || [],
    photos: (profile.photos || []).map(p => ({
      id: p.id || `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      url: p.url || '',
      title: p.title || '',
      caption: p.caption || '',
    })),
    socials: {
      github: profile.socials?.github || '',
      linkedin: profile.socials?.linkedin || '',
      email: profile.socials?.email || '',
    },
  });

  try {
    await setDoc(profileDocRef, safeProfile, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'profiles/main');
  }
}

export function subscribeEvidence(
  onEvidenceChange: (items: EvidenceItem[]) => void
) {
  const evidenceCollectionRef = collection(db, 'evidence');
  return onSnapshot(
    evidenceCollectionRef,
    async (snapshot) => {
      if (!snapshot.empty) {
        const items: EvidenceItem[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ ...(docSnap.data() as EvidenceItem), id: docSnap.id });
        });
        // Sort by date/sprint
        items.sort((a, b) => b.sprintId - a.sprintId);
        onEvidenceChange(items);
      } else {
        // Empty collection - no mock items
        onEvidenceChange([]);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'evidence');
    }
  );
}

export async function saveEvidenceToFirestore(item: EvidenceItem) {
  const docRef = doc(db, 'evidence', item.id);
  try {
    await setDoc(docRef, item);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `evidence/${item.id}`);
  }
}

export async function deleteEvidenceFromFirestore(id: string) {
  const docRef = doc(db, 'evidence', id);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `evidence/${id}`);
  }
}

// -------------------------------------------------------------
// Authentication Helpers
// -------------------------------------------------------------

export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}
