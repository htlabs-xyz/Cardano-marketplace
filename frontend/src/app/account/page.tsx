import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
export default function Account() {
  return (
    <div className="py-10">
      <div className="text-center text-3xl">My assets</div>
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
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Sell</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Make an sell</DialogTitle>
                </DialogHeader>
                <div>
                  <div>
                    <Label >Enter amount to sell</Label>
                    <Input placeholder='ADA' />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                  <Button>Submit</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
      <div className="text-center text-3xl mt-3">On market</div>
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
      </div>
    </div>
  )
}
