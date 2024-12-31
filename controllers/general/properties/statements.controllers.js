export const GetStatementsByProperty = async (req, res, next) => {
    // #swagger.tags = ['Users']
    // #swagger.summary = 'Get Statements for a Property'
    // #swagger.description = 'Retrieved document may contain unnecessary fields.'
    const { property } = req.query;
    const user_id = req?.user?.id;
    
    if( !user_id ) {
        return next(new apiError(400, `User required`));
    }
    
    if( !property ) {
        return next(new apiError(400, `Property ID required`));
    }
}