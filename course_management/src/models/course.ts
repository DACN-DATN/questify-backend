import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';

class Course extends Model {
  public id!: string;
  public name!: string;
  public description!: string;
  public uploadDate!: Date;
  public backgroundImage!: string;
  public teacherId!: string;
  public pathId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Course.init(
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
    uploadDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    backgroundImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Course',
    tableName: 'courses',
  },
);

Course.belongsTo(User, {
  foreignKey: 'teacherId',
  constraints: true,
  scope: {
    role: 'teacher',
  },
});

export { Course };
