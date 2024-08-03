import { SignIn } from "@clerk/nextjs";

export default function Page() {
  // forceRedirect url here
  return (
    <div className="min-h-screen flex justify-center items-center bg-center bg-cover bg-[url('/bg/authbg-sm.svg')] sm:bg-[url('/bg/authbg-lg.svg')]">
      <SignIn forceRedirectUrl="/process-user" />
    </div>
  );
}
