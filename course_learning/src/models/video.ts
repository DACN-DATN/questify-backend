import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { Level } from './level';
import { v4 as uuidv4 } from 'uuid';

const VideoDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  levelId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: Level,
      key: 'id',
    },
  },
  url: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
      isUrl: {
        msg: 'Must be a valid URL (e.g., https://example.com)',
      },
    },
  },
  position: {
    allowNull: false,
    type: DataTypes.INTEGER,
    validate: {
      notEmpty: true,
      min: 0,
    },
    defaultValue: 0,
  },
};

interface VideoAttributes {
  id: string;
  levelId: string;
  url: string;
  position: number;
}

type VideoCreationAttributes = Optional<VideoAttributes, 'id'>;

class Video extends Model<VideoAttributes, VideoCreationAttributes> implements VideoAttributes {
  public id!: string;
  public levelId!: string;
  public url!: string;
  public position!: number;
}

Video.init(VideoDefinition, {
  sequelize,
  tableName: 'videos',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  indexes: [
    {
      unique: true,
      fields: ['position'],
    },
  ],
});

export { Video };
