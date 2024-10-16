import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User from "@models/user";

//next auth js to study about this:
const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],

    callbacks: {
        // Session callback
        async session({ session }: { session}) {
            if (session?.user?.email) {
                const sessionUser = await User.findOne({
                    email: session.user.email,
                });

                session.user.id = sessionUser._id.toString();

                return session;
            } else {
                console.warn("Session or user email is undefined");
            }
        },

        // Make sure to add a comma here
        async signIn({ profile }) {
            try {
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
