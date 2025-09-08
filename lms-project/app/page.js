import Button from "../components/global/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <h1 className="text-3xl font-bold mb-4">Welcome to MyApp</h1>
      <p className="text-gray-600 mb-6">
        This is your home page. Start building your UI components here!
      </p>
      <Button>Get Started</Button>
    </div>
  );
}
