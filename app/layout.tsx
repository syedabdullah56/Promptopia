import '@styles/global.css';
import Nav from "@components/Nav";
import Provider from "@components/Provider";
import { Session } from "next-auth"; // Import Session type from NextAuth

// Define the metadata
export const metadata = {
  title: 'Promptopia',
  description: 'Discover & Share AI Prompts',
};

// Define the props type
interface RootLayoutProps {
  children: React.ReactNode; // Specify that children can be any renderable React node
  session: Session | null; // Optional: adjust if you don't have session
}

const RootLayout = ({ children, session }: RootLayoutProps) => {
  return (
    <html lang="en">
      <body>
        <Provider session={session}> {/* Pass the session prop here if needed */}
          <div className="main">
            <div className='gradient' />
          </div>

          <main className="app">
            <Nav />
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
};

// Correctly export the component
export default RootLayout;
