import Image from "next/image";
import IceCream from '../../public/ice_cream.svg'
import Diet from '../../public/diet.svg'
import { Button } from "@/components/ui/button";
import Link from "next/link";

const A = () => {
  return (
    <div className="flex justify-center items-center min-h-[100vh] w-[100vw]">
      <div className="flex">
        <div className="h-94 m-4 flex-col flex justify-center space-y-4">
          <Image src={IceCream} height={130} alt="" />
          <Link className="flex justify-center mt-16" href="/tracker">
            <Button className="bg-[#228B22]">Count Your Calories!</Button>
          </Link>
        </div>
        <div className="h-94 m-4 flex-col flex justify-center space-y-4">
          <Image src={Diet} height={130} alt="" />
          <Link className="flex justify-center mt-16" href="/meal">
            <Button className="bg-[#228B22]">Make a Meal!</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default A;