

export default {

    /**
     * 映射对象
     */
    mapper<EntityType, ModelType>(entity: EntityType, model: any): ModelType {

        Reflect.ownKeys(<Object>entity).forEach(property => {
            if (model.hasOwnProperty(property.toString())) {
                Reflect.set(<Object>model, property, Reflect.get(<Object>entity, property));
            }
        });
        return model;
    }
};

