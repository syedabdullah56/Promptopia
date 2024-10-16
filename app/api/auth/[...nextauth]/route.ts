import NextAuth, { Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User from "@models/user";

// Extend the NextAuth Session type to include user id
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
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
                // Check if profile exists
                if (!profile || !profile.email) {
                    console.warn("Profile or profile email is undefined");
                    return false;
                }

                await connectToDB();

                // Check if the user already exists
                const userExists = await User.findOne({
                    email: profile.email,
                });

                // If not, create a new user
                if (!userExists) {
                    await User.create({
                        email: profile.email,
                        username: profile.name.replace(" ", "").toLowerCase(),
                        image: profile.picture,
                    });
                }

                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        }
    }
});

export { handler as GET, handler as POST };
