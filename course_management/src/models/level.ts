import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import { Island } from './island';

class Level extends Model {
  public id!: string;
  public name!: string;
  public description!: string;
  public position!: number;
  public islandId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Level.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    islandId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Island,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Level',
    tableName: 'levels',
  },
);

Level.belongsTo(Island, { foreignKey: 'islandId' });

export { Level };
