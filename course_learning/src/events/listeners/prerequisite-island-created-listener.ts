import { Message } from 'node-nats-streaming';
import { Subjects, Listener, PrerequisiteIslandCreatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { PrerequisiteIsland } from '../../models/prerequisite-island';

export class PrerequisiteIslandCreatedListener extends Listener<PrerequisiteIslandCreatedEvent> {
  subject: Subjects.PrerequisiteIslandCreated = Subjects.PrerequisiteIslandCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PrerequisiteIslandCreatedEvent['data'], msg: Message) {
    const { islandId, prerequisiteIslandId } = data;

    try {
      const existingPrerequisite = await PrerequisiteIsland.findOne({
        where: {
          islandId,
          prerequisiteIslandId,
        },
      });

      if (!existingPrerequisite) {
        const prerequisite = PrerequisiteIsland.build({
          islandId,
          prerequisiteIslandId,
        });

        await prerequisite.save();
      } else {
        console.log(`Prerequisite relationship already exists`);
      }

      msg.ack();
    } catch (error) {
      msg.ack();
    }
  }
}
