import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async () => {    //No need of request it is giving error in vercel defined but never use
    try {
        await connectToDB();
        const prompts = await Prompt.find({}).populate("creator");
        return new Response(JSON.stringify(prompts), { status: 200 });
    } catch (error) {
        return new Response("Failed to fetch all prompts", { status: 500 });
    }
}