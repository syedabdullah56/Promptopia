

import '@styles/global.css';
import Nav from "@components/Nav";
import Provider from "@components/Provider";
import { ReactNode } from "react";

// Define the metadata
export const metadata = {
  title: 'Promptopia',
  description: 'Discover & Share AI Prompts',
};

// Define the props type
interface RootLayoutProps {
  children: ReactNode; // Specify that children can be any renderable React node
}

// Define the RootLayout component
const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <Provider>
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

// Ensure you export the component itself
export default RootLayout;
