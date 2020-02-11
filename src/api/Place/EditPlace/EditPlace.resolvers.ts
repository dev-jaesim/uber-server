import Place from "../../../entities/Place";
import User from "../../../entities/User";
import { EditPlaceMutationArgs, EditPlaceResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import cleanNullArgs from "../../../utils/cleanNullArg";
import privateResolver from "../../../utils/privateResolver";

const resolvers: Resolvers = {
    Mutation: {
        EditPlace: privateResolver(
            async (
                _,
                args: EditPlaceMutationArgs,
                { req }
            ): Promise<EditPlaceResponse> => {
                const user: User = req.user;
                try {
                    const place = await Place.findOne({ id: args.placeId });
                    if (place) {
                        if (place.userId === user.id) {

                            // original code starts
                            //const notNull = cleanNullArgs(args);
                            // original code ends

                            // modified code starts for error fixing
                            const notNull: any = cleanNullArgs(args);
                            if (notNull.placeId !== null) {
                                delete notNull.placeId;
                            }
                            // modified code ends for error fixing

                            await Place.update({ id: args.placeId }, { ...notNull });
                            return {
                                ok: true,
                                error: null
                            };
                        } else {
                            return {
                                ok: false,
                                error: "Not Authorized"
                            };
                        }
                    } else {
                        return {
                            ok: false,
                            error: "Place not found"
                        };
                    }
                } catch (error) {
                    return {
                        ok: false,
                        error: error.message
                    };
                }
            }
        )
    }
};
export default resolvers;