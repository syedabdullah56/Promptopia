import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

// export const GET = async () => {    //No need of request it is giving error in vercel defined but never use
//     try {
//         await connectToDB();
//         const prompts = await Prompt.find({}).populate("creator");
//         return new Response(JSON.stringify(prompts), { status: 200 });
//     } catch (error) {
//         return new Response("Failed to fetch all prompts", { status: 500 });
//     }
// }

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        await connectToDB();
        const prompt = await Prompt.findById(params.id).populate("creator");

        return new Response(JSON.stringify(prompt), { status: 200 });
    } catch (error) {
        return new Response("Failed to fetch prompt", { status: 500 });
    }
}