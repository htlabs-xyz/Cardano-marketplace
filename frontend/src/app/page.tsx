import Image from "next/image";
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="py-10">
      <div className="text-center text-3xl">List NFTs</div>
      <Separator className="my-4 bg-black" />
      <div className="grid grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <CardHeader className="p-0 border-b">
            <Image
              src="https://beyondidonline.com/wp-content/uploads/2023/03/what-is-nft-art-min.jpg"
              alt="NFT image"
              quality={100}
              width={1000}
              height={1000}
              className="h-60 object-contain bg-zinc-100"
            />
          </CardHeader>
          <CardContent className="px-4 py-2">
            <div className="font-semibold">The legendary hiphop boiz</div>
            <div className="text-sm">Price: 300 ₳</div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-end">
            <Button size={"sm"}>
              <Link href={"/assets/jj83xzj92q9df3jnij3nr23uf3i9j"}>
                Details
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="p-0 border-b">
            <Image
              src="https://beyondidonline.com/wp-content/uploads/2023/03/what-is-nft-art-min.jpg"
              alt="NFT image"
              quality={100}
              width={1000}
              height={1000}
              className="h-60 object-contain bg-zinc-100"
            />
          </CardHeader>
          <CardContent className="px-4 py-2">
            <div className="font-semibold">The legendary hiphop boiz</div>
            <div className="text-sm">Price: 300 ₳</div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-end">
            <Button size={"sm"}>
              <Link href={"/assets/jj83xzj92q9df3jnij3nr23uf3i9j"}>
                Details
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="p-0 border-b">
            <Image
              src="https://beyondidonline.com/wp-content/uploads/2023/03/what-is-nft-art-min.jpg"
              alt="NFT image"
              quality={100}
              width={1000}
              height={1000}
              className="h-60 object-contain bg-zinc-100"
            />
          </CardHeader>
          <CardContent className="px-4 py-2">
            <div className="font-semibold">The legendary hiphop boiz</div>
            <div className="text-sm">Price: 300 ₳</div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-end">
            <Button size={"sm"}>
              <Link href={"/assets/jj83xzj92q9df3jnij3nr23uf3i9j"}>
                Details
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
