import Input from "../../components/global/Input-field";
import Button from "../../components/global/button";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-6 text-black text-center">Login</h1>
        <form className="space-y-4">
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <Button>Login</Button>
        </form>
      </div>
    </div>
  );
}
