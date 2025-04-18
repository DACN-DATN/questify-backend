import { Island } from '../models/island';
import { PrerequisiteIsland } from '../models/prerequisiteIsland';
import { Transaction } from 'sequelize';

export async function detectCycle(
  startIslandId: string,
  transaction?: any
): Promise<boolean> {
  const visited: Set<string> = new Set();
  const path: Set<string> = new Set();

  async function checkCycle(islandId: string): Promise<boolean> {
    if (path.has(islandId)) {
      return true;
    }

    if (visited.has(islandId)) {
      return false;
    }

    visited.add(islandId);
    path.add(islandId);

    const dependencies = await PrerequisiteIsland.findAll({
      where: { prerequisiteIslandId: islandId },
      transaction,
    });

    for (const dep of dependencies) {
      if (await checkCycle(dep.islandId)) {
        return true;
      }
    }

    path.delete(islandId);
    return false;
  }

  return checkCycle(startIslandId);
}

export const recalculatePositions = async (
  courseId: string,
  transaction?: Transaction,
  includeDeleted: boolean = false
): Promise<void> => {
  const whereClause = { courseId };

  if (!includeDeleted) {
    Object.assign(whereClause, { isDeleted: false });
  }

  const islands = await Island.findAll({
    where: whereClause,
    transaction,
  });

  const islandIds = islands.map(island => island.id);

  const allPrereqs = await PrerequisiteIsland.findAll({
    where: {
      islandId: islandIds,
    },
    transaction,
  });

  const graph: Record<string, string[]> = {};
  islands.forEach(island => {
    graph[island.id] = [];
  });

  allPrereqs.forEach(prereq => {
    if (graph[prereq.islandId]) {
      graph[prereq.islandId].push(prereq.prerequisiteIslandId);
    }
  });

  const inDegree: Record<string, number> = {};
  islands.forEach(island => {
    inDegree[island.id] = 0;
  });

  for (const [islandId, prereqIds] of Object.entries(graph)) {
    for (const prereqId of prereqIds) {
      inDegree[islandId] = (inDegree[islandId] || 0) + 1;
    }
  }

  const queue: string[] = [];
  const levels: Record<string, number> = {};

  for (const islandId of Object.keys(inDegree)) {
    if (inDegree[islandId] === 0) {
      queue.push(islandId);
      levels[islandId] = 0;
    }
  }

  while (queue.length > 0) {
    const currentId = queue.shift()!;

    for (const [islandId, prereqList] of Object.entries(graph)) {
      if (prereqList.includes(currentId)) {
        inDegree[islandId]--;

        if (inDegree[islandId] === 0) {
          queue.push(islandId);

          const prereqLevels = graph[islandId].map(prereqId => levels[prereqId] || 0);
          levels[islandId] = 1 + Math.max(...prereqLevels, 0);
        }
      }
    }
  }

  console.log('Calculated levels:', levels);

  const updatePromises = islands.map(island => {
    const newPosition = levels[island.id];
    if (newPosition !== undefined && newPosition !== island.position) {
      island.position = newPosition;
      return island.save({ transaction });
    }
    return Promise.resolve();
  });

  await Promise.all(updatePromises);
};