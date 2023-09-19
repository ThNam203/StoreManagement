import '../globals.css'
import * as React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='en'>
      <body>
        <div className="h-screen flex justify-center items-center">{children}</div>
      </body>
    </html>
  );
};

export default AuthLayout;
