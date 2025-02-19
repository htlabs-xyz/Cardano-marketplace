import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'


const offerList = [
    {
        price: "100",
        time: "14:10",
        addr: "addr1qxegp84qufks983xnfczplquhz8l4elzwhylgk0ww5rq30hxh08546rlah0s3mn8ytkt7a59c5xrwwaap6utkafcu96qe0lsc8"
    },
    {
        price: "200",
        time: "Feb, 14:10",
        addr: "addr1qxegp84qufks983xnfczplquhz8l4elzwhylgk0ww5rq30hxh08546rlah0s3mn8ytkt7a59c5xrwwaap6utkafcu96qe0lsc8"
    },
    {
        price: "100",
        time: "Tues, 15:00",
        addr: "addr1qxegp84qufks983xnfczplquhz8l4elzwhylgk0ww5rq30hxh08546rlah0s3mn8ytkt7a59c5xrwwaap6utkafcu96qe0lsc8"
    },
    {
        price: "100",
        time: "Paid",
        addr: "addr1qxegp84qufks983xnfczplquhz8l4elzwhylgk0ww5rq30hxh08546rlah0s3mn8ytkt7a59c5xrwwaap6utkafcu96qe0lsc8"
    },
    {
        price: "100",
        time: "Paid",
        addr: "addr1qxegp84qufks983xnfczplquhz8l4elzwhylgk0ww5rq30hxh08546rlah0s3mn8ytkt7a59c5xrwwaap6utkafcu96qe0lsc8"
    },
]

export default function DetailsNFT() {
    return (
        <div className='flex py-10 space-x-5'>
            <div className='w-1/2 border rounded-lg overflow-hidden shadow-lg h-fit'>
                <Image
                    src="https://beyondidonline.com/wp-content/uploads/2023/03/what-is-nft-art-min.jpg"
                    alt="NFT image"
                    quality={100}
                    width={1000}
                    height={1000}
                    className="h-[30rem] w-100 object-contain bg-zinc-100"
                />
            </div>
            <div className='w-1/2 pt-5'>
                <div className="font-semibold text-2xl">The legendary hiphop boiz</div>
                <div>Owned by: <span className='text-blue-500'>addr..</span> </div>
                <div>Polycy ID: <span className='text-blue-500'>h3xu23u..</span> </div>
                <div className='border rounded-lg p-5 my-3'>
                    <div className="text-slate-500">Current Price</div>
                    <div className="font-semibold text-3xl">300 ₳</div>
                    <Separator className="my-4" />
                    <div className='grid grid-cols-2 gap-4'>
                        <Button> Buy now</Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant={'outline'}> Make offer</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Make an offer</DialogTitle>
                                </DialogHeader>
                                <div>
                                    <div>
                                        <Label >Enter amount to offer</Label>
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

                    </div>
                </div>
                <div className='border rounded-lg my-3'>
                    <div className="font-semibold text-xl px-5 py-3">Offers</div>
                    <Separator />
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='w-[50px] text-center'>No.</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead className='w-[100px]'>Time</TableHead>
                                <TableHead className='w-[150px] text-end' >Price</TableHead>
                                <TableHead className='w-[100px] text-end' >Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {offerList.map((x, i) => (
                                <TableRow key={i}>
                                    <TableCell className="text-center">{i + 1}</TableCell>
                                    <TableCell>{x.addr.substring(0, 10) + '...' + x.addr.substring(x.addr.length - 6)}</TableCell>
                                    <TableCell>{x.time}</TableCell>
                                    <TableCell className='text-end'>{x.price} ADA</TableCell>
                                    <TableCell className='text-end'>
                                        <Button size={"sm"} > Sell</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </div>
            </div>
        </div>
    )
}
