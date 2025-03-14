import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import { Course } from './course';

class Island extends Model {
  public id!: string;
  public name!: string;
  public description!: string;
  public position!: number;
  public backgroundImage!: string;
  public courseId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Island.init(
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
    backgroundImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Course,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Island',
    tableName: 'islands',
  },
);

Island.belongsTo(Course, { foreignKey: 'courseId' });

export { Island };
