exports.getOne = ( Model, _id ) => {
    return Model.findById({ _id });
}