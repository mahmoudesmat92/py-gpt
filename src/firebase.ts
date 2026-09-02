import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase with the custom database ID provided in the configuration
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Collection references
export const SESSIONS_COLLECTION = 'sessions';
export const GLOBALS_COLLECTION = 'globals';

// Interface matching the App state
import { ChatSession } from './types';

/**
 * Saves a single session to Firestore
 */
export async function saveSessionToCloud(session: ChatSession) {
  try {
    const sessionRef = doc(db, SESSIONS_COLLECTION, session.id);
    await setDoc(sessionRef, session, { merge: true });
  } catch (error) {
    console.error('[Firebase] Error saving session to cloud:', error);
  }
}

/**
 * Deletes a session from Firestore
 */
export async function deleteSessionFromCloud(sessionId: string) {
  try {
    const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
    await deleteDoc(sessionRef);
  } catch (error) {
    console.error('[Firebase] Error deleting session from cloud:', error);
  }
}

/**
 * Real-time listener for all sessions
 */
export function subscribeToSessions(onUpdate: (sessions: ChatSession[]) => void) {
  const sessionsRef = collection(db, SESSIONS_COLLECTION);
  return onSnapshot(sessionsRef, (snapshot) => {
    const sessionsList: ChatSession[] = [];
    snapshot.forEach((doc) => {
      sessionsList.push(doc.data() as ChatSession);
    });
    // Sort by createdAt descending
    sessionsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    onUpdate(sessionsList);
  }, (error) => {
    console.error('[Firebase] Sessions subscription error:', error);
  });
}

/**
 * Saves global dashboard scratchpad
 */
export async function saveScratchpadToCloud(text: string) {
  try {
    const scratchpadRef = doc(db, GLOBALS_COLLECTION, 'scratchpad');
    await setDoc(scratchpadRef, { text, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('[Firebase] Error saving scratchpad:', error);
  }
}

/**
 * Real-time listener for global scratchpad
 */
export function subscribeToScratchpad(onUpdate: (text: string) => void) {
  const scratchpadRef = doc(db, GLOBALS_COLLECTION, 'scratchpad');
  return onSnapshot(scratchpadRef, (docSnap) => {
    if (docSnap.exists()) {
      onUpdate(docSnap.data().text || '');
    }
  }, (error) => {
    console.error('[Firebase] Scratchpad subscription error:', error);
  });
}

/**
 * Saves score metrics to Firestore
 */
export async function saveScoresToCloud(scores: any) {
  try {
    const scoresRef = doc(db, GLOBALS_COLLECTION, 'scores');
    await setDoc(scoresRef, { scores, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('[Firebase] Error saving scores:', error);
  }
}

/**
 * Real-time listener for score metrics
 */
export function subscribeToScores(onUpdate: (scores: any) => void) {
  const scoresRef = doc(db, GLOBALS_COLLECTION, 'scores');
  return onSnapshot(scoresRef, (docSnap) => {
    if (docSnap.exists()) {
      onUpdate(docSnap.data().scores);
    }
  }, (error) => {
    console.error('[Firebase] Scores subscription error:', error);
  });
}
