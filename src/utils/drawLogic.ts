import { nanoid } from 'nanoid';
import { Participant, Couple, Draw } from '@/types/draw';
import fs from 'fs';
import * as process from "process";

/**
 * Generate a unique 6-character code
 */
export function generateDrawCode(): string {
  return nanoid(6).toUpperCase();
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Check if an assignment is valid based on couple restrictions
 */
function isValidAssignment(
  giverId: string,
  receiverId: string,
  couples: Couple[]
): boolean {
  // Can't give to yourself
  if (giverId === receiverId) return false;

  // Check couple restrictions
  for (const couple of couples) {
    if (
      (couple.person1Id === giverId && couple.person2Id === receiverId) ||
      (couple.person2Id === giverId && couple.person1Id === receiverId)
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Generate Secret Santa assignments
 * Uses a backtracking algorithm to ensure valid assignments
 */
export function generateAssignments(
  participants: Participant[],
  couples: Couple[]
): Record<string, string> | null {
  const assignments: Record<string, string> = {};
  const availableReceivers = new Set(participants.map(p => p.id));

  function backtrack(giverIndex: number): boolean {
    if (giverIndex === participants.length) {
      return true; // All assignments made successfully
    }

    const giver = participants[giverIndex];
    const shuffledReceivers = shuffle([...availableReceivers]);

    for (const receiverId of shuffledReceivers) {
      if (isValidAssignment(giver.id, receiverId, couples)) {
        assignments[giver.id] = receiverId;
        availableReceivers.delete(receiverId);

        if (backtrack(giverIndex + 1)) {
          return true;
        }

        // Backtrack
        delete assignments[giver.id];
        availableReceivers.add(receiverId);
      }
    }

    return false;
  }

  // Try multiple times with different shuffles
  for (let attempt = 0; attempt < 100; attempt++) {
    const shuffledParticipants = shuffle(participants);
    if (backtrack(0)) {
      // Re-map assignments to original participant IDs
      const finalAssignments: Record<string, string> = {};
      for (const participant of participants) {
        finalAssignments[participant.id] = assignments[participant.id];
      }
      return finalAssignments;
    }
    // Reset for next attempt
    Object.keys(assignments).forEach(key => delete assignments[key]);
    availableReceivers.clear();
    participants.forEach(p => availableReceivers.add(p.id));
  }

  return null; // Failed to generate valid assignments
}

/**
 * Save a draw to json file with draw code as filename in file system
 */
export function saveDraw(draw: Draw, drawCode: string): void {
  const fileName = `secret_santa_draw_${drawCode}.json`;
  const json = JSON.stringify(draw, null, 2);
  fs.writeFileSync(process.cwd()+`/data/${fileName}`, json, 'utf-8');
}

/**
 * Get all draws from file system
 */
export function getAllDraws(): Record<string, Draw> {
  const draws: Record<string, Draw> = {};
  const dataDir = process.cwd()+'/data';
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  const files = fs.readdirSync(dataDir);
  for (const file of files) {
    if (file.startsWith('secret_santa_draw_') && file.endsWith('.json')) {
      const filePath = `${dataDir}/${file}`;
      const json = fs.readFileSync(filePath, 'utf-8');
      const draw: Draw = JSON.parse(json);
      const code = file
        .replace('secret_santa_draw_', '')
        .replace('.json', '')
        .toUpperCase();
      draws[code] = draw;
    }
  }
  return draws;
}

/**
 * Get a specific draw by code
 */
export function getDrawByCode(code: string): Draw | null {
  const draws = getAllDraws();
  return draws[code.toUpperCase()] || null;
}

/**
 * Get assignment for a specific participant
 */
export function getAssignment(
  draw: Draw,
  participantId: string
): { giverName: string; receiverName: string } | null {
  const receiverId = draw.assignments[participantId];
  if (!receiverId) return null;

  const giver = draw.participants.find(p => p.id === participantId);
  const receiver = draw.participants.find(p => p.id === receiverId);

  if (!giver || !receiver) return null;

  return {
    giverName: giver.name,
    receiverName: receiver.name,
  };
}