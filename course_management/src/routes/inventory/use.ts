import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Inventory } from '../../models/inventory';
import { InventoryItemTemplate } from '../../models/inventory-item-template';
import { ItemTemplate } from '../../models/item-template';
import {
  ResourcePrefix,
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
  EffectType,
} from '@datn242/questify-common';

const router = express.Router();

router.post(
  ResourcePrefix.CourseManagement + '/:course_id/inventory/use',
  requireAuth,
  [
    body('itemTemplateId')
      .notEmpty()
      .withMessage('Item template ID is required'),
    body('quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be a positive integer')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const courseId = req.params.course_id;
    const userId = req.currentUser!.id;
    const { itemTemplateId, quantity } = req.body;

    const inventory = await Inventory.findOne({
      where: {
        user_id: userId,
        course_id: courseId,
        isDeleted: false,
      },
    });

    if (!inventory) {
      throw new NotFoundError();
    }

    const inventoryItem = await InventoryItemTemplate.findOne({
      where: {
        inventory_id: inventory.id,
        item_template_id: itemTemplateId,
        isDeleted: false,
      },
    });

    if (!inventoryItem) {
      throw new NotFoundError();
    }

    if (inventoryItem.quantity < quantity) {
      throw new BadRequestError('Not enough items to use');
    }

    const itemTemplate = await ItemTemplate.findOne({
      where: {
        id: itemTemplateId,
        isDeleted: false,
      },
    });

    if (!itemTemplate) {
      throw new NotFoundError();
    }

    let goldBonus = 0;
    let experienceBonus = 0;

    // Update inventory and item quantity in a transaction
    await InventoryItemTemplate.sequelize!.transaction(async (transaction) => {
      // Apply gold bonus if applicable
      if (goldBonus > 0) {
        await Inventory.update(
          {
            gold: inventory.gold + goldBonus,
          },
          {
            where: {
              id: inventory.id,
            },
            transaction,
          }
        );
      }

      await InventoryItemTemplate.update(
        {
          quantity: inventoryItem.quantity - quantity,
        },
        {
          where: {
            id: inventoryItem.id,
          },
          transaction,
        }
      );
    });

    const updatedInventory = await Inventory.findByPk(inventory.id);
    const updatedInventoryItem = await InventoryItemTemplate.findByPk(inventoryItem.id);

    res.status(200).send({
      message: 'Item used successfully',
      inventory: {
        id: updatedInventory!.id,
        gold: updatedInventory!.gold,
      },
      item: {
        itemTemplateId: updatedInventoryItem!.item_template_id,
        quantity: updatedInventoryItem!.quantity,
      },
      effect: {
        type: itemTemplate.effect,
        description: itemTemplate.effect_description,
        goldBonus,
        experienceBonus,
      },
    });
  }
);

export { router as inventoryUseRouter };