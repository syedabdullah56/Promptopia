import NextAuth, { Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User from "@models/user";

// Extend the NextAuth Session type to include user id
declare module "next-auth" {
    interface Session {
        user: {
            id: string; // Added id property to user
            email: string;
            name: string;
            image: string;
        };
    }
}

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],

    callbacks: {
        async session({ session }: { session: Session }) {
            if (session?.user?.email) {
                await connectToDB();

                const sessionUser = await User.findOne({
                    email: session.user.email,
                });

                if (sessionUser) {
                    // Extend the session user to include id
                    session.user.id = sessionUser._id.toString();
                }

                return session;
            } else {
                console.warn("Session or user email is undefined");
                return session;
            }
        },

        async signIn({ profile }) {
            try {
                // Check if profile exists and has email
                if (!profile || !profile.email) {
                    console.warn("Profile or profile email is undefined");
                    return false; // Reject sign in
                }

                await connectToDB();

                // Check if the user already exists
                const userExists = await User.findOne({
                    email: profile.email,
                });

                // If not, create a new user
                if (!userExists) {
                    // Check if profile.name and profile.picture are defined
                    const username = profile.name ? profile.name.replace(" ", "").toLowerCase() : "user"; // Fallback to 'user' if name is undefined
                    const image = profile.picture || ""; // Fallback to empty string if picture is undefined

                    await User.create({
                        email: profile.email,
                        username: username,
                        image: image,
                    });
                }

                return true;
            } catch (error) {
                console.error("Error during sign in:", error);
                return false; // Handle error
            }
        }
    }
});

export { handler as GET, handler as POST };
