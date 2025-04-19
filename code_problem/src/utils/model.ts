import { Model, ModelStatic, WhereOptions, Attributes, Includeable } from 'sequelize';

export async function findByPkWithSoftDelete<M extends Model>(
  model: ModelStatic<M>,
  id: Attributes<M>['id'],
  where: WhereOptions<Attributes<M>> = {},
  include?: Includeable[],
): Promise<M | null> {
  return model.findOne({
    where: {
      ...where,
      id: id,
      isDeleted: false,
    } as WhereOptions<Attributes<M>>,
    include,
  });
}

export async function softDelete<M extends Model>(
  model: ModelStatic<M>,
  where: WhereOptions<Attributes<M>>,
): Promise<void> {
  await model.update({ isDeleted: true }, { where });
}
