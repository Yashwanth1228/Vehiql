import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      Hello world <br />
      <Button variant="destructive" className="bg-red-700 text-white">
        Click here{" "}
      </Button>
    </div>
  );
}
